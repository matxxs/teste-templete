"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { driveService } from "@/services/drive.service"
import { queryKeys } from "./use-api"
import type { DriveFilters, DriveListResponse, ItemDriveAuditoria, PaginatedResponse } from "@/interfaces"
import { toast } from "sonner"

export function useDriveList(parentId: string | null, filtros: DriveFilters) {
  const filterKey = {
    tipo: filtros.tipo,
    cadastro_id: filtros.cadastro_id,
    grupo_id: filtros.grupo_id,
    modificado: filtros.modificado,
    modificado_apos: filtros.modificado_apos,
    modificado_antes: filtros.modificado_antes,
  }

  return useQuery<DriveListResponse, Error>({
    queryKey: queryKeys.drive.list(parentId, filterKey),
    queryFn: () => driveService.list(parentId, filtros),
  })
}

export function useDriveAuditoria(page: number, enabled: boolean = true) {
  return useQuery<PaginatedResponse<ItemDriveAuditoria>, Error>({
    queryKey: queryKeys.drive.auditoria(page),
    queryFn: () => driveService.getAuditoria(page),
    enabled,
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ nome, parentId }: { nome: string; parentId: string | null }) =>
      driveService.createFolder(nome, parentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drive.all })
      toast.success("Pasta criada")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar pasta")
    },
  })
}

export function useUploadFile() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      file,
      parentId,
      nome,
      grupoId,
    }: {
      file: File
      parentId: string | null
      nome?: string
      grupoId?: string
    }) => driveService.upload(file, parentId, nome, grupoId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drive.all })
      toast.success("Arquivo enviado")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro no upload")
    },
  })
}

export function useDeleteDriveItem() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => driveService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.drive.all })
      toast.success("Item excluído")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir")
    },
  })
}

export function useDownloadItem() {
  return useMutation({
    mutationFn: async ({ id, nome, tipo }: { id: string; nome: string; tipo: string }) => {
      const blob = await driveService.download(id)
      const filename = tipo === "pasta" ? `${nome}.zip` : nome
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
      return { tipo }
    },
    onSuccess: ({ tipo }) => {
      toast.success(tipo === "pasta" ? "Pasta baixada como ZIP" : "Download iniciado")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao baixar")
    },
  })
}
