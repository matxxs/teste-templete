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
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim() || !senha.trim()) {
      toast.error("Preencha todos os campos")
      return
    }

    setIsLoading(true)
    try {
      const response = await authService.login(email, senha)
      authService.setToken(response.access_token)
      toast.success("Login realizado com sucesso")
      router.replace(ROUTES.HOME)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Erro ao fazer login")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Bem-vindo de volta
        </h1>
        <p className="text-sm text-muted-foreground mt-2">
          Entre com suas credenciais para acessar o sistema
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-foreground block mb-1.5">
            Email
          </label>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
            autoComplete="email"
            disabled={isLoading}
            required
          />
        </div>

        <PasswordInput
          label="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          placeholder="Sua senha"
          autoComplete="current-password"
          disabled={isLoading}
          required
        />

        <Button
          type="submit"
          className="w-full cursor-pointer"
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
