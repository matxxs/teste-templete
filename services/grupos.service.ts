import { apiClient } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import {
  USE_MOCK_DATA,
  mockGrupos,
  mockGruposAuditoria,
  paginateData,
  type GrupoAuditoriaItem,
} from "@/lib/mock-data"
import type { Grupo, GrupoForm, PaginatedResponse } from "@/interfaces"

// Estado local para simular CRUD em modo mock
let localGrupos = [...mockGrupos]
let localAuditoria = [...mockGruposAuditoria]
let nextAudId = Math.max(...localAuditoria.map((a) => a.aud_id)) + 1

export const gruposService = {
  async list(): Promise<Grupo[]> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      return [...localGrupos]
    }
    
    return apiClient<Grupo[]>(API_ENDPOINTS.GRUPOS.LIST)
  },

  async create(data: GrupoForm): Promise<Grupo> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const newGrupo: Grupo = {
        id: `g${Date.now()}`,
        nome: data.nome.trim(),
        descricao: data.descricao?.trim() || null,
        cor_tag: data.cor,
        data_criacao: new Date().toISOString(),
        data_alteracao: null,
      }
      
      localGrupos.push(newGrupo)
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        grupo_id: newGrupo.id,
        nome: newGrupo.nome,
        descricao: newGrupo.descricao,
        cor_tag: newGrupo.cor_tag,
        acao: "INSERT",
        usuario_sessao: "admin",
        data_auditoria: new Date().toISOString(),
      })
      
      return newGrupo
    }
    
    return apiClient<Grupo>(API_ENDPOINTS.GRUPOS.LIST, {
      method: "POST",
      body: JSON.stringify({
        nome: data.nome.trim(),
        cor: data.cor,
        descricao: data.descricao?.trim() || null,
      }),
    })
  },

  async update(id: string, data: Partial<GrupoForm>): Promise<Grupo> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const index = localGrupos.findIndex((g) => g.id === id)
      if (index === -1) {
        throw new Error("Grupo nao encontrado")
      }
      
      const updated: Grupo = {
        ...localGrupos[index],
        ...(data.nome && { nome: data.nome.trim() }),
        ...(data.cor && { cor_tag: data.cor }),
        ...(data.descricao !== undefined && {
          descricao: data.descricao?.trim() || null,
        }),
        data_alteracao: new Date().toISOString(),
      }
      
      localGrupos[index] = updated
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        grupo_id: updated.id,
        nome: updated.nome,
        descricao: updated.descricao,
        cor_tag: updated.cor_tag,
        acao: "UPDATE",
        usuario_sessao: "admin",
        data_auditoria: new Date().toISOString(),
      })
      
      return updated
    }
    
    const payload: Record<string, unknown> = {}
    if (data.nome) payload.nome = data.nome.trim()
    if (data.cor) payload.cor = data.cor
    if (data.descricao !== undefined)
      payload.descricao = data.descricao?.trim() || null

    return apiClient<Grupo>(API_ENDPOINTS.GRUPOS.DETAIL(id), {
      method: "PATCH",
      body: JSON.stringify(payload),
    })
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const grupo = localGrupos.find((g) => g.id === id)
      if (!grupo) {
        throw new Error("Grupo nao encontrado")
      }
      
      localGrupos = localGrupos.filter((g) => g.id !== id)
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        grupo_id: grupo.id,
        nome: grupo.nome,
        descricao: grupo.descricao,
        cor_tag: grupo.cor_tag,
        acao: "DELETE",
        usuario_sessao: "admin",
        data_auditoria: new Date().toISOString(),
      })
      
      return
    }
    
    await apiClient(API_ENDPOINTS.GRUPOS.DETAIL(id), { method: "DELETE" })
  },

  async getAuditoria(
    page: number = 1,
    pageSize: number = 15
  ): Promise<PaginatedResponse<GrupoAuditoriaItem>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Ordenar por data mais recente
      const sorted = [...localAuditoria].sort(
        (a, b) =>
          new Date(b.data_auditoria).getTime() -
          new Date(a.data_auditoria).getTime()
      )
      
      return paginateData(sorted, page, pageSize)
    }
    
    return apiClient<PaginatedResponse<GrupoAuditoriaItem>>(
      `${API_ENDPOINTS.AUDITORIA.GRUPOS}?page=${page}&page_size=${pageSize}`
    )
  },
}
