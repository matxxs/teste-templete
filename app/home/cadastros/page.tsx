"use client"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Modal } from "@/components/shared/modal"
import { PasswordInput } from "@/components/shared/password-input"
import { Pagination } from "@/components/shared/pagination"
import { ScreenSubNavigation } from "@/components/shared/screen-sub-navigation"
import {
  Users,
  UserPlus,
  Pencil,
  Trash2,
  Plus,
  ShieldAlert,
  History,
} from "lucide-react"
import {
  useCadastrosList,
  useCadastrosAuditoria,
  useCreateCadastro,
  useUpdateCadastro,
  useDeleteCadastro,
} from "@/hooks/use-cadastros"
import {
  isAdmin,
  formatDate,
  getActionBadgeVariant,
} from "@/lib/helpers"
import { toast } from "sonner"
import type { CadastroItem, CadastroForm } from "@/interfaces"

const initialForm: CadastroForm = {
  NOME: "",
  EMAIL: "",
  NIVEL_ACESSO: "USUARIO",
  ATIVO: "S",
  senha: "",
}

export default function CadastrosPage() {
  const { user } = useAuth()
  const [pageCadastros, setPageCadastros] = useState(1)
  const [pageAuditoria, setPageAuditoria] = useState(1)
  const [modalAberto, setModalAberto] = useState(false)
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [form, setForm] = useState<CadastroForm>(initialForm)

  const admin = isAdmin(user?.nivel_acesso)

  // Queries
  const { data: cadastrosData, isLoading: loadingCadastros } = useCadastrosList(
    pageCadastros,
    undefined,
    admin
  )
  const { data: auditoriaData, isLoading: loadingAuditoria } =
    useCadastrosAuditoria(pageAuditoria, admin)

  // Mutations
  const createMutation = useCreateCadastro()
  const updateMutation = useUpdateCadastro()
  const deleteMutation = useDeleteCadastro()

  const abrirNovo = () => {
    setEditandoId(null)
    setForm(initialForm)
    setModalAberto(true)
  }

  const abrirEditar = (c: CadastroItem) => {
    setEditandoId(c.CADASTRO_ID)
    setForm({
      NOME: c.NOME,
      EMAIL: c.EMAIL ?? "",
      NIVEL_ACESSO: c.NIVEL_ACESSO,
      ATIVO: c.ATIVO,
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
    if (!form.NOME.trim()) {
      toast.error("Nome e obrigatorio")
      return
    }

    if (editandoId !== null) {
      updateMutation.mutate(
        {
          id: editandoId,
          data: {
            NOME: form.NOME,
            EMAIL: form.EMAIL,
            NIVEL_ACESSO: form.NIVEL_ACESSO,
            ATIVO: form.ATIVO,
            ...(form.senha ? { senha: form.senha } : {}),
          },
        },
        { onSuccess: fecharModal }
      )
    } else {
      createMutation.mutate(
        {
          NOME: form.NOME,
          EMAIL: form.EMAIL,
          NIVEL_ACESSO: form.NIVEL_ACESSO,
          senha: form.senha,
        },
        { onSuccess: fecharModal }
      )
    }
  }

  const excluirCadastro = (c: CadastroItem) => {
    if (!confirm(`Excluir o cadastro de ${c.NOME}?`)) return
    deleteMutation.mutate(c.CADASTRO_ID)
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  const mainContent = (
    <div className="space-y-4 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold flex items-center gap-2 text-foreground">
            <Users className="h-5 w-5 text-primary" /> Usuarios cadastrados
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Gerencie os usuarios do sistema
          </p>
        </div>
        <Button onClick={abrirNovo} size="sm" className="gap-1.5 h-8 text-xs">
          <UserPlus className="h-3.5 w-3.5" /> Novo usuario
        </Button>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loadingCadastros ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/30">
                      <th className="text-left py-2.5 px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                        Nome
                      </th>
                      <th className="text-left py-2.5 px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                        Email
                      </th>
                      <th className="text-left py-2.5 px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                        Nivel
                      </th>
                      <th className="text-left py-2.5 px-4 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="w-20 py-2.5 px-2" />
                    </tr>
                  </thead>
                  <tbody>
                    {(cadastrosData?.items || []).length === 0 ? (
                      <tr>
                        <td
                          colSpan={5}
                          className="py-12 text-center text-sm text-muted-foreground"
                        >
                          Nenhum cadastro encontrado.
                        </td>
                      </tr>
                    ) : (
                      (cadastrosData?.items || []).map((c) => (
                        <tr
                          key={c.CADASTRO_ID}
                          className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors group"
                        >
                          <td className="py-2.5 px-4 font-medium text-sm text-foreground">
                            {c.NOME}
                          </td>
                          <td className="py-2.5 px-4 text-xs text-muted-foreground hidden sm:table-cell">
                            {c.EMAIL ?? "---"}
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="inline-flex items-center rounded-md bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                              {c.NIVEL_ACESSO}
                            </span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span
                              className={`inline-flex items-center gap-1.5 text-xs ${
                                c.ATIVO === "S"
                                  ? "text-green-600 dark:text-green-500"
                                  : "text-muted-foreground"
                              }`}
                            >
                              <span
                                className={`h-1.5 w-1.5 rounded-full ${
                                  c.ATIVO === "S"
                                    ? "bg-green-600 dark:bg-green-500"
                                    : "bg-muted-foreground/50"
                                }`}
                              />
                              {c.ATIVO === "S" ? "Ativo" : "Inativo"}
                            </span>
                          </td>
                          <td className="py-2 px-2">
                            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7"
                                onClick={() => abrirEditar(c)}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-destructive hover:text-destructive"
                                onClick={() => excluirCadastro(c)}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </td>
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

      {/* Modal */}
      <Modal
        open={modalAberto}
        onClose={fecharModal}
        title={editandoId ? "Editar usuario" : "Novo usuario"}
        icon={
          editandoId ? (
            <Pencil className="h-4 w-4 text-primary" />
          ) : (
            <Plus className="h-4 w-4 text-primary" />
          )
        }
        preventClose={isSubmitting}
      >
        <form onSubmit={salvarCadastro} className="space-y-3">
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Nome
            </label>
            <Input
              value={form.NOME}
              onChange={(e) => setForm((f) => ({ ...f, NOME: e.target.value }))}
              placeholder="Nome completo"
              required
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Email (login)
            </label>
            <Input
              type="email"
              value={form.EMAIL}
              onChange={(e) => setForm((f) => ({ ...f, EMAIL: e.target.value }))}
              placeholder="email@exemplo.com"
              disabled={isSubmitting}
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground block mb-1">
              Nivel de acesso
            </label>
            <select
              className="w-full h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
              value={form.NIVEL_ACESSO}
              onChange={(e) =>
                setForm((f) => ({ ...f, NIVEL_ACESSO: e.target.value }))
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
              <label className="text-xs font-medium text-foreground block mb-1">
                Ativo
              </label>
              <select
                className="w-full h-9 rounded-lg border border-input bg-card px-3 text-sm text-foreground"
                value={form.ATIVO}
                onChange={(e) => setForm((f) => ({ ...f, ATIVO: e.target.value }))}
                disabled={isSubmitting}
              >
                <option value="S">Sim</option>
                <option value="N">Nao</option>
              </select>
            </div>
          )}
          <PasswordInput
            label={
              editandoId !== null
                ? "Senha (deixe em branco para manter)"
                : "Senha (opcional)"
            }
            value={form.senha}
            onChange={(e) => setForm((f) => ({ ...f, senha: e.target.value }))}
            placeholder={editandoId !== null ? "Nova senha" : "Senha de acesso"}
            disabled={isSubmitting}
          />
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
              {isSubmitting ? "Salvando..." : editandoId !== null ? "Salvar" : "Criar"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )

  const logContent = (
    <div className="space-y-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Historico de auditoria
          </h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {auditoriaData?.items?.length || 0} registros
        </span>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loadingAuditoria ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : (auditoriaData?.items || []).length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Nenhum registro de auditoria encontrado.
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-9 px-3">
                    Data/Hora
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-9 px-3">
                    Acao
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-9 px-3">
                    Usuario
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-9 px-3 hidden md:table-cell">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-9 px-3 hidden lg:table-cell">
                    Por
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(auditoriaData?.items || []).map((a) => (
                  <TableRow key={a.AUD_ID} className="border-border/50">
                    <TableCell className="py-2 px-3 text-xs text-muted-foreground font-mono">
                      {formatDate(a.DATA_AUDITORIA)}
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <Badge
                        variant={getActionBadgeVariant(a.ACAO)}
                        className="text-[10px] px-1.5 py-0 font-medium"
                      >
                        {a.ACAO}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 px-3">
                      <div className="flex flex-col">
                        <span className="text-xs font-medium text-foreground truncate max-w-[150px]">
                          {a.NOME}
                        </span>
                        <span
                          className={`text-[10px] ${
                            a.ATIVO === "S"
                              ? "text-green-600 dark:text-green-500"
                              : "text-muted-foreground"
                          }`}
                        >
                          {a.ATIVO === "S" ? "Ativo" : "Inativo"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2 px-3 text-xs text-muted-foreground hidden md:table-cell truncate max-w-[180px]">
                      {a.EMAIL ?? "---"}
                    </TableCell>
                    <TableCell className="py-2 px-3 text-xs text-muted-foreground hidden lg:table-cell truncate max-w-[120px]">
                      {a.USUARIO_SESSAO ?? "Sistema"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <Pagination
            page={pageAuditoria}
            totalPages={auditoriaData?.pages || 1}
            onPageChange={setPageAuditoria}
            variant="compact"
          />
        </CardContent>
      </Card>
    </div>
  )

  return (
    <ScreenSubNavigation
      mainContent={mainContent}
      logContent={logContent}
      isVisible={true}
    />
  )
}
