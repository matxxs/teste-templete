import { apiClient, uploadFile, downloadFile } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import {
  USE_MOCK_DATA,
  mockDriveItems,
  mockDriveAuditoria,
  getMockDriveList,
  paginateData,
} from "@/lib/mock-data"
import type {
  DriveListResponse,
  DriveFilters,
  ItemDriveAuditoria,
  ItemDrive,
  PaginatedResponse,
} from "@/interfaces"

// Estado local para simular CRUD em modo mock
let localDriveItems = [...mockDriveItems]
let localAuditoria = [...mockDriveAuditoria]
let nextAudId = Math.max(...localAuditoria.map((a) => a.aud_id)) + 1

export const driveService = {
  buildQueryParams(
    parentId: string | null,
    filtros: DriveFilters
  ): URLSearchParams {
    const params = new URLSearchParams()

    if (parentId) params.set("parent_id", parentId)
    if (filtros.pesquisa) params.set("pesquisa", filtros.pesquisa)
    if (filtros.tipo) params.set("tipo", filtros.tipo)
    if (filtros.cadastro_id) params.set("cadastro_id", filtros.cadastro_id)
    if (filtros.grupo_id) params.set("grupo_id", filtros.grupo_id)
    if (filtros.modificado_apos)
      params.set("modificado_apos", filtros.modificado_apos)
    if (filtros.modificado_antes)
      params.set("modificado_antes", filtros.modificado_antes)

    if (
      filtros.modificado &&
      !filtros.modificado_apos &&
      !filtros.modificado_antes
    ) {
      const now = new Date()
      if (filtros.modificado === "hoje") {
        const start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
        params.set("modificado_apos", start.toISOString())
      } else if (filtros.modificado === "7") {
        const d = new Date(now)
        d.setDate(d.getDate() - 7)
        params.set("modificado_apos", d.toISOString())
      } else if (filtros.modificado === "30") {
        const d = new Date(now)
        d.setDate(d.getDate() - 30)
        params.set("modificado_apos", d.toISOString())
      }
    }

    return params
  },

  async list(
    parentId: string | null,
    filtros: DriveFilters
  ): Promise<DriveListResponse> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      let result = getMockDriveList(parentId)
      let items = result.items
      
      // Aplicar filtros
      if (filtros.pesquisa) {
        const search = filtros.pesquisa.toLowerCase()
        items = items.filter((item) =>
          item.nome.toLowerCase().includes(search)
        )
      }
      
      if (filtros.tipo) {
        items = items.filter((item) => item.tipo === filtros.tipo)
      }
      
      if (filtros.grupo_id) {
        items = items.filter((item) => item.grupo_id === filtros.grupo_id)
      }
      
      if (filtros.cadastro_id) {
        items = items.filter((item) => item.usuario_id === filtros.cadastro_id)
      }
      
      return { items, breadcrumb: result.breadcrumb }
    }
    
    const params = this.buildQueryParams(parentId, filtros)
    return apiClient<DriveListResponse>(
      `${API_ENDPOINTS.DRIVE.LIST}?${params.toString()}`
    )
  },

  async createFolder(nome: string, parentId: string | null): Promise<ItemDrive> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const newFolder: ItemDrive = {
        id: `d${Date.now()}`,
        parent_id: parentId,
        nome: nome.trim(),
        tipo: "pasta",
        path_disco: `/${nome.toLowerCase().replace(/\s+/g, "-")}`,
        usuario_id: "1",
        usuario_sessao: "admin",
        proprietario_nome: "Administrador do Sistema",
        grupo_id: null,
        grupo_cor: null,
        grupo_nome: null,
        tamanho: null,
        mime_type: null,
        data_criacao: new Date().toISOString(),
        data_modificacao: new Date().toISOString(),
      }
      
      localDriveItems.push(newFolder)
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        item_id: newFolder.id,
        acao: "INSERT",
        usuario_sessao: "admin",
        dados_antigos: null,
        dados_novos: { nome: newFolder.nome, tipo: "pasta" },
        data_auditoria: new Date().toISOString(),
      })
      
      return newFolder
    }
    
    return apiClient(API_ENDPOINTS.DRIVE.PASTAS, {
      method: "POST",
      body: JSON.stringify({ nome, parent_id: parentId }),
    })
  },

  async upload(
    file: File,
    parentId: string | null,
    nome?: string,
    grupoId?: string
  ): Promise<ItemDrive> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 500))
      
      const grupo = grupoId
        ? localDriveItems.find((i) => i.grupo_id === grupoId) ||
          { grupo_id: grupoId, grupo_cor: "#3B82F6", grupo_nome: "Grupo" }
        : null
      
      const newFile: ItemDrive = {
        id: `d${Date.now()}`,
        parent_id: parentId,
        nome: nome?.trim() || file.name,
        tipo: "arquivo",
        path_disco: `/${(nome || file.name).toLowerCase().replace(/\s+/g, "-")}`,
        usuario_id: "1",
        usuario_sessao: "admin",
        proprietario_nome: "Administrador do Sistema",
        grupo_id: grupoId || null,
        grupo_cor: grupo?.grupo_cor || null,
        grupo_nome: grupo?.grupo_nome || null,
        tamanho: file.size,
        mime_type: file.type || "application/octet-stream",
        data_criacao: new Date().toISOString(),
        data_modificacao: new Date().toISOString(),
      }
      
      localDriveItems.push(newFile)
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        item_id: newFile.id,
        acao: "INSERT",
        usuario_sessao: "admin",
        dados_antigos: null,
        dados_novos: { nome: newFile.nome, tipo: "arquivo" },
        data_auditoria: new Date().toISOString(),
      })
      
      return newFile
    }
    
    const formData = new FormData()
    formData.append("file", file)
    if (parentId) formData.append("parent_id", parentId)
    if (nome?.trim()) formData.append("nome", nome.trim())
    if (grupoId) formData.append("grupo_id", grupoId)

    return uploadFile<ItemDrive>(API_ENDPOINTS.DRIVE.UPLOAD, formData)
  },

  async download(id: string): Promise<Blob> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      // Simular download com um blob vazio
      return new Blob(["Conteudo mockado do arquivo"], { type: "text/plain" })
    }
    
    return downloadFile(API_ENDPOINTS.DRIVE.DOWNLOAD(id))
  },

  async delete(id: string): Promise<void> {
    if (USE_MOCK_DATA) {
      await new Promise((resolve) => setTimeout(resolve, 300))
      
      const item = localDriveItems.find((i) => i.id === id)
      if (!item) {
        throw new Error("Item nao encontrado")
      }
      
      // Remover item e todos os filhos (se for pasta)
      const idsToRemove = new Set<string>([id])
      
      const findChildren = (parentId: string) => {
        localDriveItems
          .filter((i) => i.parent_id === parentId)
          .forEach((child) => {
            idsToRemove.add(child.id)
            if (child.tipo === "pasta") {
              findChildren(child.id)
            }
          })
      }
      
      if (item.tipo === "pasta") {
        findChildren(id)
      }
      
      localDriveItems = localDriveItems.filter((i) => !idsToRemove.has(i.id))
      
      // Adicionar à auditoria
      localAuditoria.push({
        aud_id: nextAudId++,
        item_id: item.id,
        acao: "DELETE",
        usuario_sessao: "admin",
        dados_antigos: { nome: item.nome, tipo: item.tipo },
        dados_novos: null,
        data_auditoria: new Date().toISOString(),
      })
      
      return
    }
    
    await apiClient(API_ENDPOINTS.DRIVE.DELETE(id), { method: "DELETE" })
  },

  async getAuditoria(
    page: number,
    pageSize: number = 15
  ): Promise<PaginatedResponse<ItemDriveAuditoria>> {
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
    
    return apiClient<PaginatedResponse<ItemDriveAuditoria>>(
      `${API_ENDPOINTS.AUDITORIA.ITENS_DRIVE}?page=${page}&page_size=${pageSize}`
    )
  },
}
