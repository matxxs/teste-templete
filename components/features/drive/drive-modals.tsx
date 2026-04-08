"use client"

import { useState } from "react"
import { Modal } from "@/components/shared/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FolderPlus, Upload } from "lucide-react"
import type { Grupo } from "@/interfaces"
import { cn } from "@/lib/utils"

interface CreateFolderModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (nome: string) => void
  isSubmitting: boolean
}

export function CreateFolderModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
}: CreateFolderModalProps) {
  const [nomePasta, setNomePasta] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nomePasta.trim()) return
    onSubmit(nomePasta.trim())
    setNomePasta("")
  }

  const handleClose = () => {
    setNomePasta("")
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Nova pasta"
      icon={<FolderPlus className="h-4 w-4 text-primary" />}
      preventClose={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Nome da pasta
          </label>
          <Input
            value={nomePasta}
            onChange={(e) => setNomePasta(e.target.value)}
            placeholder="Ex: Documentos 2025"
            required
            autoFocus
            disabled={isSubmitting}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className={cn(
              "transition-all",
              (isSubmitting) ? "cursor-pointer" : ""
            )}
            type="submit"
            size="sm"
            disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}

interface UploadModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (file: File, nome?: string, grupoId?: string) => void
  isSubmitting: boolean
  grupos: Grupo[]
}

export function UploadModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  grupos,
}: UploadModalProps) {
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadNome, setUploadNome] = useState("")
  const [grupoSelecionado, setGrupoSelecionado] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!uploadFile) return
    onSubmit(
      uploadFile,
      uploadNome.trim() || undefined,
      grupoSelecionado || undefined
    )
  }

  const handleClose = () => {
    setUploadFile(null)
    setUploadNome("")
    setGrupoSelecionado("")
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload de arquivo"
      icon={<Upload className="h-4 w-4 text-primary" />}
      preventClose={isSubmitting}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Arquivo
          </label>
          <Input
            type="file"
            onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
            required
            className="text-xs"
            disabled={isSubmitting}
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Nome personalizado (opcional)
          </label>
          <Input
            value={uploadNome}
            onChange={(e) => setUploadNome(e.target.value)}
            placeholder="Nome do arquivo"
            disabled={isSubmitting}
          />
        </div>
        {grupos.length > 0 && (
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Grupo
            </label>
            <select
              className="w-full h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
              value={grupoSelecionado}
              onChange={(e) => setGrupoSelecionado(e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Sem grupo</option>
              {grupos.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.nome}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="flex justify-end gap-2">
          <Button
            className="cursor-pointer"
            type="button"
            variant="outline"
            size="sm"
            onClick={handleClose}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            className={cn(
              "transition-all",
              (isSubmitting || !uploadFile) ? "cursor-pointer" : ""
            )}
            type="submit"
            size="sm"
            disabled={isSubmitting || !uploadFile}
          >
            {isSubmitting ? "Enviando..." : "Enviar"}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
