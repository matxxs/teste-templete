import { apiClient } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import type { User, AuthResponse } from "@/interfaces"

export const authService = {
  async login(username: string, senha: string): Promise<AuthResponse> {
    return apiClient<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ username, senha }),
    })
  },

  async getMe(): Promise<User> {
    return apiClient<User>(API_ENDPOINTS.AUTH.ME)
  },

  logout(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  },

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("token")
    }
    return null
  },

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  },

  isAuthenticated(): boolean {
    return !!this.getToken()
  },
}
