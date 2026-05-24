export const TRIAGE_STATUS_LABELS: Record<string, string> = {
  PENDENTE: 'Pendente',
  EM_ANALISE: 'Em análise',
  CANCELADO: 'Cancelado',
  REENCAMINHADO: 'Reencaminhado',
}

export const PRIORITY_LABELS: Record<string, string> = {
  BAIXA: 'Baixa',
  MEDIA: 'Média',
  ALTA: 'Alta',
}

export type TriageBadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive'

export function getTriageBadgeVariant(status: string): TriageBadgeVariant {
  switch (status) {
    case 'PENDENTE':
      return 'secondary'
    case 'EM_ANALISE':
      return 'default'
    case 'CANCELADO':
      return 'destructive'
    case 'REENCAMINHADO':
      return 'outline'
    default:
      return 'outline'
  }
}
