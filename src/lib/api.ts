import { Platform } from "react-native";
import Constants from "expo-constants";
import { useAuthStore } from "@/src/store/authStore";

/**
 * Central API client for SupplierConnect backend.
 *
 * Base URL resolves automatically:
 *   Physical device (Expo Go) → uses the same LAN IP as the Expo dev server
 *   Android emulator          → http://10.0.2.2:3000
 *   iOS simulator/web         → http://localhost:3000
 *   Production                → set EXPO_PUBLIC_API_URL env var
 *
 * All requests attach "Authorization: Bearer <token>" when a token exists in authStore.
 */

function getBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL;

  if (__DEV__) {
    // Expo dev server host (e.g. "192.168.1.42:8081" on physical device)
    // We swap the port to 3000 so requests reach the Express backend on the same machine.
    const debuggerHost =
      Constants.expoConfig?.hostUri || // SDK 49+
      (Constants as any).manifest2?.extra?.expoGo?.debuggerHost || // older SDK
      (Constants as any).manifest?.debuggerHost; // legacy

    if (debuggerHost) {
      const host = debuggerHost.split(":")[0]; // strip Metro port
      return `http://${host}:3000`;
    }

    // Fallback for emulators when no debugger host is available
    return Platform.OS === "android"
      ? "http://10.0.2.2:3000"
      : "http://localhost:3000";
  }

  return "https://your-production-url.com";
}

const BASE_URL = getBaseUrl();
if (__DEV__) console.log("[api] BASE_URL =", BASE_URL);

function getToken(): string | null {
  return useAuthStore.getState().token;
}

function buildHeaders(extra?: Record<string, string>): Record<string, string> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...extra,
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

function buildQuery(
  params?: Record<string, string | number | boolean | undefined>,
): string {
  if (!params) return "";
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== null,
  );
  if (!entries.length) return "";
  return (
    "?" +
    entries
      .map(
        ([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`,
      )
      .join("&")
  );
}

async function handleResponse<T>(res: Response): Promise<T> {
  const json = await res.json();
  if (!res.ok) {
    throw new Error(
      (json as { message?: string }).message || `API error ${res.status}`,
    );
  }
  return json as T;
}

export const api = {
  async get<T = unknown>(
    path: string,
    params?: Record<string, string | number | boolean | undefined>,
  ): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}${buildQuery(params)}`, {
      method: "GET",
      headers: buildHeaders(),
    });
    return handleResponse<T>(res);
  },

  async post<T = unknown>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      headers: buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async put<T = unknown>(path: string, body?: unknown): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      headers: buildHeaders(),
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
    return handleResponse<T>(res);
  },

  async del<T = unknown>(path: string): Promise<T> {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "DELETE",
      headers: buildHeaders(),
    });
    return handleResponse<T>(res);
  },
};
