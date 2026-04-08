import { CONFIG } from "@/constants/config"

export async function apiClient<T = unknown>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string>),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  if (init?.body && typeof init.body === "string") {
    headers["Content-Type"] = "application/json"
  }

  const res = await fetch(`${CONFIG.API_URL}${path}`, {
    ...init,
    headers,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    const error = new Error(err.detail || `Erro ${res.status}`) as any
    error.status = res.status
    throw error
  }

  if (res.status === 204 || res.headers.get("content-length") === "0") 
    return {} as T

  return res.json()
}

export async function uploadFile(
  path: string,
  formData: FormData
): Promise<unknown> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const res = await fetch(`${CONFIG.API_URL}${path}`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Erro no upload")
  }

  return res.json()
}

export async function downloadFile(path: string): Promise<Blob> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null

  const res = await fetch(`${CONFIG.API_URL}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || "Erro ao baixar")
  }

  return res.blob()
}
