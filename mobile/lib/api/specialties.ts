import { apiClient } from "@/lib/api-client";
import { unwrapPaginated } from "@/lib/api/pagination";
import type { FindSpecialties200 } from "@/gen/models/FindSpecialties";

export type SpecialtyItem = NonNullable<FindSpecialties200["data"]>[number];

export async function fetchSpecialties(): Promise<SpecialtyItem[]> {
  const res = await apiClient.get<
    FindSpecialties200 | { data: FindSpecialties200 }
  >("/api/specialties", {
    params: { limit: 100, sort: "name" },
  });

  return unwrapPaginated(res.data);
}

export async function fetchDefaultSpecialtyId(): Promise<string> {
  const fromEnv = process.env.EXPO_PUBLIC_DEFAULT_SPECIALTY_ID;
  if (fromEnv) {
    return fromEnv;
  }

  const items = await fetchSpecialties();
  if (items.length === 0) {
    throw new Error("Nenhuma especialidade disponível.");
  }

  return items[0].id;
}
