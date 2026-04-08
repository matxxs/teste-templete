"use client"

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
import { History } from "lucide-react"
import { Pagination } from "@/components/shared/pagination"
import { formatDate, getActionBadgeVariant, translateAction } from "@/lib/helpers"
import type { ItemDriveAuditoria } from "@/interfaces"

interface DriveAuditoriaProps {
  items: ItemDriveAuditoria[]
  loading: boolean
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function DriveAuditoria({
  items,
  loading,
  page,
  totalPages,
  onPageChange,
}: DriveAuditoriaProps) {
  return (
    <div className="space-y-3 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold text-foreground">
            Historico de auditoria
          </h2>
        </div>
        <span className="text-xs text-muted-foreground">
          {items.length} registros
        </span>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {loading ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              Carregando...
            </div>
          ) : items.length === 0 ? (
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
                    Item
                  </TableHead>
                  <TableHead className="text-xs font-medium text-muted-foreground uppercase tracking-wider h-9 px-3 hidden md:table-cell">
                    Por
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((a) => {
                  const dadosAtuais = a.dados_novos || a.dados_antigos
                  const nomeItem =
                    (dadosAtuais as Record<string, unknown>)?.nome || "Item removido"

                  return (
                    <TableRow key={a.aud_id} className="border-border/50">
                      <TableCell className="py-2 px-3 text-xs text-muted-foreground font-mono">
                        {formatDate(a.data_auditoria)}
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <Badge
                          variant={getActionBadgeVariant(a.acao)}
                          className="text-[10px] px-1.5 py-0 font-medium"
                        >
                          {translateAction(a.acao)}
                        </Badge>
                      </TableCell>
                      <TableCell className="py-2 px-3">
                        <span className="text-xs font-medium text-foreground truncate max-w-[150px] block">
                          {nomeItem as string}
                        </span>
                      </TableCell>
                      <TableCell className="py-2 px-3 text-xs text-muted-foreground hidden md:table-cell">
                        {a.usuario_sessao ?? "Sistema"}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={onPageChange}
            variant="compact"
          />
        </CardContent>
      </Card>
    </div>
  )
}
