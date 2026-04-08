"use client"

import { useState, useCallback, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { ChevronRight, Search, ShieldAlert } from "lucide-react"
import { ScreenSubNavigation } from "@/components/shared/screen-sub-navigation"
import { DriveFiltersComponent } from "@/components/features/drive/drive-filters"
import { DriveTable } from "@/components/features/drive/drive-table"
import { DriveAuditoria } from "@/components/features/drive/drive-auditoria"
import {
  CreateFolderModal,
  UploadModal,
} from "@/components/features/drive/drive-modals"
import {
  useDriveList,
  useDriveAuditoria,
  useCreateFolder,
  useUploadFile,
  useDeleteDriveItem,
  useDownloadItem,
} from "@/hooks/use-drive"
import { useGruposList } from "@/hooks/use-grupos"
import { useCadastrosList } from "@/hooks/use-cadastros"
import { isAdmin } from "@/lib/helpers"
import type { DriveFilters, ItemDrive } from "@/interfaces"

const initialFilters: DriveFilters = {
  pesquisa: "",
  tipo: "",
  cadastro_id: "",
  grupo_id: "",
  modificado: "",
  modificado_apos: "",
  modificado_antes: "",
}

export default function HomePage() {
  const { user } = useAuth()
  const [parentId, setParentId] = useState<string | null>(null)
  const [filtros, setFiltros] = useState<DriveFilters>(initialFilters)
  const [pessoaLabel, setPessoaLabel] = useState("")
  const [buscaPessoa, setBuscaPessoa] = useState("")
  const [buscaGrupo, setBuscaGrupo] = useState("")
  const [pageAuditoria, setPageAuditoria] = useState(1)

  // Modals
  const [modalNovaPasta, setModalNovaPasta] = useState(false)
  const [modalUpload, setModalUpload] = useState(false)
  const [parentIdParaCriar, setParentIdParaCriar] = useState<string | null>(null)

  const admin = isAdmin(user?.nivel_acesso)

  // Queries
  const { data: driveData, isLoading: loadingDrive, refetch: refetchDrive } = useDriveList(parentId, filtros)
  const { data: gruposData } = useGruposList()
  const { data: cadastrosData } = useCadastrosList(1, buscaPessoa, admin)
  const { data: auditoriaData, isLoading: loadingAuditoria } = useDriveAuditoria(
    pageAuditoria,
    admin
  )

  // Mutations
  const createFolderMutation = useCreateFolder()
  const uploadFileMutation = useUploadFile()
  const deleteItemMutation = useDeleteDriveItem()
  const downloadItemMutation = useDownloadItem()

  const navegarPara = (id: string | null) => setParentId(id)

  const handleSearch = useCallback(() => {
    refetchDrive()
  }, [refetchDrive])

  const handleCreateFolder = (nome: string) => {
    createFolderMutation.mutate(
      { nome, parentId: parentIdParaCriar },
      {
        onSuccess: () => {
          setModalNovaPasta(false)
        },
      }
    )
  }

  const handleUpload = (file: File, nome?: string, grupoId?: string) => {
    uploadFileMutation.mutate(
      { file, parentId: parentIdParaCriar, nome, grupoId },
      {
        onSuccess: () => {
          setModalUpload(false)
        },
      }
    )
  }

  const handleDownload = (item: ItemDrive) => {
    downloadItemMutation.mutate({
      id: item.id,
      nome: item.nome,
      tipo: item.tipo,
    })
  }

  const handleDelete = (item: ItemDrive) => {
    if (!confirm(`Excluir "${item.nome}"?`)) return
    deleteItemMutation.mutate(item.id)
  }

  const handleOpenCreateFolder = () => {
    setParentIdParaCriar(parentId)
    setModalNovaPasta(true)
  }

  const handleOpenUpload = () => {
    setParentIdParaCriar(parentId)
    setModalUpload(true)
  }

  const handleCreateSubfolder = (itemParentId: string) => {
    setParentIdParaCriar(itemParentId)
    setModalNovaPasta(true)
  }

  const handleUploadHere = (itemParentId: string) => {
    setParentIdParaCriar(itemParentId)
    setModalUpload(true)
  }

  // Refetch on filter changes
  useEffect(() => {
    refetchDrive()
  }, [
    filtros.tipo,
    filtros.cadastro_id,
    filtros.grupo_id,
    filtros.modificado,
    filtros.modificado_apos,
    filtros.modificado_antes,
    parentId,
    refetchDrive,
  ])

  const mainContent = (
    <div className="p-4 lg:p-6 space-y-4 max-w-7xl mx-auto">
      {/* Header: Home */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => navegarPara(null)}
            className="flex items-center gap-1 text-sm font-medium text-foreground hover:text-primary transition-colors"
          >
            Home
          </button>
          {driveData?.breadcrumb && driveData.breadcrumb.length > 0 && (
            <>
              {driveData.breadcrumb.map((b) => (
                <span
                  key={b.id}
                  className="flex items-center gap-1 text-sm text-muted-foreground"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                  <button
                    type="button"
                    onClick={() => navegarPara(b.id)}
                    className="hover:text-foreground transition-colors"
                  >
                    {b.nome}
                  </button>
                </span>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Search */}
      <div className="relative min-w-[200px] max-w-sm">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar..."
          value={filtros.pesquisa}
          onChange={(e) => setFiltros((f) => ({ ...f, pesquisa: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pl-8 h-8 text-sm"
        />
      </div>

      {/* Filters */}
      <DriveFiltersComponent
        filtros={filtros}
        setFiltros={setFiltros}
        grupos={gruposData || []}
        cadastros={cadastrosData?.items || []}
        userNivelAcesso={user?.nivel_acesso}
        userCadastroId={user?.cadastro_id}
        userName={user?.nome}
        pessoaLabel={pessoaLabel}
        setPessoaLabel={setPessoaLabel}
        buscaPessoa={buscaPessoa}
        setBuscaPessoa={setBuscaPessoa}
        buscaGrupo={buscaGrupo}
        setBuscaGrupo={setBuscaGrupo}
        onSearch={handleSearch}
        onNovaPasta={handleOpenCreateFolder}
        onUpload={handleOpenUpload}
      />

      {/* Table */}
      <DriveTable
        items={driveData?.items || []}
        loading={loadingDrive}
        onNavigate={navegarPara}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onCreateSubfolder={handleCreateSubfolder}
        onUploadHere={handleUploadHere}
      />

      {/* Modals */}
      <CreateFolderModal
        open={modalNovaPasta}
        onClose={() => setModalNovaPasta(false)}
        onSubmit={handleCreateFolder}
        isSubmitting={createFolderMutation.isPending}
      />

      <UploadModal
        open={modalUpload}
        onClose={() => setModalUpload(false)}
        onSubmit={handleUpload}
        isSubmitting={uploadFileMutation.isPending}
        grupos={gruposData || []}
      />
    </div>
  )

  const logContent = (
    <DriveAuditoria
      items={auditoriaData?.items || []}
      loading={loadingAuditoria}
      page={pageAuditoria}
      totalPages={auditoriaData?.pages || 1}
      onPageChange={setPageAuditoria}
    />
  )

  return (
    <ScreenSubNavigation
      mainContent={mainContent}
      logContent={logContent}
      isVisible={true}
    />
  )
}
