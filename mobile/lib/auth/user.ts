import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api/unwrap";
import type { GetMe200, GetMe200ProvinceEnumKey } from "@/gen/models/GetMe";

let cachedUser: GetMe200 | null = null;

export function getCachedUser(): GetMe200 | null {
  return cachedUser;
}

export function clearCachedUser(): void {
  cachedUser = null;
}

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
  const user = unwrapApiData(res.data);
  cachedUser = user;
  return user;
}

export async function updateCurrentUser(
  data: UpdateProfileInput,
): Promise<GetMe200> {
  const res = await apiClient.patch<GetMe200 | { data: GetMe200 }>(
    "/api/users/me",
    data,
  );
  const user = unwrapApiData(res.data);
  cachedUser = user;
  return user;
}
