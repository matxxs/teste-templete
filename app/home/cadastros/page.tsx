"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Modal } from "@/components/shared/modal"
import { PasswordInput } from "@/components/shared/password-input"
import { Pagination } from "@/components/shared/pagination"
import { UsernameSuggestions } from "@/components/features/auth/username-suggestions"
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Plus,
  History,
} from "lucide-react"
import {
  useCadastrosList,
  useCreateCadastro,
  useUpdateCadastro,
  useDeleteCadastro,
} from "@/hooks/use-cadastros"
import { isAdmin } from "@/lib/helpers"
import { toast } from "sonner"
import { ROUTES } from "@/constants/routes"
import type { CadastroItem, CadastroForm } from "@/interfaces"

const initialForm: CadastroForm = {
  username: "",
  nome: "",
  email: "",
  nivel_acesso: "USUARIO",
  ativo: true,
  senha: "",
}

export default function CadastrosPage() {
  const { user } = useAuth()
  const [pageCadastros, setPageCadastros] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [form, setForm] = useState<CadastroForm>(initialForm)

  const admin = isAdmin(user?.nivel_acesso)

  const { data: cadastrosData, isLoading: loadingCadastros } = useCadastrosList(
    pageCadastros,
    undefined,
    admin
  )

  const createMutation = useCreateCadastro()
  const updateMutation = useUpdateCadastro()
  const deleteMutation = useDeleteCadastro()

  const abrirNovo = () => {
    setEditandoId(null)
    setForm(initialForm)
    setModalAberto(true)
  }

  const abrirEditar = (c: CadastroItem) => {
    setEditandoId(c.usuario_id)
    setForm({
      username: c.username,
      nome: c.nome,
      email: c.email,
      nivel_acesso: c.nivel_acesso,
      ativo: c.ativo,
      senha: "",
    })
    setModalAberto(true)
  }

  const fecharModal = () => {
    setModalAberto(false)
    setEditandoId(null)
    setForm(initialForm)
  }

  const salvarCadastro = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.nome.trim()) {
      toast.error("Nome é obrigatório")
      return
    }
    if (!form.username.trim()) {
      toast.error("Nome de usuário é obrigatório")
      return
    }
    if (!form.email.trim()) {
      toast.error("Email é obrigatório")
      return
    }

    if (editandoId !== null) {
      updateMutation.mutate(
        {
          id: editandoId,
          data: {
            username: form.username,
            nome: form.nome,
            email: form.email,
            nivel_acesso: form.nivel_acesso,
            ativo: form.ativo,
            ...(form.senha ? { senha: form.senha } : {}),
          },
        },
        { onSuccess: fecharModal }
      )
    } else {
      createMutation.mutate(
        {
          username: form.username,
          nome: form.nome,
          email: form.email,
          nivel_acesso: form.nivel_acesso,
          senha: form.senha,
        },
        { onSuccess: fecharModal }
      )
    }
  }

  const excluirCadastro = (c: CadastroItem) => {
    if (!confirm(`Excluir o usuário ${c.nome}?`)) return
    deleteMutation.mutate(c.usuario_id)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-3 text-foreground tracking-tight">
            <Users className="h-6 w-6 text-primary" />
            Usuários
          </h1>
          <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
            Gerencie os usuários do sistema e suas permissões
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href={`${ROUTES.CADASTROS}/historico`}>
            <Button variant="outline" size="sm" className="gap-2 h-9">
              <History className="h-4 w-4" />
              Histórico
            </Button>
          </Link>
          {admin && (
            <Button onClick={abrirNovo} size="sm" className="gap-2 h-9">
              <UserPlus className="h-4 w-4" />
              Novo usuário
            </Button>
          )}
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loadingCadastros ? (
            <div className="py-24 text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p>Carregando usuários...</p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Usuário
                      </th>
                      <th className="text-left py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="text-left py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="text-left py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Nível
                      </th>
                      <th className="text-left py-3 px-5 font-semibold text-xs text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      {admin && <th className="w-24 py-3 px-3" />}
                    </tr>
                  </thead>
                  <tbody>
                    {(cadastrosData?.items || []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={6}
                          className="py-16 text-center text-sm text-muted-foreground"
                        >
                          Nenhum usuário encontrado.
                        </td>
                      </tr>
                    ) : (
                      (cadastrosData?.items || []).map((c) => (
                        <tr
                          key={c.usuario_id}
                          className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors group"
                        >
                          <td className="py-3 px-5 font-mono text-sm font-semibold text-foreground">
                            @{c.username}
                          </td>
                          <td className="py-3 px-5 font-medium text-sm text-foreground">
                            {c.nome}
                          </td>
                          <td className="py-3 px-5 text-xs text-muted-foreground hidden sm:table-cell">
                            {c.email}
                          </td>
                          <td className="py-3 px-5">
                            <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
                              {c.nivel_acesso}
                            </span>
                          </td>
                          <td className="py-3 px-5">
                            <span
                              className={`inline-flex items-center gap-2 text-xs font-medium ${
                                c.ativo
                                  ? "text-green-600 dark:text-green-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`h-2 w-2 rounded-full ${
                                  c.ativo
                                    ? "bg-green-600 dark:bg-green-500"
                                    : "bg-muted-foreground/50"
                                }`}
                              />
                              {c.ativo ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          {admin && (
                            <td className="py-3 px-3">
                              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => abrirEditar(c)}
                                >
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => excluirCadastro(c)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <Pagination
                page={pageCadastros}
                totalPages={cadastrosData?.pages || 1}
                onPageChange={setPageCadastros}
              />
            </>
          )}
        </CardContent>
      </Card>

      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar usuário" : "Novo usuário"}
        icon={
          editandoId ? (
            <Pencil className="h-5 w-5 text-primary" />
          ) : (
            <Plus className="h-5 w-5 text-primary" />
          )
        }
        preventClose={isSubmitting}
      >
        <form onSubmit={salvarCadastro} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Nome completo
            </label>
            <Input
              value={form.nome}
              onChange={(e) => setForm((f) => ({ ...f, nome: e.target.value }))}
              placeholder="João da Silva"
              required
              disabled={isSubmitting}
              className="h-10"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Email
            </label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              placeholder="joao@empresa.com"
              required
              disabled={isSubmitting}
              className="h-10"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Nome de usuário
            </label>
            <Input
              value={form.username}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  username: e.target.value.toLowerCase().replace(/\s+/g, "_"),
                }))
              }
              placeholder="joao_silva"
              required
              disabled={isSubmitting || !!editandoId}
              className="h-10 font-mono"
            />
            {!editandoId && (
              <UsernameSuggestions
                nome={form.nome}
                email={form.email}
                selectedUsername={form.username}
                onSelect={(username) =>
                  setForm((f) => ({ ...f, username }))
                }
              />
            )}
          </div>

          <div>
            <label className="text-sm font-semibold text-foreground block mb-2">
              Nível de acesso
            </label>
            <select
              className="w-full h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
              value={form.nivel_acesso}
              onChange={(e) =>
                setForm((f) => ({ ...f, nivel_acesso: e.target.value }))
              }
              disabled={isSubmitting}
            >
              <option value="USUARIO">USUARIO</option>
              <option value="ADMINISTRADOR">ADMINISTRADOR</option>
              <option value="MASTER">MASTER</option>
            </select>
          </div>

          {editandoId !== null && (
            <div>
              <label className="text-sm font-semibold text-foreground block mb-2">
                Status
              </label>
              <select
                className="w-full h-10 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
                value={form.ativo ? "true" : "false"}
                onChange={(e) =>
                  setForm((f) => ({ ...f, ativo: e.target.value === "true" }))
                }
                disabled={isSubmitting}
              >
                <option value="true">Ativo</option>
                <option value="false">Inativo</option>
              </select>
            </div>
          )}

          <PasswordInput
            label={
              editandoId !== null
                ? "Senha (deixe em branco para manter)"
                : "Senha"
            }
            value={form.senha}
            onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
            placeholder={editandoId !== null ? "Nova senha" : "Senha de acesso"}
            disabled={isSubmitting}
            required={!editandoId}
            className="h-10"
          />

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
