import { apiClient } from "@/lib/api-client";
import { unwrapPaginated } from "@/lib/api/pagination";
import type { FindConsultationTypes200 } from "@/gen/models/FindConsultationTypes";

export type ConsultationTypeItem = NonNullable<
  FindConsultationTypes200["data"]
>[number];

async function fetchConsultationTypeItems(): Promise<ConsultationTypeItem[]> {
  const res = await apiClient.get<
    FindConsultationTypes200 | { data: FindConsultationTypes200 }
  >("/api/consultation-types", {
    params: { limit: 100, sort: "name" },
  });

  return unwrapPaginated(res.data);
}

export async function fetchConsultationTypes(): Promise<ConsultationTypeItem[]> {
  return fetchConsultationTypeItems();
}

export async function fetchConsultationTypeMap(): Promise<
  Record<string, string>
> {
  const items = await fetchConsultationTypeItems();
  return Object.fromEntries(items.map((t) => [t.id, t.name]));
}
