"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Check, Loader as Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface UsernameSuggestionsProps {
  nome: string
  email: string
  onSelect: (username: string) => void
  selectedUsername: string
}

function generateSuggestions(nome: string, email: string): string[] {
  const suggestions: string[] = []

  const nomeClean = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s]/g, "")
    .trim()

  const emailUser = email.split("@")[0]?.toLowerCase() || ""

  const parts = nomeClean.split(/\s+/)
  const firstName = parts[0] || ""
  const lastName = parts[parts.length - 1] || ""

  if (firstName) {
    suggestions.push(firstName + "_" + lastName)
    suggestions.push(firstName + lastName)
    suggestions.push(firstName + Math.floor(Math.random() * 999 + 1))
  }

  if (emailUser) {
    suggestions.push(emailUser)
    suggestions.push(emailUser + Math.floor(Math.random() * 99 + 1))
  }

  return suggestions.filter((s) => s && s.length >= 3).slice(0, 5)
}

export function UsernameSuggestions({
  nome,
  email,
  onSelect,
  selectedUsername,
}: UsernameSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [checking, setChecking] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (nome || email) {
      const generated = generateSuggestions(nome, email)
      setSuggestions(generated)
    } else {
      setSuggestions([])
    }
  }, [nome, email])

  const handleSelect = async (username: string) => {
    setChecking((prev) => ({ ...prev, [username]: true }))

    await new Promise((resolve) => setTimeout(resolve, 300))

    setChecking((prev) => ({ ...prev, [username]: false }))
    onSelect(username)
  }

  if (suggestions.length === 0) return null

  return (
    <div className="space-y-2">
      <p className="text-xs font-medium text-muted-foreground">
        Sugestões de usuário:
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Button
            key={suggestion}
            type="button"
            variant={selectedUsername === suggestion ? "default" : "outline"}
            size="sm"
            onClick={() => handleSelect(suggestion)}
            disabled={checking[suggestion]}
            className={cn(
              "h-8 text-xs font-medium transition-all",
              selectedUsername === suggestion && "ring-2 ring-primary/20"
            )}
          >
            {checking[suggestion] ? (
              <>
                <Loader2 className="h-3 w-3 mr-1.5 animate-spin" />
                Verificando...
              </>
            ) : (
              <>
                {selectedUsername === suggestion && (
                  <Check className="h-3 w-3 mr-1.5" />
                )}
                {suggestion}
              </>
            )}
          </Button>
        ))}
      </div>
    </div>
  )
}
