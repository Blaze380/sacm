'use client'

import { useCallback, useEffect, useState } from 'react'
import { format } from 'date-fns'
import { pt } from 'date-fns/locale'
import { Check, Eye, X } from 'lucide-react'
import { toast } from 'sonner'

import { AdminHeader } from '@/components/admin/admin-header'
import { ReadOnlyDetailSheet, type DetailField } from '@/components/admin/read-only-detail-sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { approveTriage } from '@/gen/clients/approveTriage'
import { findConsultationTypes } from '@/gen/clients/findConsultationTypes'
import { findSpecialties } from '@/gen/clients/findSpecialties'
import { findTriages } from '@/gen/clients/findTriages'
import { rejectTriage } from '@/gen/clients/rejectTriage'
import { startTriageReview } from '@/gen/clients/startTriageReview'
import type { TriageResponse } from '@/gen/models/TriageResponse'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'
import {
  getTriageBadgeVariant,
  PRIORITY_LABELS,
  TRIAGE_STATUS_LABELS,
} from '@/lib/labels/triage'

type TriageRow = NonNullable<TriageResponse['data']>

type StatusTab = 'PENDENTE' | 'EM_ANALISE' | 'history'

function patientName(row: TriageRow): string {
  const p = row.patient
  if (p?.firstName || p?.lastName) {
    return [p.firstName, p.lastName].filter(Boolean).join(' ')
  }
  return row.patientId?.slice(0, 8) ?? '—'
}

