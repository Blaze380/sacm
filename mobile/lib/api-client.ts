import axios from "axios";
import type { Client } from "@kubb/plugin-client/clients/axios";
import { getAccessToken } from "@/lib/auth/session";

export const apiClient: Client = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8000",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
