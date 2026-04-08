"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { PasswordInput } from "@/components/shared/password-input"
import { Spinner } from "@/components/ui/spinner"
import { authService } from "@/services/auth.service"
import { useRouter } from "next/navigation"
import { ROUTES } from "@/constants/routes"
import { toast } from "sonner"

export function LoginForm() {
  const [username, setUsername] = useState("")
  const [senha, setSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !senha.trim()) {
      toast.error("Preencha todos os campos")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.login(username, senha)
      authService.setToken(response.access_token)
      toast.success("Login realizado com sucesso")
      router.replace(ROUTES.DASHBOARD)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          Entre com seu nome de usuário para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-foreground block mb-2">
            Usuário
          </label>
          <Input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="seu_usuario"
            autoComplete="username"
            disabled={isLoading}
            required
            className="h-11 text-base"
          />
        </div>

        <PasswordInput
          label="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          disabled={isLoading}
          required
          className="h-11 text-base"
        />

        <Button
          type="submit"
          className="w-full cursor-pointer h-11 text-base font-semibold"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Spinner className="mr-2" />
              Entrando...
            </>
          ) : (
            "Entrar"
          )}
        </Button>
      </form>
    </div>
  )
}
