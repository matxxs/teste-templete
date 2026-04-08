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
    data: Omit<CadastroForm, "ATIVO">
  ): Promise<CadastroItem> {
    return apiClient<CadastroItem>(API_ENDPOINTS.CADASTROS.LIST, {
      method: "POST",
      body: JSON.stringify({
        NOME: data.NOME.trim(),
        EMAIL: data.EMAIL.trim() || null,
        NIVEL_ACESSO: data.NIVEL_ACESSO,
        senha: data.senha || undefined,
      }),
    })
  },

  async update(
    id: number,
    data: Partial<CadastroForm>
  ): Promise<CadastroItem> {
    const payload: Record<string, unknown> = {}
    if (data.NOME) payload.NOME = data.NOME.trim()
    if (data.EMAIL !== undefined) payload.EMAIL = data.EMAIL.trim() || null
    if (data.NIVEL_ACESSO) payload.NIVEL_ACESSO = data.NIVEL_ACESSO
    if (data.ATIVO) payload.ATIVO = data.ATIVO
    if (data.senha) payload.senha = data.senha

    return apiClient<CadastroItem>(API_ENDPOINTS.CADASTROS.DETAIL(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  async delete(id: number): Promise<void> {
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
