"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/features/auth/login-form"
import { FileText, Users, ShieldCheck, Moon, Sun } from "lucide-react"
import { ROUTES } from "@/constants/routes"
import { authService } from "@/services/auth.service"

const features = [
  {
    icon: FileText,
    title: "Documentos",
    description:
      "Gerencie e organize todos os seus arquivos em um local centralizado.",
  },
  {
    icon: Users,
    title: "Equipes",
    description: "Controle de acesso e permissoes por equipe de forma segura.",
  },
  {
    icon: ShieldCheck,
    title: "Auditoria",
    description:
      "Trilha completa de auditoria para rastrear todas as acoes realizadas.",
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)

    if (authService.isAuthenticated()) {
      router.replace(ROUTES.HOME)
    }
  }, [router])

  const renderThemeIcon = () => {
    if (!mounted) return <div className="h-4 w-4" />
    return theme === "dark" ? (
      <Sun className="h-4 w-4" />
    ) : (
      <Moon className="h-4 w-4" />
    )
  }

  return (
    <div className="relative min-h-screen grid lg:grid-cols-2">
      {/* Theme toggle */}
      <div className="fixed top-5 right-5 z-50">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Alternar tema"
        >
          {renderThemeIcon()}
        </Button>
      </div>

      {/* Left panel - branding */}
      <div className="hidden lg:flex flex-col justify-between bg-primary text-primary-foreground p-10 lg:p-14">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-foreground/15">
              <FileText className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold tracking-tight">DocManager</span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <div className="max-w-md">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-balance">
              Gerencie seus documentos com simplicidade
            </h1>
            <p className="mt-4 text-primary-foreground/70 text-lg leading-relaxed">
              Plataforma completa para gestao de arquivos, controle de equipes e
              auditoria detalhada.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            {features.map((feature) => (
              <div key={feature.title} className="flex items-start gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-foreground/10">
                  <feature.icon className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-primary-foreground/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-primary-foreground/40">
          DocManager - 2026. Todos os direitos reservados.
        </p>
      </div>

      {/* Right panel - login form */}
      <main className="flex flex-col items-center justify-center p-6 sm:p-10 lg:p-14">
        {/* Mobile logo */}
        <div className="lg:hidden flex items-center gap-3 mb-10">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <FileText className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-foreground">
            DocManager
          </span>
        </div>

        <LoginForm />

        {/* Mobile features */}
        <div className="lg:hidden mt-10 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
          {features.map((feature) => (
            <span key={feature.title} className="flex items-center gap-2">
              <feature.icon className="h-4 w-4" />
              {feature.title}
            </span>
          ))}
        </div>
      </main>
    </div>
  )
}
