"use client"

import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryOptions,
  type UseMutationOptions,
} from "@tanstack/react-query"
import { apiClient } from "@/services/api"

// Query keys factory for consistent key management
export const queryKeys = {
  drive: {
    all: ["drive"] as const,
    list: (parentId: string | null, filters: Record<string, string>) =>
      ["drive", "list", parentId, filters] as const,
    auditoria: (page: number) => ["drive", "auditoria", page] as const,
  },
  cadastros: {
    all: ["cadastros"] as const,
    list: (page: number, busca?: string) =>
      ["cadastros", "list", page, busca] as const,
    auditoria: (page: number) => ["cadastros", "auditoria", page] as const,
  },
  grupos: {
    all: ["grupos"] as const,
    list: () => ["grupos", "list"] as const,
    auditoria: (page: number) => ["grupos", "auditoria", page] as const,
  },
  auth: {
    user: ["auth", "user"] as const,
  },
}

// Generic hook for GET requests
export function useApiQuery<T>(
  key: readonly unknown[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error>, "queryKey" | "queryFn">
) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: () => apiClient<T>(endpoint),
    ...options,
  })
}

// Generic hook for mutations (POST, PUT, DELETE)
export function useApiMutation<TData, TVariables>(
  mutationFn: (variables: TVariables) => Promise<TData>,
  options?: {
    onSuccess?: (data: TData, variables: TVariables) => void
    onError?: (error: Error, variables: TVariables) => void
    invalidateKeys?: readonly unknown[][]
  }
): ReturnType<typeof useMutation<TData, Error, TVariables>> {
  const queryClient = useQueryClient()

  return useMutation<TData, Error, TVariables>({
    mutationFn,
    onSuccess: (data, variables) => {
      options?.invalidateKeys?.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key as unknown[] })
      })
      options?.onSuccess?.(data, variables)
    },
    onError: options?.onError,
  })
}

// Hook to invalidate queries manually
export function useInvalidateQueries() {
  const queryClient = useQueryClient()

  return {
    invalidate: (key: readonly unknown[]) =>
      queryClient.invalidateQueries({ queryKey: key as unknown[] }),
    invalidateAll: (keys: readonly unknown[][]) =>
      keys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key as unknown[] })
      ),
  }
}
