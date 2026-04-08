import { apiClient, uploadFile, downloadFile } from "./api"
import { API_ENDPOINTS } from "@/constants/api-endpoints"
import type {
  DriveListResponse,
  DriveFilters,
  ItemDriveAuditoria,
  PaginatedResponse,
} from "@/interfaces"

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
    const params = this.buildQueryParams(parentId, filtros)
    return apiClient<DriveListResponse>(
      `${API_ENDPOINTS.DRIVE.LIST}?${params.toString()}`
    )
  },

  async createFolder(nome: string, parentId: string | null): Promise<unknown> {
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
  ): Promise<unknown> {
    const formData = new FormData()
    formData.append("file", file)
    if (parentId) formData.append("parent_id", parentId)
    if (nome?.trim()) formData.append("nome", nome.trim())
    if (grupoId) formData.append("grupo_id", grupoId)

    return uploadFile(API_ENDPOINTS.DRIVE.UPLOAD, formData)
  },

  async download(id: string): Promise<Blob> {
    return downloadFile(API_ENDPOINTS.DRIVE.DOWNLOAD(id))
  },

  async delete(id: string): Promise<void> {
    await apiClient(API_ENDPOINTS.DRIVE.DELETE(id), { method: "DELETE" })
  },

  async getAuditoria(
    page: number,
    pageSize: number = 15
  ): Promise<PaginatedResponse<ItemDriveAuditoria>> {
    return apiClient<PaginatedResponse<ItemDriveAuditoria>>(
      `${API_ENDPOINTS.AUDITORIA.ITENS_DRIVE}?page=${page}&page_size=${pageSize}`
    )
  },
}
