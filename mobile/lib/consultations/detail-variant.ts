import type { DataStatusEnum2Key } from "@/gen/models/FindTriages";
import type { HomeUpcomingItem } from "@/lib/home/types";

export type ConsultationDetailVariant = "triage" | "appointment";

export const TRIAGE_ACTIVE_STATUSES: ReadonlySet<DataStatusEnum2Key> = new Set([
  "PENDENTE",
  "EM_ANALISE",
]);

export const TRIAGE_REJECTED_STATUS: DataStatusEnum2Key = "CANCELADO";

export const TRIAGE_REFERRED_STATUS: DataStatusEnum2Key = "REENCAMINHADO";

export function getConsultationDetailVariant(
  item: HomeUpcomingItem,
): ConsultationDetailVariant {
  if (item.kind === "appointment") return "appointment";
  return item.triage.status === TRIAGE_REFERRED_STATUS ? "appointment" : "triage";
}

export function canBookFromReferredTriage(item: HomeUpcomingItem): boolean {
  return (
    item.kind === "triage" &&
    item.triage.status === TRIAGE_REFERRED_STATUS &&
    Boolean(item.triage.specialtyId) &&
    Boolean(item.triage.consultationTypeId)
  );
}
