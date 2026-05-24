'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

import { AdminHeader } from '@/components/admin/admin-header'
import {
  ReadOnlyDetailSheet,
  type DetailField,
} from '@/components/admin/read-only-detail-sheet'
import { Badge } from '@/components/ui/badge'
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { findAppointmentById } from '@/gen/clients/findAppointmentById'
import { findAppointments } from '@/gen/clients/findAppointments'
import { findConsultationTypes } from '@/gen/clients/findConsultationTypes'
import { findDoctors } from '@/gen/clients/findDoctors'
import { findSpecialties } from '@/gen/clients/findSpecialties'
import { findUsers } from '@/gen/clients/findUsers'
import type { FindAppointmentsQueryParamsStatusEnumKey } from '@/gen/models/FindAppointments'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'
import { formatDateTime } from '@/lib/format'
import {
  appointmentPriorityLabels,
  appointmentSourceLabels,
  appointmentStatusLabels,
} from '@/lib/labels/appointment'
import { CalendarCheck } from 'lucide-react'

type AppointmentRow = {
  id: string
  date: string
  patientId: string
  specialtyId: string
  consultationTypeId: string
  doctorId?: string
  status: string
  priority: string
  source: string
  notes?: string
  triageId?: string
  createdAt?: string
}

type LookupMaps = {
  patients: Record<string, string>
  specialties: Record<string, string>
  consultationTypes: Record<string, string>
  doctors: Record<string, string>
}

const PAGE_SIZE = 20

const statusOptions: { value: 'all' | FindAppointmentsQueryParamsStatusEnumKey; label: string }[] = [
  { value: 'all', label: 'Todos os estados' },
  ...Object.entries(appointmentStatusLabels).map(([value, label]) => ({
    value: value as FindAppointmentsQueryParamsStatusEnumKey,
    label,
  })),
]

