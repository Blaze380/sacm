export type DayAvailability = {
  start: string
  end: string
  isAvailable: boolean
}

export type DoctorAvailability = {
  monday: DayAvailability
  tuesday: DayAvailability
  wednesday: DayAvailability
  thursday: DayAvailability
  friday: DayAvailability
  saturday: DayAvailability
  sunday: DayAvailability
}

export const defaultDayAvailability: DayAvailability = {
  start: '08:00',
  end: '17:00',
  isAvailable: true,
}

export const defaultDoctorAvailability: DoctorAvailability = {
  monday: { ...defaultDayAvailability },
  tuesday: { ...defaultDayAvailability },
  wednesday: { ...defaultDayAvailability },
  thursday: { ...defaultDayAvailability },
  friday: { ...defaultDayAvailability },
  saturday: { start: '08:00', end: '12:00', isAvailable: true },
  sunday: { start: '08:00', end: '12:00', isAvailable: false },
}

export const weekDays: { key: keyof DoctorAvailability; label: string }[] = [
  { key: 'monday', label: 'Segunda' },
  { key: 'tuesday', label: 'Terça' },
  { key: 'wednesday', label: 'Quarta' },
  { key: 'thursday', label: 'Quinta' },
  { key: 'friday', label: 'Sexta' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]
