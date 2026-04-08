"use client"

import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import {
  Home,
  Users,
  FileText,
  LogOut,
  Moon,
  Sun,
  Tags,
  ChevronRight,
} from "lucide-react"
import { AuthProvider, useAuth } from "@/contexts/auth-context"
import { isAdmin } from "@/lib/helpers"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/constants/routes"

const navItems = [
  { href: ROUTES.HOME, label: "Arquivos", icon: Home },
  { href: ROUTES.CADASTROS, label: "Usuarios", icon: Users, adminOnly: true },
  { href: ROUTES.GRUPOS, label: "Grupos", icon: Tags },
]

function HomeLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, loading, logout } = useAuth()
  const [mounted, setMounted] = useState(false)
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => setMounted(true), [])

  const handleLogout = () => {
    setIsLoggingOut(true)
    logout()
  }

  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 animate-pulse" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    )
  }

  if (isLoggingOut) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Encerrando sessao...</p>
      </div>
    )
  }

  // if (error) return null

  const userIsAdmin = isAdmin(user?.nivel_acesso)

  const filteredNav = navItems.filter((item) => !item.adminOnly || userIsAdmin)

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-card/80 backdrop-blur-sm">
        <div className="flex items-center justify-between h-14 px-4 lg:px-6">
          {/* Logo + Nav */}
          <div className="flex items-center gap-6">
            <Link href={ROUTES.HOME} className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center">
                <FileText className="h-3.5 w-3.5 text-primary-foreground" />
              </div>
              <span className="font-semibold text-foreground text-sm tracking-tight hidden sm:inline">
                DocManager
              </span>
            </Link>

            <nav
              className="flex items-center"
              role="navigation"
              aria-label="Menu principal"
            >
              <div className="hidden sm:flex items-center gap-1">
                {filteredNav.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href
                  return (
                    <Link key={href} href={href}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                          "gap-2 text-sm font-normal h-8",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        {label}
                      </Button>
                    </Link>
                  )
                })}
              </div>

              {/* Mobile nav */}
              <div className="flex sm:hidden items-center gap-1">
                {filteredNav.map(({ href, label, icon: Icon }) => {
                  const isActive = pathname === href
                  return (
                    <Link key={href} href={href}>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "h-8 w-8",
                          isActive
                            ? "bg-secondary text-secondary-foreground"
                            : "text-muted-foreground"
                        )}
                        aria-label={label}
                      >
                        <Icon className="h-4 w-4" />
                      </Button>
                    </Link>
                  )
                })}
              </div>
            </nav>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {user?.nivel_acesso && (
              <span className="hidden md:inline-flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                {user.nivel_acesso}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Alternar tema"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="gap-2 text-muted-foreground hover:text-foreground h-8 text-sm font-normal"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-4 lg:px-6 pb-2 text-xs text-muted-foreground">
          <Link
            href={ROUTES.HOME}
            className="hover:text-foreground transition-colors"
          >
            Home
          </Link>
          {pathname !== ROUTES.HOME && (
            <>
              <ChevronRight className="h-3 w-3" />
              <span className="text-foreground font-medium">
                {pathname.includes("cadastros")
                  ? "Usuarios"
                  : pathname.includes("grupos")
                    ? "Grupos"
                    : "Arquivos"}
              </span>
            </>
          )}
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 min-h-0">{children}</main>
    </div>
  )
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthProvider>
      <HomeLayoutContent>{children}</HomeLayoutContent>
    </AuthProvider>
  )
}
