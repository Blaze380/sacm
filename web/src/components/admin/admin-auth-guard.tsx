'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'

import { Spinner } from '@/components/ui/spinner'
import { apiClient } from '@/lib/api/client'
import {
  canAccessPath,
  canAccessStaffPanel,
  getDefaultStaffRoute,
  type AuthUser,
} from '@/lib/auth/guards'
import { clearAccessToken } from '@/lib/auth/session'
import { getMe } from '@/gen/clients/getMe'

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function verify() {
      try {
        const me = await getMe({ client: apiClient })
        if (!canAccessStaffPanel(me as AuthUser)) {
          await clearAccessToken()
          router.replace('/admin/login')
          return
        }
        const authUser = me as AuthUser
        if (!canAccessPath(authUser, pathname)) {
          router.replace(getDefaultStaffRoute(authUser.role))
          return
        }
        if (!cancelled) setUser(authUser)
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
  }, [router, pathname])

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
