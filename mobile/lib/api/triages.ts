import { apiClient } from "@/lib/api-client";
import { unwrapPaginated } from "@/lib/api/pagination";
import { unwrapApiData } from "@/lib/api/unwrap";
import type { CreateTriage201 } from "@/gen/models/CreateTriage";
import type { CreateTriageMutationRequest } from "@/gen/models/CreateTriage";
import type { FindTriages200 } from "@/gen/models/FindTriages";

export type CreateTriagePayload = CreateTriageMutationRequest;

export type TriageItem = NonNullable<FindTriages200["data"]>[number] & {
  specialtyId?: string;
  consultationTypeId?: string;
  priority?: "BAIXA" | "MEDIA" | "ALTA";
  rejectionReason?: string;
};

const PENDING_STATUSES = new Set(["PENDENTE", "EM_ANALISE"]);
const REFERRED_STATUS = "REENCAMINHADO";

export async function fetchPatientTriages(
  patientId: string,
): Promise<TriageItem[]> {
  const res = await apiClient.get<FindTriages200 | { data: FindTriages200 }>(
    "/api/triages",
    {
      params: {
        limit: 100,
        sort: "-createdAt",
        patient: { id: patientId },
      },
    },
  );

  return unwrapPaginated(res.data);
}

export async function fetchPendingTriages(
  patientId: string,
  excludeTriageIds: Set<string> = new Set(),
): Promise<TriageItem[]> {
  const items = await fetchPatientTriages(patientId);

  return items.filter(
    (item) =>
      PENDING_STATUSES.has(item.status) && !excludeTriageIds.has(item.id),
  );
}

export async function fetchReferredTriages(
  patientId: string,
  excludeTriageIds: Set<string> = new Set(),
): Promise<TriageItem[]> {
  const items = await fetchPatientTriages(patientId);

  return items.filter(
    (item) =>
      item.status === REFERRED_STATUS &&
      !excludeTriageIds.has(item.id) &&
      Boolean(item.specialtyId) &&
      Boolean(item.consultationTypeId),
  );
}

export async function fetchTriageById(
  patientId: string,
  triageId: string,
): Promise<TriageItem | null> {
  const items = await fetchPatientTriages(patientId);
  return items.find((t) => t.id === triageId) ?? null;
}

export async function createPatientTriage(
  payload: CreateTriagePayload,
): Promise<CreateTriage201> {
  const res = await apiClient.post<
    CreateTriage201 | { data: CreateTriage201 }
  >("/api/triages", payload);

  return unwrapApiData(res.data);
}
