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
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  const fetchUser = useCallback(async () => {
    const token = authService.getToken()
    const isLoginPage = pathname === ROUTES.LOGIN
    
    if (!token) {
      if (!isLoginPage) {
        router.replace("/error/403") 
      }
      setLoading(false)
      return
    }

    if (isTokenExpired(token)) {
      authService.logout()
      router.replace("/error/401") 
      setLoading(false)
      return
    }

    try {
      const userData = await authService.getMe()
      setUser(userData)
      setError(null)
    } catch (err: any) {
      authService.logout()
      setUser(null)
      
      const status = err.status || 500
      router.replace(`/error/${status}`)
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUser()
  }, [fetchUser])

  const login = async (email: string, senha: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await authService.login(email, senha)
      authService.setToken(response.access_token)
      const userData = await authService.getMe()
      setUser(userData)
      router.replace(ROUTES.HOME)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao fazer login")
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    router.replace(ROUTES.LOGIN)
  }, [router])

  const isPublicRoute = pathname === ROUTES.LOGIN

  return (
    <AuthContext.Provider value={{ user, loading, logout }}>
      {loading ? (
        <div className="flex h-screen w-full items-center justify-center bg-background">
           {/* Spinner de carregamento aqui */}
           <p className="text-sm text-muted-foreground">Verificando acesso...</p>
        </div>
      ) : (
        (!user && !isPublicRoute) ? null : children
      )}
    </AuthContext.Provider>
  )

  // return (
  //   <AuthContext.Provider value={{ user, loading, error, login, logout }}>
  //     {children}
  //   </AuthContext.Provider>
  // )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}