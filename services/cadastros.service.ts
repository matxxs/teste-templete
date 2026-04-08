import { apiClient } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import {
  USE_MOCK_DATA,
  mockCadastros,
  mockCadastrosAuditoria,
  paginateData,
} from "@/lib/mock-data"
import type {
  CadastroItem,
  CadastroForm,
  CadastroAuditoriaItem,
  PaginatedResponse,
} from "@/interfaces"

// Estado local para simular CRUD em modo mock
let localCadastros = [...mockCadastros]
let localAuditoria = [...mockCadastrosAuditoria]
let nextAudId = Math.max(...localAuditoria.map((a) => a.aud_id)) + 1

export const cadastrosService = {
  async list(
    page: number = 1,
    pageSize: number = 10,
    busca?: string
  ): Promise<PaginatedResponse<CadastroItem>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      let filtered = [...localCadastros]
      if (busca?.trim()) {
        const search = busca.toLowerCase()
        filtered = filtered.filter(
          (c) =>
            c.nome.toLowerCase().includes(search) ||
            c.username.toLowerCase().includes(search) ||
            c.email.toLowerCase().includes(search)
        )
      }
      
      return paginateData(filtered, page, pageSize)
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Verificar se username já existe
      if (localCadastros.some((c) => c.username === data.username)) {
        throw new Error("Nome de usuario ja existe")
      }
      
      const newCadastro: CadastroItem = {
        usuario_id: String(Date.now()),
        username: data.username.trim(),
        nome: data.nome.trim(),
        email: data.email.trim(),
        nivel_acesso: data.nivel_acesso,
        ativo: true,
        data_criacao: new Date().toISOString(),
      }
      
      localCadastros.push(newCadastro)
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        usuario_id: newCadastro.usuario_id,
        username: newCadastro.username,
        nome: newCadastro.nome,
        email: newCadastro.email,
        ativo: true,
        acao: "INSERT",
        usuario_sessao: "admin",
        data_auditoria: new Date().toISOString(),
      })
      
      return newCadastro
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const index = localCadastros.findIndex((c) => c.usuario_id === id)
      if (index === -1) {
        throw new Error("Usuario nao encontrado")
      }
      
      const updated: CadastroItem = {
        ...localCadastros[index],
        ...(data.nome && { nome: data.nome.trim() }),
        ...(data.email !== undefined && { email: data.email.trim() }),
        ...(data.nivel_acesso && { nivel_acesso: data.nivel_acesso }),
        ...(data.ativo !== undefined && { ativo: data.ativo }),
      }
      
      localCadastros[index] = updated
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        usuario_id: updated.usuario_id,
        username: updated.username,
        nome: updated.nome,
        email: updated.email,
        ativo: updated.ativo,
        acao: "UPDATE",
        usuario_sessao: "admin",
        data_auditoria: new Date().toISOString(),
      })
      
      return updated
    }
    
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
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const cadastro = localCadastros.find((c) => c.usuario_id === id)
      if (!cadastro) {
        throw new Error("Usuario nao encontrado")
      }
      
      localCadastros = localCadastros.filter((c) => c.usuario_id !== id)
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        usuario_id: cadastro.usuario_id,
        username: cadastro.username,
        nome: cadastro.nome,
        email: cadastro.email,
        ativo: cadastro.ativo,
        acao: "DELETE",
        usuario_sessao: "admin",
        data_auditoria: new Date().toISOString(),
      })
      
      return
    }
    
    await apiClient(API_ENDPOINTS.CADASTROS.DETAIL(id), { method: "DELETE" })
  },

  async getAuditoria(
    page: number = 1,
    pageSize: number = 15
  ): Promise<PaginatedResponse<CadastroAuditoriaItem>> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Ordenar por data mais recente
      const sorted = [...localAuditoria].sort(
        (a, b) =>
          new Date(b.data_auditoria || 0).getTime() -
          new Date(a.data_auditoria || 0).getTime()
      )
      
      return paginateData(sorted, page, pageSize)
    }
    
    return apiClient<PaginatedResponse<CadastroAuditoriaItem>>(
      `${API_ENDPOINTS.AUDITORIA.CADASTROS}?page=${page}&page_size=${pageSize}`
    )
  },
}