export default function ConsultasPage() {
  const [appointments, setAppointments] = useState<AppointmentRow[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState<'all' | FindAppointmentsQueryParamsStatusEnumKey>('all')
  const [specialtyFilter, setSpecialtyFilter] = useState('all')
  const [loading, setLoading] = useState(true)
  const [maps, setMaps] = useState<LookupMaps>({
    patients: {},
    specialties: {},
    consultationTypes: {},
    doctors: {},
  })
  const [detailOpen, setDetailOpen] = useState(false)
  const [detailFields, setDetailFields] = useState<DetailField[]>([])
  const [detailTitle, setDetailTitle] = useState('')

  const loadMaps = useCallback(async () => {
    const [usersRes, specialtiesRes, typesRes, doctorsRes] = await Promise.all([
      findUsers({ limit: 100, sort: 'firstName' }, { client: apiClient }),
      findSpecialties({ limit: 100, sort: 'name' }, { client: apiClient }),
      findConsultationTypes({ limit: 100, sort: 'name' }, { client: apiClient }),
      findDoctors({ limit: 100, sort: 'firstName' }, { client: apiClient }),
    ])

    const patients: Record<string, string> = {}
    for (const u of usersRes.data ?? []) {
      const name = [u.firstName, u.lastName].filter(Boolean).join(' ')
      patients[u.id] = name || u.email
    }

    const specialties: Record<string, string> = {}
    for (const s of specialtiesRes.data ?? []) {
      if (s.id && s.name) specialties[s.id] = s.name
    }

    const consultationTypes: Record<string, string> = {}
    for (const t of typesRes.data ?? []) {
      if (t.id && t.name) consultationTypes[t.id] = t.name
    }

    const doctors: Record<string, string> = {}
    for (const d of doctorsRes.data ?? []) {
      doctors[d.id] = [d.firstName, d.lastName].filter(Boolean).join(' ')
    }

    setMaps({ patients, specialties, consultationTypes, doctors })
  }, [])

  const loadAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const result = await findAppointments(
        {
          page,
          limit: PAGE_SIZE,
          sort: '-date',
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
          ...(specialtyFilter !== 'all'
            ? { specialty: { id: specialtyFilter } }
            : {}),
        },
        { client: apiClient }
      )
      setAppointments((result.data ?? []) as AppointmentRow[])
      setTotal(result.total ?? 0)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [page, statusFilter, specialtyFilter])

  useEffect(() => {
    loadMaps().catch((e) => toast.error(getApiErrorMessage(e)))
  }, [loadMaps])

  useEffect(() => {
    loadAppointments()
  }, [loadAppointments])

  useEffect(() => {
    setPage(1)
  }, [statusFilter, specialtyFilter])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))

  async function openDetail(id: string) {
    try {
      const appt = await findAppointmentById(id, { client: apiClient })
      setDetailTitle(`Consulta — ${formatDateTime(appt.date)}`)
      setDetailFields([
        { label: 'Data/hora', value: formatDateTime(appt.date) },
        {
          label: 'Paciente',
          value: maps.patients[appt.patientId] ?? appt.patientId,
        },
        {
          label: 'Especialidade',
          value: maps.specialties[appt.specialtyId] ?? appt.specialtyId,
        },
        {
          label: 'Tipo de consulta',
          value:
            maps.consultationTypes[appt.consultationTypeId] ??
            appt.consultationTypeId,
        },
        {
          label: 'Médico',
          value: appt.doctorId
            ? maps.doctors[appt.doctorId] ?? appt.doctorId
            : '—',
        },
        {
          label: 'Estado',
          value: appointmentStatusLabels[appt.status] ?? appt.status,
        },
        {
          label: 'Prioridade',
          value: appointmentPriorityLabels[appt.priority] ?? appt.priority,
        },
        {
          label: 'Origem',
          value: appointmentSourceLabels[appt.source] ?? appt.source,
        },
        { label: 'Notas', value: appt.notes ?? '—' },
        { label: 'ID triagem', value: appt.triageId ?? '—' },
        { label: 'Criado em', value: formatDateTime(appt.createdAt) },
        { label: 'Actualizado em', value: formatDateTime(appt.updatedAt) },
      ])
      setDetailOpen(true)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    }
  }

  return (
    <>
      <AdminHeader
        title="Consultas"
        crumbs={[
          { label: 'Admin', href: '/admin/especialidades' },
          { label: 'Consultas' },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as 'all' | FindAppointmentsQueryParamsStatusEnumKey)
            }
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={specialtyFilter} onValueChange={setSpecialtyFilter}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Especialidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as especialidades</SelectItem>
              {Object.entries(maps.specialties).map(([id, name]) => (
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
                <TableHead>Data/hora</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Especialidade</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Médico</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Prioridade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell colSpan={7}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : appointments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="p-0">
                    <Empty className="border-0">
                      <EmptyHeader>
                        <EmptyMedia variant="icon">
                          <CalendarCheck />
                        </EmptyMedia>
                        <EmptyTitle>Sem consultas</EmptyTitle>
                        <EmptyDescription>
                          Não há consultas com os filtros seleccionados.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </TableCell>
                </TableRow>
              ) : (
                appointments.map((appt) => (
                  <TableRow
                    key={appt.id}
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => openDetail(appt.id)}
                  >
                    <TableCell>{formatDateTime(appt.date)}</TableCell>
                    <TableCell>
                      {maps.patients[appt.patientId] ?? '—'}
                    </TableCell>
                    <TableCell>
                      {maps.specialties[appt.specialtyId] ?? '—'}
                    </TableCell>
                    <TableCell className="max-w-[140px] truncate">
                      {maps.consultationTypes[appt.consultationTypeId] ?? '—'}
                    </TableCell>
                    <TableCell>
                      {appt.doctorId
                        ? maps.doctors[appt.doctorId] ?? '—'
                        : '—'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {appointmentStatusLabels[appt.status] ?? appt.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {appointmentPriorityLabels[appt.priority] ??
                          appt.priority}
                      </Badge>
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
                  className={
                    page >= totalPages ? 'pointer-events-none opacity-50' : ''
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>

      <ReadOnlyDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title={detailTitle}
        description="Visualização apenas — sem alterações"
        fields={detailFields}
      />
    </>
  )
}
