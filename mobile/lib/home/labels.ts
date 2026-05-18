import type { DataStatusEnum2Key } from "@/gen/models/FindTriages";

export const TRIAGE_STATUS_LABELS: Record<DataStatusEnum2Key, string> = {
  PENDENTE: "Pendente",
  EM_ANALISE: "Em análise",
  CANCELADO: "Cancelado",
  REENCAMINHADO: "Reencaminhado",
};

export type TriageBadgeVariant = "default" | "secondary" | "outline" | "destructive";

export function getTriageBadgeVariant(
  status: DataStatusEnum2Key,
): TriageBadgeVariant {
  switch (status) {
    case "PENDENTE":
      return "secondary";
    case "EM_ANALISE":
      return "default";
    case "CANCELADO":
      return "destructive";
    case "REENCAMINHADO":
      return "outline";
    default:
      return "outline";
  }
}
