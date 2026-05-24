'use client'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  type DoctorAvailability,
  weekDays,
} from '@/lib/types/doctor'

export function DoctorAvailabilityEditor({
  value,
  onChange,
}: {
  value: DoctorAvailability
  onChange: (value: DoctorAvailability) => void
}) {
  return (
    <div className="space-y-3">
      {weekDays.map(({ key, label }) => {
        const day = value[key]
        return (
          <div
            key={key}
            className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-3 rounded-lg border p-3"
          >
            <div className="flex items-center gap-3">
              <Switch
                checked={day.isAvailable}
                onCheckedChange={(checked) =>
                  onChange({
                    ...value,
                    [key]: { ...day, isAvailable: checked },
                  })
                }
              />
              <Label className="font-normal">{label}</Label>
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Início</Label>
              <Input
                type="time"
                value={day.start}
                disabled={!day.isAvailable}
                onChange={(e) =>
                  onChange({
                    ...value,
                    [key]: { ...day, start: e.target.value },
                  })
                }
                className="h-8 w-28"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Fim</Label>
              <Input
                type="time"
                value={day.end}
                disabled={!day.isAvailable}
                onChange={(e) =>
                  onChange({
                    ...value,
                    [key]: { ...day, end: e.target.value },
                  })
                }
                className="h-8 w-28"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
