import { apiClient } from "@/lib/api-client";
import { setAccessToken } from "@/lib/auth/session";
import { login } from "@/gen/clients/login";

export async function signIn(email: string, password: string): Promise<void> {
  const { accessToken } = await login({ email, password }, { client: apiClient });

  if (!accessToken) {
    throw new Error("Token não recebido");
  }

  await setAccessToken(accessToken);
}
