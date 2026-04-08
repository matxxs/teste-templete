import { apiClient } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import { USE_MOCK_DATA, mockCadastros } from "@/lib/mock-data"
import type { User, AuthResponse } from "@/interfaces"

// Usuário mockado para autenticação
const mockUser: User = {
  usuario_id: "1",
  username: "admin",
  nome: "Administrador do Sistema",
  email: "admin@empresa.com",
  nivel_acesso: "MASTER",
  ativo: true,
}

export const authService = {
  async login(username: string, senha: string): Promise<AuthResponse> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      // Verificar se o usuário existe nos dados mockados
      const user = mockCadastros.find(
        (c) => c.username.toLowerCase() === username.toLowerCase()
      )
      
      if (!user) {
        throw new Error("Usuario nao encontrado")
      }
      
      if (!user.ativo) {
        throw new Error("Usuario inativo")
      }
      
      // Em modo mock, qualquer senha funciona (para testes)
      // Na produção, a API validará a senha corretamente
      return {
        access_token: `mock_token_${user.usuario_id}_${Date.now()}`,
        token_type: "bearer",
      }
    }
    
    return apiClient<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, {
      method: "POST",
      body: JSON.stringify({ username, senha }),
    })
  },

  async getMe(): Promise<User> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 200))
      
      // Extrair o ID do usuário do token mockado
      const token = this.getToken()
      if (token && token.startsWith("mock_token_")) {
        const parts = token.split("_")
        const userId = parts[2]
        
        const user = mockCadastros.find((c) => c.usuario_id === userId)
        if (user) {
          return {
            usuario_id: user.usuario_id,
            username: user.username,
            nome: user.nome,
            email: user.email,
            nivel_acesso: user.nivel_acesso,
            ativo: user.ativo,
          }
        }
      }
      
      // Fallback para o admin
      return mockUser
    }
    
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
