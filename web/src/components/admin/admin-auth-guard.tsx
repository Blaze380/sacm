'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api/client'
import { isAdmin, type AuthUser } from '@/lib/auth/guards'
import { clearAccessToken } from '@/lib/auth/session'
import { getMe } from '@/gen/clients/getMe'

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function verify() {
      try {
        const me = await getMe({ client: apiClient })
        if (!isAdmin(me as AuthUser)) {
          await clearAccessToken()
          router.replace('/admin/login')
          return
        }
        if (!cancelled) setUser(me as AuthUser)
      } catch {
        await clearAccessToken()
        router.replace('/admin/login')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    verify()
    return () => {
      cancelled = true
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-8">
        <Spinner className="size-6" />
      </div>
    )
  }

  if (!user) return null

  return <>{children}</>
}
