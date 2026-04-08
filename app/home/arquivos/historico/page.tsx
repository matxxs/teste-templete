"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { DriveAuditoria } from "@/components/features/drive/drive-auditoria"
import { ArrowLeft, History } from "lucide-react"
import { useDriveAuditoria } from "@/hooks/use-drive"
import { isAdmin } from "@/lib/helpers"
import { ROUTES } from "@/constants/routes"

export default function HistoricoArquivosPage() {
  const { user } = useAuth()
  const [page, setPage] = useState(1)
  const admin = isAdmin(user?.nivel_acesso)

  const { data: auditoriaData, isLoading } = useDriveAuditoria(page, admin)

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link href={ROUTES.HOME}>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-3 text-foreground tracking-tight">
              <History className="h-6 w-6 text-primary" />
              Histórico de Arquivos
            </h1>
          </div>
          <p className="text-sm text-muted-foreground ml-11 leading-relaxed">
            Todas as alterações realizadas nos arquivos e pastas
          </p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          <DriveAuditoria
            items={auditoriaData?.items || []}
            loading={isLoading}
            page={page}
            totalPages={auditoriaData?.pages || 1}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  )
}
