import { apiClient } from "@/lib/api-client";
import { unwrapPaginated } from "@/lib/api/pagination";
import { unwrapApiData } from "@/lib/api/unwrap";
import type { CreateTriage201 } from "@/gen/models/CreateTriage";
import type { CreateTriageMutationRequest } from "@/gen/models/CreateTriage";
import type { FindTriages200 } from "@/gen/models/FindTriages";

export type TriageItem = NonNullable<FindTriages200["data"]>[number];

const PENDING_STATUSES = new Set(["PENDENTE", "EM_ANALISE"]);

export async function fetchPatientTriages(
  patientId: string,
): Promise<TriageItem[]> {
  const res = await apiClient.get<FindTriages200 | { data: FindTriages200 }>(
    "/api/triages",
    {
      params: { limit: 100, sort: "-createdAt" },
    },
  );

  const items = unwrapPaginated(res.data);
  return items.filter((item) => item.patientId === patientId);
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

export async function createPatientTriage(
  payload: CreateTriageMutationRequest,
): Promise<CreateTriage201> {
  const res = await apiClient.post<
    CreateTriage201 | { data: CreateTriage201 }
  >("/api/triages", payload);

  return unwrapApiData(res.data);
}
