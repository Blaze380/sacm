import { apiClient } from "@/lib/api-client";
import { setAccessToken } from "@/lib/auth/session";
import { login } from "@/gen/clients/login";
import { signup } from "@/gen/clients/signup";

export async function registerAndLogin(
  email: string,
  password: string,
): Promise<void> {
  await signup({ email, password }, { client: apiClient });
  const { accessToken } = await login({ email, password }, { client: apiClient });

  if (!accessToken) {
    throw new Error("Token não recebido");
  }

  await setAccessToken(accessToken);
}
