import { updatePassword } from "@/gen/clients/updatePassword";
import type { UpdatePasswordMutationRequest } from "@/gen/models/UpdatePassword";
import { apiClient } from "@/lib/api-client";
import { unwrapApiData } from "@/lib/api/unwrap";

export async function changePassword(
  data: UpdatePasswordMutationRequest,
): Promise<void> {
  const res = await updatePassword(data, { client: apiClient });
  unwrapApiData(res);
}