export default function TriagensPage() {
  const [tab, setTab] = useState<StatusTab>('PENDENTE')
  const [triages, setTriages] = useState<TriageRow[]>([])
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const [detailOpen, setDetailOpen] = useState(false)
  const [selected, setSelected] = useState<TriageRow | null>(null)

  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([])
  const [consultationTypes, setConsultationTypes] = useState<{ id: string; name: string }[]>([])
  const [specialtyId, setSpecialtyId] = useState('')
  const [consultationTypeId, setConsultationTypeId] = useState('')
  const [priority, setPriority] = useState<'BAIXA' | 'MEDIA' | 'ALTA'>('MEDIA')
  const [rejectionReason, setRejectionReason] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300)
    return () => clearTimeout(timer)
  }, [search])

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params =
        tab === 'history'
          ? { limit: 100, sort: '-createdAt' as const }
          : {
              limit: 100,
              sort: '-createdAt' as const,
              status: tab,
            }

      const result = await findTriages(
        {
          ...params,
          ...(debouncedSearch
            ? { complaint: { icontains: debouncedSearch } }
            : {}),
        },
        { client: apiClient }
      )

      let rows = (result.data ?? []) as TriageRow[]
      if (tab === 'history') {
        rows = rows.filter(
          (t) => t.status === 'REENCAMINHADO' || t.status === 'CANCELADO'
        )
      }
      setTriages(rows)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [tab, debouncedSearch])

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!approveOpen) return
    Promise.all([
      findSpecialties({ limit: 100, sort: 'name' }, { client: apiClient }),
      findConsultationTypes({ limit: 100, sort: 'name' }, { client: apiClient }),
    ])
      .then(([specs, types]) => {
        setSpecialties(
          (specs.data ?? []).filter((s) => s.id && s.name) as { id: string; name: string }[]
        )
        setConsultationTypes(
          (types.data ?? []).filter((t) => t.id && t.name) as { id: string; name: string }[]
        )
      })
      .catch((error) => toast.error(getApiErrorMessage(error)))
  }, [approveOpen])

  async function openDetail(row: TriageRow) {
    setSelected(row)
    setDetailOpen(true)
    if (row.status === 'PENDENTE' && row.id) {
      try {
        await startTriageReview(row.id, { client: apiClient })
        await load()
        setSelected((prev) =>
          prev?.id === row.id ? { ...prev, status: 'EM_ANALISE' } : prev
        )
      } catch {
        // non-blocking if already in review
      }
    }
  }

  function openApprove(row: TriageRow) {
    setSelected(row)
    setSpecialtyId(row.specialtyId ?? '')
    setConsultationTypeId(row.consultationTypeId ?? '')
    setPriority((row.priority as 'BAIXA' | 'MEDIA' | 'ALTA') ?? 'MEDIA')
    setApproveOpen(true)
  }

  function openReject(row: TriageRow) {
    setSelected(row)
    setRejectionReason('')
    setRejectOpen(true)
  }

  async function handleApprove() {
    if (!selected?.id || !specialtyId || !consultationTypeId) {
      toast.error('Preencha especialidade, tipo de consulta e prioridade.')
      return
    }
    setActionLoading(true)
    try {
      await approveTriage(
        selected.id,
        { specialtyId, consultationTypeId, priority },
        { client: apiClient }
      )
      toast.success('Triagem aprovada e paciente reencaminhado.')
      setApproveOpen(false)
      setDetailOpen(false)
      await load()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  async function handleReject() {
    if (!selected?.id) return
    setActionLoading(true)
    try {
      await rejectTriage(
        selected.id,
        rejectionReason.trim() ? { rejectionReason: rejectionReason.trim() } : undefined,
        { client: apiClient }
      )
      toast.success('Triagem rejeitada.')
      setRejectOpen(false)
      setDetailOpen(false)
      await load()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setActionLoading(false)
    }
  }

  const canDecide =
    selected?.status === 'PENDENTE' || selected?.status === 'EM_ANALISE'

  const detailFields: DetailField[] = selected
    ? [
        { label: 'Paciente', value: patientName(selected) },
        { label: 'Email', value: selected.patient?.email },
        { label: 'Telefone', value: selected.patient?.phone },
        { label: 'Estado', value: TRIAGE_STATUS_LABELS[selected.status ?? ''] ?? selected.status },
        { label: 'Queixa principal', value: selected.complaint },
        { label: 'Sintoma', value: selected.symptom },
        { label: 'Duração dos sintomas', value: selected.symptomDuration },
        { label: 'Acção tomada', value: selected.actionTaken },
        { label: 'Reação após acção', value: selected.reactionAfterAction },
        {
          label: 'Submetida em',
          value: selected.createdAt
            ? format(new Date(selected.createdAt), "d MMM yyyy 'às' HH:mm", {
                locale: pt,
              })
            : '—',
        },
        ...(selected.specialty?.name
          ? [{ label: 'Especialidade', value: selected.specialty.name }]
          : []),
        ...(selected.consultationType?.name
          ? [{ label: 'Tipo de consulta', value: selected.consultationType.name }]
          : []),
        ...(selected.priority
          ? [{ label: 'Prioridade', value: PRIORITY_LABELS[selected.priority] ?? selected.priority }]
          : []),
        ...(selected.rejectionReason
          ? [{ label: 'Motivo da rejeição', value: selected.rejectionReason }]
          : []),
      ]
    : []

  return (
    <>
      <AdminHeader
        title="Triagens"
        crumbs={[
          { label: 'Admin', href: '/admin/triagens' },
          { label: 'Triagens' },
        ]}
      />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as StatusTab)}
          >
            <TabsList>
              <TabsTrigger value="PENDENTE">Pendentes</TabsTrigger>
              <TabsTrigger value="EM_ANALISE">Em análise</TabsTrigger>
              <TabsTrigger value="history">Histórico</TabsTrigger>
            </TabsList>
          </Tabs>
          <Input
            placeholder="Pesquisar por queixa…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-xs"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : triages.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia />
              <EmptyTitle>Sem triagens</EmptyTitle>
              <EmptyDescription>
                Não há triagens neste filtro.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Paciente</TableHead>
                <TableHead>Queixa</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="w-[120px]">Acções</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {triages.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="whitespace-nowrap text-muted-foreground">
                    {row.createdAt
                      ? format(new Date(row.createdAt), 'd MMM yyyy', { locale: pt })
                      : '—'}
                  </TableCell>
                  <TableCell>{patientName(row)}</TableCell>
                  <TableCell className="max-w-[240px] truncate">
                    {row.complaint}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTriageBadgeVariant(row.status ?? '')}>
                      {TRIAGE_STATUS_LABELS[row.status ?? ''] ?? row.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        title="Ver detalhes"
                        onClick={() => openDetail(row)}
                      >
                        <Eye className="size-4" />
                      </Button>
                      {(row.status === 'PENDENTE' || row.status === 'EM_ANALISE') && (
                        <>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Aprovar"
                            onClick={() => openApprove(row)}
                          >
                            <Check className="size-4 text-green-600" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            title="Rejeitar"
                            onClick={() => openReject(row)}
                          >
                            <X className="size-4 text-destructive" />
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>

      <ReadOnlyDetailSheet
        open={detailOpen}
        onOpenChange={setDetailOpen}
        title="Detalhe da triagem"
        description={selected ? patientName(selected) : undefined}
        fields={detailFields}
      />

      {detailOpen && selected && canDecide ? (
        <div className="fixed bottom-6 right-6 z-50 flex gap-2">
          <Button variant="outline" onClick={() => openReject(selected)}>
            Rejeitar
          </Button>
          <Button onClick={() => openApprove(selected)}>Aprovar</Button>
        </div>
      ) : null}

      <Dialog open={approveOpen} onOpenChange={setApproveOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Aprovar e reencaminhar</DialogTitle>
            <DialogDescription>
              Defina especialidade, tipo de consulta e prioridade para o paciente
              agendar.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel>Especialidade</FieldLabel>
              <Select value={specialtyId} onValueChange={setSpecialtyId}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar…" />
                </SelectTrigger>
                <SelectContent>
                  {specialties.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Tipo de consulta</FieldLabel>
              <Select
                value={consultationTypeId}
                onValueChange={setConsultationTypeId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar…" />
                </SelectTrigger>
                <SelectContent>
                  {consultationTypes.map((t) => (
                    <SelectItem key={t.id} value={t.id}>
                      {t.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Prioridade</FieldLabel>
              <Select
                value={priority}
                onValueChange={(v) => setPriority(v as 'BAIXA' | 'MEDIA' | 'ALTA')}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BAIXA">{PRIORITY_LABELS.BAIXA}</SelectItem>
                  <SelectItem value="MEDIA">{PRIORITY_LABELS.MEDIA}</SelectItem>
                  <SelectItem value="ALTA">{PRIORITY_LABELS.ALTA}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          <DialogFooter>
            <Button variant="outline" onClick={() => setApproveOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleApprove} disabled={actionLoading}>
              {actionLoading ? 'A guardar…' : 'Confirmar aprovação'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Rejeitar triagem</AlertDialogTitle>
            <AlertDialogDescription>
              O paciente será notificado de que a solicitação foi cancelada.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <Field>
            <FieldLabel>Motivo (opcional)</FieldLabel>
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Indique o motivo da rejeição…"
              rows={3}
            />
          </Field>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={actionLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={actionLoading}
              onClick={(e) => {
                e.preventDefault()
                handleReject()
              }}
            >
              {actionLoading ? 'A rejeitar…' : 'Rejeitar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
