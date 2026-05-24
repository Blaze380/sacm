'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { AdminHeader } from '@/components/admin/admin-header'
import { DoctorAvailabilityEditor } from '@/components/admin/doctor-availability-editor'
import { Button } from '@/components/ui/button'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { createDoctor } from '@/gen/clients/createDoctor'
import { findDoctorById } from '@/gen/clients/findDoctorById'
import { findSpecialties } from '@/gen/clients/findSpecialties'
import { updateDoctor } from '@/gen/clients/updateDoctor'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'
import {
  defaultDoctorAvailability,
  type DoctorAvailability,
} from '@/lib/types/doctor'

function parseAvailability(value: unknown): DoctorAvailability {
  if (value && typeof value === 'object') {
    return { ...defaultDoctorAvailability, ...(value as DoctorAvailability) }
  }
  return defaultDoctorAvailability
}

export default function MedicoFormPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = params.id === 'novo'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [specialties, setSpecialties] = useState<{ id: string; name: string }[]>([])

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [specialtyId, setSpecialtyId] = useState('')
  const [availability, setAvailability] = useState<DoctorAvailability>(
    defaultDoctorAvailability
  )

  const loadSpecialties = useCallback(async () => {
    const result = await findSpecialties({ limit: 100, sort: 'name' }, { client: apiClient })
    setSpecialties((result.data ?? []).map((s) => ({ id: s.id, name: s.name })))
  }, [])

  const loadDoctor = useCallback(async () => {
    if (isNew) return
    setLoading(true)
    try {
      const doctor = await findDoctorById(params.id, { client: apiClient })
      setFirstName(doctor.firstName)
      setLastName(doctor.lastName)
      setEmail(doctor.email ?? '')
      setPhone(doctor.phone ?? '')
      setSpecialtyId(doctor.specialtyId)
      setAvailability(parseAvailability(doctor.availability))
    } catch (error) {
      toast.error(getApiErrorMessage(error))
      router.push('/admin/medicos')
    } finally {
      setLoading(false)
    }
  }, [isNew, params.id, router])

  useEffect(() => {
    loadSpecialties().catch((e) => toast.error(getApiErrorMessage(e)))
  }, [loadSpecialties])

  useEffect(() => {
    loadDoctor().catch((e) => toast.error(getApiErrorMessage(e)))
  }, [loadDoctor])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Nome e apelido são obrigatórios.')
      return
    }

    if (!specialtyId) {
      toast.error('Seleccione uma especialidade.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        email: email.trim() || undefined,
        specialtyId,
        availability,
      }

      if (isNew) {
        await createDoctor(payload, { client: apiClient })
        toast.success('Médico criado.')
      } else {
        await updateDoctor(params.id, payload, { client: apiClient })
        toast.success('Médico actualizado.')
      }
      router.push('/admin/medicos')
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const title = isNew ? 'Novo médico' : 'Editar médico'

  return (
    <>
      <AdminHeader
        title={title}
        crumbs={[
          { label: 'Admin', href: '/admin/especialidades' },
          { label: 'Médicos', href: '/admin/medicos' },
          { label: title },
        ]}
      />

      <div className="flex-1 p-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-40 w-full" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
            <p className="text-sm text-muted-foreground">
              Dados informativos do profissional — sem conta de acesso ao sistema.
            </p>

            <Tabs defaultValue="dados">
              <TabsList>
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="disponibilidade">Disponibilidade</TabsTrigger>
              </TabsList>

              <TabsContent value="dados" className="mt-4 space-y-4">
                <FieldGroup>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="firstName">Nome</FieldLabel>
                      <Input
                        id="firstName"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                      />
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="lastName">Apelido</FieldLabel>
                      <Input
                        id="lastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                      />
                    </Field>
                  </div>
                  <Field>
                    <FieldLabel htmlFor="email">Email (opcional)</FieldLabel>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="contacto@exemplo.com"
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="phone">Telefone (opcional)</FieldLabel>
                    <Input
                      id="phone"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel>Especialidade</FieldLabel>
                    <Select value={specialtyId} onValueChange={setSpecialtyId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar especialidade" />
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
                </FieldGroup>
              </TabsContent>

              <TabsContent value="disponibilidade" className="mt-4">
                <DoctorAvailabilityEditor
                  value={availability}
                  onChange={setAvailability}
                />
              </TabsContent>
            </Tabs>

            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'A guardar…' : 'Guardar'}
              </Button>
            </div>
          </form>
        )}
      </div>
    </>
  )
}
