"use client"

import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ChevronRight, Search, History } from "lucide-react"
import { DriveFiltersComponent } from "@/components/features/drive/drive-filters"
import { DriveTable } from "@/components/features/drive/drive-table"
import {
  CreateFolderModal,
  UploadModal,
} from "@/components/features/drive/drive-modals"
import {
  useDriveList,
  useCreateFolder,
  useUploadFile,
  useDeleteDriveItem,
  useDownloadItem,
} from "@/hooks/use-drive"
import { useGruposList } from "@/hooks/use-grupos"
import { useCadastrosList } from "@/hooks/use-cadastros"
import { isAdmin } from "@/lib/helpers"
import { ROUTES } from "@/constants/routes"
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

  const [modalNovaPasta, setModalNovaPasta] = useState(false)
  const [modalUpload, setModalUpload] = useState(false)
  const [parentIdParaCriar, setParentIdParaCriar] = useState<string | null>(null)

  const admin = isAdmin(user?.nivel_acesso)

  const { data: driveData, isLoading: loadingDrive, refetch: refetchDrive } = useDriveList(parentId, filtros)
  const { data: gruposData } = useGruposList()
  const { data: cadastrosData } = useCadastrosList(1, buscaPessoa, admin)

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

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => navegarPara(null)}
            className="flex items-center gap-1.5 text-base font-semibold text-foreground hover:text-primary transition-colors"
          >
            Arquivos
          </button>
          {driveData?.breadcrumb && driveData.breadcrumb.length > 0 && (
            <>
              {driveData.breadcrumb.map((b) => (
                <span
                  key={b.id}
                  className="flex items-center gap-1.5 text-sm text-muted-foreground"
                >
                  <ChevronRight className="h-4 w-4" />
                  <button
                    type="button"
                    onClick={() => navegarPara(b.id)}
                    className="hover:text-foreground transition-colors font-medium"
                  >
                    {b.nome}
                  </button>
                </span>
              ))}
            </>
          )}
        </div>

        <Link href="/home/arquivos/historico">
          <Button variant="outline" size="sm" className="gap-2 h-9">
            <History className="h-4 w-4" />
            Histórico
          </Button>
        </Link>
      </div>

      <div className="relative min-w-[200px] max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar arquivos..."
          value={filtros.pesquisa}
          onChange={(e) => setFiltros((f) => ({ ...f, pesquisa: e.target.value }))}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          className="pl-10 h-10 text-sm"
        />
      </div>

      <DriveFiltersComponent
        filtros={filtros}
        setFiltros={setFiltros}
        grupos={gruposData || []}
        cadastros={cadastrosData?.items || []}
        userNivelAcesso={user?.nivel_acesso}
        userCadastroId={user?.usuario_id}
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

      <DriveTable
        items={driveData?.items || []}
        loading={loadingDrive}
        onNavigate={navegarPara}
        onDownload={handleDownload}
        onDelete={handleDelete}
        onCreateSubfolder={handleCreateSubfolder}
        onUploadHere={handleUploadHere}
      />

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
}
