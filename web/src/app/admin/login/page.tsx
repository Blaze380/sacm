import { Suspense } from 'react'

import { LoginForm } from './login-form'
import { Spinner } from '@/components/ui/spinner'

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted/30 p-6">
      <Suspense
        fallback={
          <div className="flex items-center justify-center p-8">
            <Spinner className="size-6" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </div>
  )
}
