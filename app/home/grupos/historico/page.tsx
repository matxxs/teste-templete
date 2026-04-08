"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
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
import { Pagination } from "@/components/shared/pagination"
import { ArrowLeft, History } from "lucide-react"
import { isAdmin, formatDate, getActionBadgeVariant, translateAction } from "@/lib/helpers"
import { ROUTES } from "@/constants/routes"

// Interface para auditoria de grupos
interface GrupoAuditoriaItem {
  aud_id: number
  grupo_id: string
  nome: string
  cor_tag: string
  descricao: string | null
  acao: string
  usuario_sessao: string | null
  data_auditoria: string
}

// Mock data para auditoria de grupos
const mockGruposAuditoria: GrupoAuditoriaItem[] = [
  {
    aud_id: 1,
    grupo_id: "grp-001",
    nome: "Financeiro",
    cor_tag: "#3B82F6",
    descricao: "Documentos financeiros da empresa",
    acao: "INSERT",
    usuario_sessao: "carlos_lima",
    data_auditoria: "2026-04-08T14:30:00Z",
  },
  {
    aud_id: 2,
    grupo_id: "grp-002",
    nome: "RH",
    cor_tag: "#22C55E",
    descricao: "Recursos Humanos",
    acao: "INSERT",
    usuario_sessao: "maria_santos",
    data_auditoria: "2026-04-08T12:15:00Z",
  },
  {
    aud_id: 3,
    grupo_id: "grp-001",
    nome: "Financeiro",
    cor_tag: "#EF4444",
    descricao: "Documentos financeiros e contábeis",
    acao: "UPDATE",
    usuario_sessao: "joao_silva",
    data_auditoria: "2026-04-07T16:45:00Z",
  },
  {
    aud_id: 4,
    grupo_id: "grp-003",
    nome: "Marketing",
    cor_tag: "#F97316",
    descricao: "Materiais de marketing",
    acao: "INSERT",
    usuario_sessao: "ana_oliveira",
    data_auditoria: "2026-04-07T10:20:00Z",
  },
  {
    aud_id: 5,
    grupo_id: "grp-004",
    nome: "Jurídico",
    cor_tag: "#8B5CF6",
    descricao: "Contratos e documentos legais",
    acao: "INSERT",
    usuario_sessao: "pedro_costa",
    data_auditoria: "2026-04-06T09:00:00Z",
  },
  {
    aud_id: 6,
    grupo_id: "grp-005",
    nome: "Temp",
    cor_tag: "#6B7280",
    descricao: null,
    acao: "DELETE",
    usuario_sessao: "carlos_lima",
    data_auditoria: "2026-04-05T17:30:00Z",
  },
  {
    aud_id: 7,
    grupo_id: "grp-002",
    nome: "Recursos Humanos",
    cor_tag: "#22C55E",
    descricao: "Departamento de RH - Documentos",
    acao: "UPDATE",
    usuario_sessao: "maria_santos",
    data_auditoria: "2026-04-05T14:10:00Z",
  },
  {
    aud_id: 8,
    grupo_id: "grp-006",
    nome: "Projetos",
    cor_tag: "#14B8A6",
    descricao: "Documentação de projetos",
    acao: "INSERT",
    usuario_sessao: "joao_silva",
    data_auditoria: "2026-04-04T11:25:00Z",
  },
]

export default function HistoricoGruposPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const admin = isAdmin(user?.nivel_acesso)

  // Simulando paginação com mock data
  const pageSize = 5
  const totalPages = Math.ceil(mockGruposAuditoria.length / pageSize)
  const paginatedItems = mockGruposAuditoria.slice(
    (page - 1) * pageSize,
    page * pageSize
  )

  if (!admin) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Você não tem permissão para acessar o histórico de grupos.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href={ROUTES.GRUPOS}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-3 text-foreground tracking-tight">
              <History className="h-6 w-6 text-primary" />
              Histórico de Grupos
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11 leading-relaxed">
            Todas as alterações realizadas nos grupos
          </p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {paginatedItems.length === 0 ? (
            <div className="py-16 text-center text-sm text-muted-foreground">
              Nenhum registro de auditoria encontrado.
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5">
                      Data/Hora
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5">
                      Ação
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5">
                      Cor
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5">
                      Nome
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5 hidden md:table-cell">
                      Descrição
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5 hidden lg:table-cell">
                      Por
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((a) => (
                    <TableRow key={a.aud_id} className="border-border/50">
                      <TableCell className="py-3 px-5 text-xs text-muted-foreground font-mono whitespace-nowrap">
                        {formatDate(a.data_auditoria)}
                      </TableCell>
                      <TableCell className="py-3 px-5">
                        <Badge
                          variant={getActionBadgeVariant(a.acao)}
                          className="text-xs px-2 py-0.5 font-semibold"
                        >
                          {translateAction(a.acao)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-3 px-5">
                        <span
                          className="inline-block w-5 h-5 rounded-full ring-2 ring-offset-2 ring-offset-background"
                          style={{
                            backgroundColor: a.cor_tag,
                            boxShadow: `0 0 0 2px ${a.cor_tag}20`,
                          }}
                        />
                      </TableCell>
                      <TableCell className="py-3 px-5 text-sm font-semibold text-foreground">
                        {a.nome}
                      </TableCell>
                      <TableCell className="py-3 px-5 text-xs text-muted-foreground hidden md:table-cell max-w-[200px] truncate">
                        {a.descricao || "---"}
                      </TableCell>
                      <TableCell className="py-3 px-5 hidden lg:table-cell">
                        <span className="text-xs font-mono font-medium text-foreground">
                          @{a.usuario_sessao || "sistema"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={setPage}
                variant="compact"
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
