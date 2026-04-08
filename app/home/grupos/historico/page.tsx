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
import { useGruposAuditoria } from "@/hooks/use-grupos"

export default function HistoricoGruposPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const admin = isAdmin(user?.nivel_acesso)

  const { data: auditoriaData, isLoading } = useGruposAuditoria(page, admin)

  if (!admin) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              Voce nao tem permissao para acessar o historico de grupos.
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
              Historico de Grupos
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11 leading-relaxed">
            Todas as alteracoes realizadas nos grupos
          </p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="py-24 text-center text-sm text-muted-foreground">
              <div className="flex flex-col items-center gap-3">
                <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <p>Carregando historico...</p>
              </div>
            </div>
          ) : (auditoriaData?.items || []).length === 0 ? (
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
                      Acao
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5">
                      Cor
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5">
                      Nome
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5 hidden md:table-cell">
                      Descricao
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-muted-foreground uppercase tracking-wider h-11 px-5 hidden lg:table-cell">
                      Por
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {(auditoriaData?.items || []).map((a) => (
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
                            backgroundColor: a.cor_tag || "#3B82F6",
                            boxShadow: `0 0 0 2px ${a.cor_tag || "#3B82F6"}20`,
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
                totalPages={auditoriaData?.pages || 1}
                onPageChange={setPage}
              />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
