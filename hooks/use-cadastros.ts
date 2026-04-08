"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cadastrosService } from "@/services/cadastros.service"
import { queryKeys } from "./use-api"
import type {
  CadastroItem,
  CadastroForm,
  CadastroAuditoriaItem,
  PaginatedResponse,
} from "@/interfaces"
import { toast } from "sonner"

export function useCadastrosList(page: number, busca?: string, enabled: boolean = true) {
  return useQuery<PaginatedResponse<CadastroItem>, Error>({
    queryKey: queryKeys.cadastros.list(page, busca),
    queryFn: () => cadastrosService.list(page, 10, busca),
    enabled,
  })
}

export function useCadastrosAuditoria(page: number, enabled: boolean = true) {
  return useQuery<PaginatedResponse<CadastroAuditoriaItem>, Error>({
    queryKey: queryKeys.cadastros.auditoria(page),
    queryFn: () => cadastrosService.getAuditoria(page),
    enabled,
  })
}

export function useCreateCadastro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: Omit<CadastroForm, "ativo">) =>
      cadastrosService.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cadastros.all })
      toast.success("Usuário criado com sucesso")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao criar usuário")
    },
  })
}

export function useUpdateCadastro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<CadastroForm> }) =>
      cadastrosService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cadastros.all })
      toast.success("Usuário atualizado")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao atualizar usuário")
    },
  })
}

export function useDeleteCadastro() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => cadastrosService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.cadastros.all })
      toast.success("Usuário excluído")
    },
    onError: (error: Error) => {
      toast.error(error.message || "Erro ao excluir")
    },
  })
}
