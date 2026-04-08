"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/shared/modal"
import { Tags, Plus, Pencil, Trash2 } from "lucide-react"
import {
  useGruposList,
  useCreateGrupo,
  useUpdateGrupo,
  useDeleteGrupo,
} from "@/hooks/use-grupos"
import { isAdmin, formatDate, getActionBadgeVariant } from "@/lib/helpers"
import { toast } from "sonner"
import type { Grupo, GrupoForm } from "@/interfaces"

const initialForm: GrupoForm = {
  nome: "",
  cor: "#3B82F6",
  descricao: "",
}

const coresPredefinidas = [
  "#EF4444", // red
  "#F97316", // orange
  "#F59E0B", // amber
  "#84CC16", // lime
  "#22C55E", // green
  "#14B8A6", // teal
  "#06B6D4", // cyan
  "#3B82F6", // blue
  "#6366F1", // indigo
  "#8B5CF6", // violet
  "#D946EF", // fuchsia
  "#EC4899", // pink
]

export default function GruposPage() {
  const { user } = useAuth()
  const [pageAuditoria, setPageAuditoria] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<GrupoForm>(initialForm)

  const admin = isAdmin(user?.nivel_acesso)

  // Queries
  const { data: grupos, isLoading: loadingGrupos } = useGruposList()

  // Mutations
  const createMutation = useCreateGrupo()
  const updateMutation = useUpdateGrupo()
  const deleteMutation = useDeleteGrupo()

  const abrirNovo = () => {
    setEditandoId(null)
    setForm(initialForm)
    setModalAberto(true)
  }

  const abrirEditar = (g: Grupo) => {
    setEditandoId(g.id)
    setForm({
      nome: g.nome,
      cor: g.cor_tag,
      descricao: g.descricao || "",
    })
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setEditandoId(null)
    setForm(initialForm)
  }

  const salvarGrupo = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) {
      toast.error("Nome e obrigatorio")
      return
    }

    if (editandoId !== null) {
      updateMutation.mutate(
        { id: editandoId, data: form },
        { onSuccess: fecharModal }
      )
    } else {
      createMutation.mutate(form, { onSuccess: fecharModal })
    }
  }

  const excluirGrupo = (g: Grupo) => {
    if (!confirm(`Excluir o grupo "${g.nome}"?`)) return
    deleteMutation.mutate(g.id)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending


  return (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Tags className="h-5 w-5 text-primary" /> Grupos
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize arquivos por categorias
          </p>
        </div>
        {admin && (
          <Button onClick={abrirNovo} size="sm" className="gap-1.5 h-8 text-xs">
            <Plus className="h-3.5 w-3.5" /> Novo grupo
          </Button>
        )}
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loadingGrupos ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : (grupos || []).length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-2">
                <Tags className="h-10 w-10 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground">
                  Nenhum grupo cadastrado
                </p>
                {admin && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={abrirNovo}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1.5" /> Criar primeiro grupo
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/30">
                    <th className="w-10 py-2.5 px-4" />
                    <th className="text-left py-2.5 px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="text-left py-2.5 px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Descricao
                    </th>
                    {admin && <th className="w-20 py-2.5 px-2" />}
                  </tr>
                </thead>
                <tbody>
                  {(grupos || []).map((g) => (
                    <tr
                      key={g.id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors group"
                    >
                      <td className="py-2.5 px-4">
                        <span
                          className="inline-block w-4 h-4 rounded-full"
                          style={{ backgroundColor: g.cor_tag || "#3B82F6" }}
                        />
                      </td>
                      <td className="py-2.5 px-4 font-medium text-sm text-foreground">
                        {g.nome}
                      </td>
                      <td className="py-2.5 px-4 text-xs text-muted-foreground hidden sm:table-cell">
                        {g.descricao || "---"}
                      </td>
                      {admin && (
                        <td className="py-2 px-2">
                          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={() => abrirEditar(g)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 text-destructive hover:text-destructive"
                              onClick={() => excluirGrupo(g)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal */}
      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar grupo" : "Novo grupo"}
        icon={
          editandoId ? (
            <Pencil className="h-4 w-4 text-primary" />
          ) : (
            <Plus className="h-4 w-4 text-primary" />
          )
        }
        preventClose={isSubmitting}
      >
        <form onSubmit={salvarGrupo} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Nome
            </label>
            <Input
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              placeholder="Nome do grupo"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1.5">
              Cor
            </label>
            <div className="flex flex-wrap gap-2">
              {coresPredefinidas.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  className={`w-7 h-7 rounded-full transition-all ${form.cor === cor
                      ? "ring-2 ring-offset-2 ring-primary"
                      : "hover:scale-110"
                    }`}
                  style={{ backgroundColor: cor }}
                  onClick={() => setForm((f) => ({ ...f, cor }))}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Descricao (opcional)
            </label>
            <Input
              value={form.descricao}
              onChange={(e) =>
                setForm((f) => ({ ...f, descricao: e.target.value }))
              }
              placeholder="Descricao do grupo"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fecharModal}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isSubmitting
                ? "Salvando..."
                : editandoId !== null
                  ? "Salvar"
                  : "Criar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
