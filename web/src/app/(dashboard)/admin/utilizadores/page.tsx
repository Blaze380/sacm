'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

import { AdminHeader } from '@/components/admin/admin-header'
import { DeleteEntityDialog } from '@/components/admin/delete-entity-dialog'
import {
  ReadOnlyDetailSheet,
  type DetailField,
} from '@/components/admin/read-only-detail-sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { deleteUser } from '@/gen/clients/deleteUser'
import { findUserById } from '@/gen/clients/findUserById'
import { findUsers } from '@/gen/clients/findUsers'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'
import { formatDateTime } from '@/lib/format'
import { provinceLabels } from '@/lib/labels/appointment'

type UserRow = {
  id: string
  email: string
  firstName?: string
  lastName?: string
  phone?: string
  province?: string
  city?: string
  neighborhood?: string
  isActive: boolean
  lastLoginAt?: string
  createdAt?: string
}

function displayName(u: UserRow) {
  const name = [u.firstName, u.lastName].filter(Boolean).join(' ')
  return name || u.email
}

export default function UtilizadoresPage() {
  const [receptionists, setReceptionists] = useState<UserRow[]>([])
  const [admins, setAdmins] = useState<UserRow[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loadingRecep, setLoadingRecep] = useState(true)
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [deleteTarget, setDeleteTarget] = useState<UserRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [adminDetail, setAdminDetail] = useState<UserRow | null>(null)
  const [adminDetailFields, setAdminDetailFields] = useState<DetailField[]>([])
  const [detailOpen, setDetailOpen] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const loadReceptionists = useCallback(async () => {
    setLoadingRecep(true)
    try {
      const result = await findUsers(
        {
          limit: 100,
          sort: 'firstName',
          role: 'RECEPCIONISTA',
          ...(debouncedSearch
            ? { firstName: { icontains: debouncedSearch } }
            : {}),
        },
        { client: apiClient }
      )
      setReceptionists((result.data ?? []) as UserRow[])
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoadingRecep(false)
    }
  }, [debouncedSearch])

  const loadAdmins = useCallback(async () => {
    setLoadingAdmins(true)
    try {
      const result = await findUsers(
        {
          limit: 100,
          sort: 'firstName',
          role: 'ADMINISTRADOR',
          ...(debouncedSearch
            ? { firstName: { icontains: debouncedSearch } }
            : {}),
        },
        { client: apiClient }
      )
      setAdmins((result.data ?? []) as UserRow[])
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoadingAdmins(false)
    }
  }, [debouncedSearch])

  useEffect(() => {
    loadReceptionists()
    loadAdmins()
  }, [loadReceptionists, loadAdmins])

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteUser(deleteTarget.id, { client: apiClient })
      toast.success('Recepcionista eliminado.')
      setDeleteTarget(null)
      await loadReceptionists()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  async function openAdminDetail(user: UserRow) {
    try {
      const full = await findUserById(user.id, { client: apiClient })
      setAdminDetail(user)
      setAdminDetailFields([
        { label: 'Nome', value: displayName(full as UserRow) },
        { label: 'Email', value: full.email },
        { label: 'Telefone', value: full.phone },
        {
          label: 'Província',
          value: full.province
            ? provinceLabels[full.province] ?? full.province
            : undefined,
        },
        { label: 'Cidade', value: full.city },
        { label: 'Bairro', value: full.neighborhood },
        { label: 'Último login', value: formatDateTime(full.lastLoginAt) },
        { label: 'Criado em', value: formatDateTime(full.createdAt) },
      ])
      setDetailOpen(true)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <>
      <AdminHeader
        title="Utilizadores"
        crumbs={[
          { label: 'Admin', href: '/admin/especialidades' },
          { label: 'Utilizadores' },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <Input
          placeholder="Pesquisar por nome…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />

        <Tabs defaultValue="recepcionistas">
          <TabsList>
            <TabsTrigger value="recepcionistas">Recepcionistas</TabsTrigger>
            <TabsTrigger value="administradores">Administradores</TabsTrigger>
          </TabsList>

          <TabsContent value="recepcionistas" className="mt-4 space-y-4">
            <div className="flex justify-end">
              <Button size="sm" asChild>
                <Link href="/admin/utilizadores/novo">
                  <Plus className="size-4" />
                  Novo recepcionista
                </Link>
              </Button>
            </div>
            <UserTable
              rows={receptionists}
              loading={loadingRecep}
              emptyTitle="Sem recepcionistas"
              emptyDescription="Adicione recepcionistas para operações no balcão."
              showActions
              onDelete={setDeleteTarget}
            />
          </TabsContent>

          <TabsContent value="administradores" className="mt-4">
            <UserTable
              rows={admins}
              loading={loadingAdmins}
              emptyTitle="Sem administradores"
              emptyDescription="Contas de administrador aparecem aqui em modo de consulta."
              showView
              onView={openAdminDetail}
            />
          </TabsContent>
        </Tabs>
      </div>

      <DeleteEntityDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="Eliminar recepcionista?"
        description={`Esta acção remove "${deleteTarget ? displayName(deleteTarget) : ''}" permanentemente.`}
        onConfirm={handleDelete}
        loading={deleting}
      />

      <ReadOnlyDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={adminDetail ? displayName(adminDetail) : 'Administrador'}
        description="Conta de administrador (apenas visualização)"
        fields={adminDetailFields}
      />
    </>
  )
}

function UserTable({
  rows,
  loading,
  emptyTitle,
  emptyDescription,
  showActions,
  showView,
  onDelete,
  onView,
}: {
  rows: UserRow[]
  loading: boolean
  emptyTitle: string
  emptyDescription: string
  showActions?: boolean
  showView?: boolean
  onDelete?: (user: UserRow) => void
  onView?: (user: UserRow) => void
}) {
  const colCount = showActions || showView ? 5 : 4

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Telefone</TableHead>
            {showActions ? <TableHead>Estado</TableHead> : <TableHead>Último login</TableHead>}
            {(showActions || showView) && <TableHead className="w-12" />}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={colCount}>
                  <Skeleton className="h-5 w-full" />
                </TableCell>
              </TableRow>
            ))
          ) : rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colCount} className="p-0">
                <Empty className="border-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <Plus />
                    </EmptyMedia>
                    <EmptyTitle>{emptyTitle}</EmptyTitle>
                    <EmptyDescription>{emptyDescription}</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              </TableCell>
            </TableRow>
          ) : (
            rows.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{displayName(user)}</TableCell>
                <TableCell className="text-muted-foreground">{user.email}</TableCell>
                <TableCell className="text-muted-foreground">{user.phone ?? '—'}</TableCell>
                {showActions ? (
                  <TableCell>
                    <Badge variant={user.isActive ? 'default' : 'secondary'}>
                      {user.isActive ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                ) : (
                  <TableCell className="text-muted-foreground">
                    {formatDateTime(user.lastLoginAt)}
                  </TableCell>
                )}
                {(showActions || showView) && (
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon-sm">
                          <MoreHorizontal className="size-4" />
                          <span className="sr-only">Acções</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {showView && onView && (
                          <DropdownMenuItem onClick={() => onView(user)}>
                            <Eye className="size-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                        )}
                        {showActions && (
                          <>
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/utilizadores/${user.id}`}>
                                <Pencil className="size-4" />
                                Editar
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => onDelete?.(user)}
                            >
                              <Trash2 className="size-4" />
                              Eliminar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
