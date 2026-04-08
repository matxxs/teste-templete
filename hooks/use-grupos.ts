"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gruposService } from "@/services/grupos.service"
import { queryKeys } from "./use-api"
import type { Grupo, GrupoForm, PaginatedResponse } from "@/interfaces"
import type { GrupoAuditoriaItem } from "@/lib/mock-data"
import { toast } from "sonner"

export function useGruposList() {
  return useQuery<Grupo[], Error>({
    queryKey: queryKeys.grupos.all,
    queryFn: () => gruposService.list(),
  })
}

export function useGruposAuditoria(page: number, enabled: boolean = true) {
  return useQuery<PaginatedResponse<GrupoAuditoriaItem>, Error>({
    queryKey: ["grupos", "auditoria", page],
    queryFn: () => gruposService.getAuditoria(page),
    enabled,
  })
}

export function useCreateGrupo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GrupoForm) => gruposService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grupos.all })
      toast.success("Grupo criado com sucesso")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar grupo")
    },
  })
}

export function useUpdateGrupo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<GrupoForm> }) =>
      gruposService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grupos.all })
      toast.success("Grupo atualizado")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar grupo")
    },
  })
}

export function useDeleteGrupo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => gruposService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grupos.all })
      toast.success("Grupo excluido")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir grupo")
    },
  })
}
