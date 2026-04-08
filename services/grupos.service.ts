import { apiClient } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import type {
  Grupo,
  GrupoForm
} from "@/interfaces"

export const gruposService = {
  async list(): Promise<Grupo[]> {
    return apiClient<Grupo[]>(API_ENDPOINTS.GRUPOS.LIST)
  },

  async create(data: GrupoForm): Promise<Grupo> {
    return apiClient<Grupo>(API_ENDPOINTS.GRUPOS.LIST, {
      method: "POST",
      body: JSON.stringify({
        nome: data.nome.trim(),
        cor: data.cor,
        descricao: data.descricao.trim() || null,
      }),
    })
  },

  async update(id: string, data: Partial<GrupoForm>): Promise<Grupo> {
    const payload: Record<string, unknown> = {}
    if (data.nome) payload.nome = data.nome.trim()
    if (data.cor) payload.cor = data.cor
    if (data.descricao !== undefined)
      payload.descricao = data.descricao.trim() || null

    return apiClient<Grupo>(API_ENDPOINTS.GRUPOS.DETAIL(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  async delete(id: string): Promise<void> {
    await apiClient(API_ENDPOINTS.GRUPOS.DETAIL(id), { method: "DELETE" })
  },
}
