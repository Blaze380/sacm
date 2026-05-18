import type { DataStatusEnumKey } from "@/gen/models/FindAppointments";
import type { DataStatusEnum2Key } from "@/gen/models/FindTriages";
import { TRIAGE_STATUS_LABELS } from "@/lib/home/labels";
import type { HomeUpcomingItem } from "@/lib/home/types";

export type StatusFilterId =
  | "ALL"
  | DataStatusEnumKey
  | DataStatusEnum2Key;

export const STATUS_FILTER_CHIPS: { id: StatusFilterId; label: string }[] = [
  { id: "ALL", label: "Todas" },
  { id: "AGENDADA", label: "Agendada" },
  { id: "REAGENDADA", label: "Reagendada" },
  { id: "CONCLUIDA", label: "Concluída" },
  { id: "CANCELADA", label: "Cancelada" },
  { id: "PENDENTE", label: "Pendente" },
  { id: "EM_ANALISE", label: "Em análise" },
  { id: "REENCAMINHADO", label: "Reencaminhado" },
];

const APPOINTMENT_STATUS_LABELS: Record<DataStatusEnumKey, string> = {
  AGENDADA: "Agendada",
  CANCELADA: "Cancelada",
  REAGENDADA: "Reagendada",
  CONCLUIDA: "Concluída",
};

export function getItemStatus(item: HomeUpcomingItem): string {
  if (item.kind === "appointment") {
    return item.appointment.status;
  }
  return item.triage.status;
}

export function getItemSearchText(item: HomeUpcomingItem): string {
  if (item.kind === "appointment") {
    const status = APPOINTMENT_STATUS_LABELS[item.appointment.status] ?? "";
    return `${item.consultationTypeName} ${status}`.toLowerCase();
  }
  const status = TRIAGE_STATUS_LABELS[item.triage.status] ?? "";
  return `${item.triage.complaint} ${status}`.toLowerCase();
}

export function matchesStatusFilter(
  item: HomeUpcomingItem,
  filter: StatusFilterId,
): boolean {
  if (filter === "ALL") return true;
  return getItemStatus(item) === filter;
}

export function matchesSearchQuery(
  item: HomeUpcomingItem,
  query: string,
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  return getItemSearchText(item).includes(q);
}

export function filterConsultationItems(
  items: HomeUpcomingItem[],
  statusFilter: StatusFilterId,
  search: string,
): HomeUpcomingItem[] {
  return items.filter(
    (item) =>
      matchesStatusFilter(item, statusFilter) &&
      matchesSearchQuery(item, search),
  );
}
