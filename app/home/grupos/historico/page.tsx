"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft, History } from "lucide-react"
import { ROUTES } from "@/constants/routes"

export default function HistoricoGruposPage() {
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
        <CardContent className="py-16 text-center text-sm text-muted-foreground">
          Histórico de grupos em desenvolvimento
        </CardContent>
      </Card>
    </div>
  )
}
