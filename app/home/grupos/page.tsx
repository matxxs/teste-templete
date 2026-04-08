"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/shared/modal"
import { Tags, Plus, Pencil, Trash2, History } from "lucide-react"
import {
  useGruposList,
  useCreateGrupo,
  useUpdateGrupo,
  useDeleteGrupo,
} from "@/hooks/use-grupos"
import { isAdmin } from "@/lib/helpers"
import { toast } from "sonner"
import { ROUTES } from "@/constants/routes"
import type { Grupo, GrupoForm } from "@/interfaces"

const initialForm: GrupoForm = {
  nome: "",
  cor: "#3B82F6",
  descricao: "",
}

const coresPredefinidas = [
  "#EF4444",
  "#F97316",
  "#F59E0B",
  "#84CC16",
  "#22C55E",
  "#14B8A6",
  "#06B6D4",
  "#3B82F6",
  "#6366F1",
  "#8B5CF6",
  "#D946EF",
  "#EC4899",
]

export default function GruposPage() {
  const { user } = useAuth()
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<GrupoForm>(initialForm)

  const admin = isAdmin(user?.nivel_acesso)

  const { data: grupos, isLoading: loadingGrupos } = useGruposList()

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
      cor: g.cor_tag || "#3B82F6",
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
      toast.error("Nome é obrigatório")
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
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-foreground tracking-tight">
            <Tags className="h-6 w-6 text-primary" />
            Grupos
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Organize arquivos por categorias com tags coloridas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`${ROUTES.GRUPOS}/historico`}>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <History className="h-4 w-4" />
              Histórico
            </Button>
          </Link>
          {admin && (
            <Button onClick={abrirNovo} size="sm" className="gap-2 h-9">
              <Plus className="h-4 w-4" />
              Novo grupo
            </Button>
          )}
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loadingGrupos ? (
            <div className="py-24 text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p>Carregando grupos...</p>
              </div>
            </div>
          ) : (grupos || []).length === 0 ? (
            <div className="py-16 text-center">
              <div className="flex flex-col items-center gap-3">
                <Tags className="h-12 w-12 text-muted-foreground/30" />
                <p className="text-sm text-muted-foreground font-medium">
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
                    <th className="w-12 py-3 px-5" />
                    <th className="text-left py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                      Nome
                    </th>
                    <th className="text-left py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                      Descrição
                    </th>
                    {admin && <th className="w-24 py-3 px-3" />}
                  </tr>
                </thead>
                <tbody>
                  {(grupos || []).map((g) => (
                    <tr
                      key={g.id}
                      className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors group"
                    >
                      <td className="py-3 px-5">
                        <span
                          className="inline-block w-5 h-5 rounded-full ring-2 ring-offset-2 ring-offset-background"
                          style={{
                            backgroundColor: g.cor_tag || "#3B82F6",
                            boxShadow: `0 0 0 2px ${g.cor_tag || "#3B82F6"}20`,
                          }}
                        />
                      </td>
                      <td className="py-3 px-5 font-semibold text-sm text-foreground">
                        {g.nome}
                      </td>
                      <td className="py-3 px-5 text-xs text-muted-foreground hidden sm:table-cell">
                        {g.descricao || "---"}
                      </td>
                      {admin && (
                        <td className="py-3 px-3">
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => abrirEditar(g)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              onClick={() => excluirGrupo(g)}
                            >
                              <Trash2 className="h-4 w-4" />
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

      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar grupo" : "Novo grupo"}
        icon={
          editandoId ? (
            <Pencil className="h-5 w-5 text-primary" />
          ) : (
            <Plus className="h-5 w-5 text-primary" />
          )
        }
        preventClose={isSubmitting}
      >
        <form onSubmit={salvarGrupo} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Nome
            </label>
            <Input
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              placeholder="Nome do grupo"
              required
              disabled={isSubmitting}
              className="h-10"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2.5">
              Cor
            </label>
            <div className="flex flex-wrap gap-2.5">
              {coresPredefinidas.map((cor) => (
                <button
                  key={cor}
                  type="button"
                  className={`w-9 h-9 rounded-full transition-all ${
                    form.cor === cor
                      ? "ring-2 ring-offset-2 ring-primary scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: cor }}
                  onClick={() => setForm((f) => ({ ...f, cor }))}
                  disabled={isSubmitting}
                />
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Descrição (opcional)
            </label>
            <Input
              value={form.descricao}
              onChange={(e) =>
                setForm((f) => ({ ...f, descricao: e.target.value }))
              }
              placeholder="Descrição do grupo"
              disabled={isSubmitting}
              className="h-10"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={fecharModal}
              disabled={isSubmitting}
              className="h-10 px-4"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="h-10 px-6"
            >
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
