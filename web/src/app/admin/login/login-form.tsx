'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { login } from '@/gen/clients/login'
import { getMe } from '@/gen/clients/getMe'
import { apiClient } from '@/lib/api/client'
import { getApiErrorMessage } from '@/lib/api/errors'
import {
  canAccessPath,
  canAccessStaffPanel,
  getDefaultStaffRoute,
} from '@/lib/auth/guards'
import type { AuthUser } from '@/lib/auth/guards'
import { persistSessionCookie, setAccessToken } from '@/lib/auth/session'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const result = await login({ email, password }, { client: apiClient })
      const accessToken = result.accessToken
      if (!accessToken) {
        toast.error('Resposta de autenticação inválida.')
        return
      }
      setAccessToken(accessToken)
      await persistSessionCookie(accessToken)

      const me = await getMe({ client: apiClient })
      const authUser = me as AuthUser
      if (!canAccessStaffPanel(authUser)) {
        toast.error('Apenas administradores ou recepcionistas podem aceder a esta área.')
        return
      }

      const defaultRoute = getDefaultStaffRoute(authUser.role)
      const from = searchParams.get('from') ?? defaultRoute
      const target =
        from.startsWith('/admin') && canAccessPath(authUser, from)
          ? from
          : defaultRoute
      router.replace(target)
      router.refresh()
    } catch (error) {
      toast.error(getApiErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Administração SACM</CardTitle>
        <CardDescription>Inicie sessão com a sua conta de staff.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'A entrar…' : 'Entrar'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
