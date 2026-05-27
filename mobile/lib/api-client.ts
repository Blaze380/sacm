import axios from "axios";
import type { Client } from "@kubb/plugin-client/clients/axios";
import { redirectToLogin } from "@/lib/auth/auth-navigation";
import { isInvalidSessionError } from "@/lib/auth/session-error";
import { clearAccessToken, getAccessToken } from "@/lib/auth/session";
import { notifySessionCleared } from "@/lib/auth/session-state";
import { clearCachedUser } from "@/lib/auth/user";

export const apiClient: Client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

let signingOut = false;

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (isInvalidSessionError(error) && !signingOut) {
      signingOut = true;
      try {
        await clearAccessToken();
        clearCachedUser();
        notifySessionCleared();
        redirectToLogin();
      } finally {
        signingOut = false;
      }
    }
    return Promise.reject(error);
  },
);
