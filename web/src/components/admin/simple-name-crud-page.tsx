'use client'

import { useCallback, useEffect, useState } from 'react'
import { MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { AdminHeader } from '@/components/admin/admin-header'
import { DeleteEntityDialog } from '@/components/admin/delete-entity-dialog'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'
import { formatDateTime } from '@/lib/format'

type NamedEntity = {
  id: string
  name: string
  updatedAt?: string
}

type SimpleNameCrudConfig = {
  title: string
  singularLabel: string
  breadcrumbs: { label: string; href?: string }[]
  listPath: string
  pageSize?: number
  fetchList: (params: {
    page: number
    limit: number
    search: string
  }) => Promise<{ data?: NamedEntity[]; total?: number }>
  createItem: (name: string) => Promise<void>
  updateItem: (id: string, name: string) => Promise<void>
  deleteItem: (id: string) => Promise<void>
}

export function SimpleNameCrudPage({ config }: { config: SimpleNameCrudConfig }) {
  const pageSize = config.pageSize ?? 10
  const [items, setItems] = useState<NamedEntity[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<NamedEntity | null>(null)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<NamedEntity | null>(null)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const result = await config.fetchList({
        page,
        limit: pageSize,
        search: debouncedSearch,
      })
      setItems(result.data ?? [])
      setTotal(result.total ?? 0)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [config, page, pageSize, debouncedSearch])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function openCreate() {
    setEditing(null)
    setName('')
    setDialogOpen(true)
  }

  function openEdit(item: NamedEntity) {
    setEditing(item)
    setName(item.name)
    setDialogOpen(true)
  }

  async function handleSave() {
    const trimmed = name.trim()
    if (!trimmed) {
      toast.error('O nome é obrigatório.')
      return
    }
    setSaving(true)
    try {
      if (editing) {
        await config.updateItem(editing.id, trimmed)
        toast.success(`${config.singularLabel} actualizado.`)
      } else {
        await config.createItem(trimmed)
        toast.success(`${config.singularLabel} criado.`)
      }
      setDialogOpen(false)
      await load()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await config.deleteItem(deleteTarget.id)
      toast.success(`${config.singularLabel} eliminado.`)
      setDeleteTarget(null)
      await load()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <AdminHeader
        title={config.title}
        crumbs={config.breadcrumbs}
        action={
          <Button size="sm" onClick={openCreate}>
            <Plus className="size-4" />
            Novo
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex items-center gap-3">
          <Input
            placeholder={`Pesquisar ${config.title.toLowerCase()}…`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Actualizado</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={3}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="p-0">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Plus />
                        </EmptyMedia>
                        <EmptyTitle>Sem registos</EmptyTitle>
                        <EmptyDescription>
                          Crie o primeiro registo de {config.title.toLowerCase()}.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(item.updatedAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon-sm">
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Acções</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => openEdit(item)}>
                            <Pencil className="size-4" />
                            Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onClick={() => setDeleteTarget(item)}
                          >
                            <Trash2 className="size-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                  aria-disabled={page <= 1}
                  className={page <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }).map((_, i) => {
                const pageNum = i + 1
                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href="#"
                      isActive={pageNum === page}
                      onClick={(e) => {
                        e.preventDefault()
                        setPage(pageNum)
                      }}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                )
              })}
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                  aria-disabled={page >= totalPages}
                  className={page >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? `Editar ${config.singularLabel.toLowerCase()}` : `Novo ${config.singularLabel.toLowerCase()}`}
            </DialogTitle>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'A guardar…' : 'Guardar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <DeleteEntityDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title={`Eliminar ${config.singularLabel.toLowerCase()}?`}
        description={`Esta acção remove "${deleteTarget?.name}" permanentemente.`}
        onConfirm={handleDelete}
        loading={deleting}
      />
    </>
  )
}
