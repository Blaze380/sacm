import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api/unwrap";
import type { GetMe200, GetMe200ProvinceEnumKey } from "@/gen/models/GetMe";

export type UpdateProfileInput = Partial<{
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  province: GetMe200ProvinceEnumKey;
  city: string;
  neighborhood: string;
}>;

export async function getCurrentUser(): Promise<GetMe200> {
  const res = await apiClient.get<GetMe200 | { data: GetMe200 }>(
    "/api/users/me",
  );
  return unwrapApiData(res.data);
}

export async function updateCurrentUser(
  data: UpdateProfileInput,
): Promise<GetMe200> {
  const res = await apiClient.patch<GetMe200 | { data: GetMe200 }>(
    "/api/users/me",
    data,
  );
  return unwrapApiData(res.data);
}
