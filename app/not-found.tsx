"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CloudSearchIllustration } from "@/components/shared/error-illustrations"
import { ArrowLeft, Home } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { getPageErrorConfig } from "@/constants/error"
import { ROUTES } from "@/constants/routes"

export default function NotFound() {
  const router = useRouter()
  const params = useParams()
  const config = getPageErrorConfig("404")

  return (
    <div className="min-h-screen flex items-center bg-background">
      <div className="w-full max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="order-2 lg:order-1">
            <p className="text-sm font-semibold text-primary tracking-wide uppercase mb-3">
              Erro 404
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight text-balance leading-tight">
              {config.title}
            </h1>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed max-w-lg">
              {config.message}
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-8">
              <Button variant="outline" size="lg" className="gap-2 cursor-pointer" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4" />
                Voltar
              </Button>

              <Button size="lg" className="gap-2 cursor-pointer" render={<Link href={ROUTES.HOME} />}>
                <Home className="h-4 w-4" />
                  Ir para o inicio
              </Button>
            </div>
          </div>

          {/* Right illustration */}
          <div className="order-1 lg:order-2 flex justify-center">
            <CloudSearchIllustration className="w-full max-w-sm text-foreground" />
          </div>
        </div>
      </div>
    </div>
  )
}
