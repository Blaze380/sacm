'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { MoreHorizontal, Pencil, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { AdminHeader } from '@/components/admin/admin-header'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { findDoctors } from '@/gen/clients/findDoctors'
import { findSpecialties } from '@/gen/clients/findSpecialties'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'

type DoctorRow = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  specialtyId: string
}

export default function MedicosPage() {
  const [doctors, setDoctors] = useState<DoctorRow[]>([])
  const [specialtyMap, setSpecialtyMap] = useState<Record<string, string>>({})
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const [doctorsResult, specialtiesResult] = await Promise.all([
        findDoctors(
          {
            limit: 100,
            sort: 'firstName',
            ...(debouncedSearch
              ? { firstName: { icontains: debouncedSearch } }
              : {}),
            ...(specialtyFilter !== 'all'
              ? { specialty: { id: specialtyFilter } }
              : {}),
          },
          { client: apiClient }
        ),
        findSpecialties({ limit: 100, sort: 'name' }, { client: apiClient }),
      ])

      const map: Record<string, string> = {}
      for (const s of specialtiesResult.data ?? []) {
        if (s.id && s.name) map[s.id] = s.name
      }
      setSpecialtyMap(map)
      setDoctors((doctorsResult.data ?? []) as DoctorRow[])
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, specialtyFilter])

  useEffect(() => {
    load()
  }, [load])

  function displayName(d: DoctorRow) {
    return [d.firstName, d.lastName].filter(Boolean).join(' ')
  }

  return (
    <>
      <AdminHeader
        title="Médicos"
        crumbs={[
          { label: 'Admin', href: '/admin/especialidades' },
          { label: 'Médicos' },
        ]}
        action={
          <Button size="sm" asChild>
            <Link href="/admin/medicos/novo">
              <Plus className="size-4" />
              Novo médico
            </Link>
          </Button>
        }
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Input
            placeholder="Pesquisar por nome…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as especialidades</SelectItem>
              {Object.entries(specialtyMap).map(([id, name]) => (
                <SelectItem key={id} value={id}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead className="w-12" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={4}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : doctors.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="p-0">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <Plus />
                        </EmptyMedia>
                        <EmptyTitle>Sem médicos</EmptyTitle>
                        <EmptyDescription>
                          Cadastre médicos informativos para agendamento e triagem.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                doctors.map((doctor) => (
                  <TableRow key={doctor.id}>
                    <TableCell className="font-medium">{displayName(doctor)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {doctor.email ?? doctor.phone ?? '—'}
                    </TableCell>
                    <TableCell>
                      {specialtyMap[doctor.specialtyId] ?? '—'}
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
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/medicos/${doctor.id}`}>
                              <Pencil className="size-4" />
                              Editar
                            </Link>
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
      </div>
    </>
  )
}
