import { apiClient } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import type {
  CadastroItem,
  CadastroForm,
  CadastroAuditoriaItem,
  PaginatedResponse,
} from "@/interfaces"

export const cadastrosService = {
  async list(
    page: number = 1,
    pageSize: number = 10,
    busca?: string
  ): Promise<PaginatedResponse<CadastroItem>> {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    })
    if (busca?.trim()) params.set("busca", busca.trim())

    return apiClient<PaginatedResponse<CadastroItem>>(
      `${API_ENDPOINTS.CADASTROS.LIST}?${params.toString()}`
    )
  },

  async create(
    data: Omit<CadastroForm, "ativo">
  ): Promise<CadastroItem> {
    return apiClient<CadastroItem>(API_ENDPOINTS.CADASTROS.LIST, {
      method: "POST",
      body: JSON.stringify({
        username: data.username.trim(),
        nome: data.nome.trim(),
        email: data.email.trim(),
        nivel_acesso: data.nivel_acesso,
        senha: data.senha || undefined,
      }),
    })
  },

  async update(
    id: string,
    data: Partial<CadastroForm>
  ): Promise<CadastroItem> {
    const payload: Record<string, unknown> = {}
    if (data.username) payload.username = data.username.trim()
    if (data.nome) payload.nome = data.nome.trim()
    if (data.email !== undefined) payload.email = data.email.trim()
    if (data.nivel_acesso) payload.nivel_acesso = data.nivel_acesso
    if (data.ativo !== undefined) payload.ativo = data.ativo
    if (data.senha) payload.senha = data.senha

    return apiClient<CadastroItem>(API_ENDPOINTS.CADASTROS.DETAIL(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  async delete(id: string): Promise<void> {
    await apiClient(API_ENDPOINTS.CADASTROS.DETAIL(id), { method: "DELETE" })
  },

  async getAuditoria(
    page: number = 1,
    pageSize: number = 15
  ): Promise<PaginatedResponse<CadastroAuditoriaItem>> {
    return apiClient<PaginatedResponse<CadastroAuditoriaItem>>(
      `${API_ENDPOINTS.AUDITORIA.CADASTROS}?page=${page}&page_size=${pageSize}`
    )
  },
}
