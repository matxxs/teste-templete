"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import { useRouter, usePathname } from "next/navigation"
import { authService } from "@/services/auth.service"
import { isTokenExpired } from "@/lib/helpers"
import { ROUTES } from "@/constants/routes"
import type { User } from "@/interfaces"

interface AuthContextType {
  user: User | null
  loading: boolean
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUser = useCallback(async () => {
    try {
      const token = authService.getToken()
      const isLoginPage = pathname === ROUTES.LOGIN

      //      if (!token) {
      //        setUser(null)
      //        if (!isLoginPage) {
      //          router.replace(ROUTES.LOGIN)
      //        }
      //        setLoading(false)
      //        return
      //      }
      //
      //      if (isTokenExpired(token)) {
      //        authService.logout()
      //        setUser(null)
      //        router.replace(ROUTES.LOGIN)
      //        setLoading(false)
      //        return
      //      }

      try {
        const userData = await authService.getMe()
        setUser(userData)
      } catch (err: any) {
        console.error("[v0] Erro ao buscar usuário:", err)
        authService.logout()
        setUser(null)
        router.replace(ROUTES.LOGIN)
      }
    } finally {
      setLoading(false)
    }
  }, [router, pathname])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    router.replace(ROUTES.LOGIN)
  }, [router])

  const isLoginPage = pathname === ROUTES.LOGIN
  const isHomePage = pathname === ROUTES.HOME || pathname === ROUTES.DASHBOARD

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {loading && !isLoginPage ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
