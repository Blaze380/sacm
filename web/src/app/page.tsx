import Link from 'next/link'

import { Button } from '@/components/ui/button'

export default function Page() {
  return (
    <div className="flex min-h-svh items-center justify-center p-6">
      <div className="flex max-w-md flex-col gap-4 text-center">
        <h1 className="text-lg font-medium">SACM</h1>
        <p className="text-sm text-muted-foreground">
          Sistema de agendamento de consultas médicas.
        </p>
        <Button asChild>
          <Link href="/admin/login">Área administrativa</Link>
        </Button>
      </div>
    </div>
  )
}
