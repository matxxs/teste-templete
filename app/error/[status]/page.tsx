"use client"

import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Home } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { 
  ShieldLockIllustration, 
  ServerErrorIllustration, 
  KeyExpiredIllustration, 
  CloudSearchIllustration,
} from "@/components/shared/error-illustrations"
import { getPageErrorConfig } from "@/constants/error"


export default function DynamicErrorPage() {
  const router = useRouter()
  const params = useParams()
  const status = params.status as string
  
  const config = getPageErrorConfig(status)

  const renderIllustration = () => {
    switch (status) {
      case "401": return <KeyExpiredIllustration className="w-full max-w-sm text-foreground" />
      case "403": return <ShieldLockIllustration className="w-full max-w-sm text-foreground" />
      case "404": return <CloudSearchIllustration className="w-full max-w-sm text-foreground" />
      default: return <ServerErrorIllustration className="w-full max-w-sm text-foreground" />
    }
  }

  return (
    <div className="min-h-screen flex items-center bg-background">
      <div className="w-full max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          
          <div className="order-2 lg:order-1">
            <p className="text-sm font-semibold text-destructive tracking-wide uppercase mb-3">
              Erro {status}
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-foreground tracking-tight leading-tight">
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

              <Button size="lg" className="gap-2 cursor-pointer" render={<Link href={status === "401" ? ROUTES.LOGIN : ROUTES.HOME} />}>
                  <Home className="h-4 w-4" />
                  {status === "401" ? "Ir para Login" : "Ir para o início"}
              </Button>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center">
            {renderIllustration()}
          </div>
        </div>
      </div>
    </div>
  )
}