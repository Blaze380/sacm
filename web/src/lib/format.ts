export function formatDateTime(value?: string): string {
  if (!value) return '—'
  return new Intl.DateTimeFormat('pt-MZ', {
    dateStyle: 'short',
    timeStyle: 'short',
  }).format(new Date(value))
}
