import type { DataStatusEnumKey } from "@/gen/models/FindAppointments";
import type { DataPriorityEnumKey } from "@/gen/models/FindAppointments";
import type { DataSourceEnumKey } from "@/gen/models/FindAppointments";
import type { DataStatusEnum2Key } from "@/gen/models/FindTriages";

export const APPOINTMENT_STATUS_LABELS: Record<DataStatusEnumKey, string> = {
  AGENDADA: "Agendada",
  CANCELADA: "Cancelada",
  REAGENDADA: "Reagendada",
  CONCLUIDA: "Concluída",
};

export const APPOINTMENT_SOURCE_LABELS: Record<DataSourceEnumKey, string> = {
  TRIAGEM: "Via triagem",
  DIRECTA: "Marcação direta",
};

export const APPOINTMENT_PRIORITY_LABELS: Record<DataPriorityEnumKey, string> = {
  BAIXA: "Baixa",
  MEDIA: "Média",
  ALTA: "Alta",
};

export function getTriageStatusMessage(status: DataStatusEnum2Key): string {
  switch (status) {
    case "PENDENTE":
      return "O seu pedido foi recebido e aguarda análise da equipa clínica.";
    case "EM_ANALISE":
      return "A equipa está a analisar o seu pedido. Será notificado quando houver atualização.";
    case "CANCELADO":
      return "Este pedido de triagem não foi aprovado.";
    case "REENCAMINHADO":
      return "A triagem foi aprovada. Pode agendar a consulta sugerida.";
    default:
      return "";
  }
}

export function getDetailSheetTitle(
  variant: "triage" | "appointment",
  isReferredTriage: boolean,
): string {
  if (variant === "triage") return "Triagem";
  return isReferredTriage ? "Consulta sugerida" : "Consulta";
}
