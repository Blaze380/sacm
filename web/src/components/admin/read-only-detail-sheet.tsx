'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

export type DetailField = {
  label: string
  value: React.ReactNode
}

export function ReadOnlyDetailSheet({
  open,
  onOpenChange,
  title,
  description,
  fields,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  fields: DetailField[]
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          {description ? <SheetDescription>{description}</SheetDescription> : null}
        </SheetHeader>
        <dl className="mt-6 space-y-4">
          {fields.map((field) => (
            <div key={field.label} className="space-y-1">
              <dt className="text-xs font-medium text-muted-foreground">{field.label}</dt>
              <dd className="text-sm">{field.value ?? '—'}</dd>
            </div>
          ))}
        </dl>
      </SheetContent>
    </Sheet>
  )
}
