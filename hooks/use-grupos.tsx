"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { gruposService } from "@/services/grupos.service"
import { queryKeys } from "./use-api"
import type {
  Grupo,
  GrupoForm,
  PaginatedResponse,
} from "@/interfaces"
import { toast } from "sonner"

export function useGruposList(enabled: boolean = true) {
  return useQuery<Grupo[], Error>({
    queryKey: queryKeys.grupos.list(),
    queryFn: () => gruposService.list(),
    enabled,
  })
}

export function useCreateGrupo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: GrupoForm) => gruposService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.grupos.all })
      toast.success("Grupo criado")
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
      toast.success("Grupo excluído")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir")
    },
  })
}
