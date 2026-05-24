'use client'

import { useCallback, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { AdminHeader } from '@/components/admin/admin-header'
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
import { Switch } from '@/components/ui/switch'
import { createUser } from '@/gen/clients/createUser'
import { findUserById } from '@/gen/clients/findUserById'
import { updateUser } from '@/gen/clients/updateUser'
import type { CreateUserMutationRequestProvinceEnumKey } from '@/gen/models/CreateUser'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'
import { provinceLabels } from '@/lib/labels/appointment'

const provinces = Object.entries(provinceLabels)

export default function RecepcionistaFormPage() {
  const params = useParams<{ id: string }>()
  const router = useRouter()
  const isNew = params.id === 'novo'

  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [province, setProvince] = useState<CreateUserMutationRequestProvinceEnumKey | ''>('')
  const [city, setCity] = useState('')
  const [neighborhood, setNeighborhood] = useState('')
  const [password, setPassword] = useState('')
  const [isActive, setIsActive] = useState(true)

  const loadUser = useCallback(async () => {
    if (isNew) return
    setLoading(true)
    try {
      const user = await findUserById(params.id, { client: apiClient })
      if (user.role !== 'RECEPCIONISTA') {
        toast.error('Este utilizador não é um recepcionista.')
        router.push('/admin/utilizadores')
        return
      }
      setFirstName(user.firstName ?? '')
      setLastName(user.lastName ?? '')
      setEmail(user.email)
      setPhone(user.phone ?? '')
      setProvince(user.province ?? '')
      setCity(user.city ?? '')
      setNeighborhood(user.neighborhood ?? '')
      setIsActive(user.isActive)
    } catch (error) {
      toast.error(getApiErrorMessage(error))
      router.push('/admin/utilizadores')
    } finally {
      setLoading(false)
    }
  }, [isNew, params.id, router])

  useEffect(() => {
    loadUser().catch((e) => toast.error(getApiErrorMessage(e)))
  }, [loadUser])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('Nome e apelido são obrigatórios.')
      return
    }

    if (isNew && password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres.')
      return
    }

    setSaving(true)
    try {
      const payload = {
        email: email.trim(),
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        province: province || undefined,
        city: city.trim() || undefined,
        neighborhood: neighborhood.trim() || undefined,
        role: 'RECEPCIONISTA' as const,
        isActive,
        isStaff: true,
      }

      if (isNew) {
        await createUser(
          { ...payload, password },
          { client: apiClient }
        )
        toast.success('Recepcionista criado.')
      } else {
        await updateUser(
          params.id,
          {
            ...payload,
            ...(password ? { password } : {}),
          },
          { client: apiClient }
        )
        toast.success('Recepcionista actualizado.')
      }
      router.push('/admin/utilizadores')
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const title = isNew ? 'Novo recepcionista' : 'Editar recepcionista'

  return (
    <>
      <AdminHeader
        title={title}
        crumbs={[
          { label: 'Admin', href: '/admin/especialidades' },
          { label: 'Utilizadores', href: '/admin/utilizadores' },
          { label: title },
        ]}
      />

      <div className="flex-1 p-4">
        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-10 w-full max-w-md" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl space-y-6">
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
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Telefone</FieldLabel>
                <Input
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Província</FieldLabel>
                <Select
                  value={province || undefined}
                  onValueChange={(value) =>
                    setProvince(value as CreateUserMutationRequestProvinceEnumKey)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar (opcional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {provinces.map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="city">Cidade</FieldLabel>
                  <Input
                    id="city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="neighborhood">Bairro</FieldLabel>
                  <Input
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                  />
                </Field>
              </div>
              <Field>
                <FieldLabel htmlFor="password">
                  {isNew ? 'Senha' : 'Nova senha (opcional)'}
                </FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={isNew}
                  placeholder={isNew ? undefined : 'Deixar em branco para manter'}
                />
              </Field>
              <Field orientation="horizontal">
                <Switch checked={isActive} onCheckedChange={setIsActive} />
                <FieldLabel className="font-normal">Conta activa</FieldLabel>
              </Field>
            </FieldGroup>

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
