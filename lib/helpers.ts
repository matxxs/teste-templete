export function decodeJwtPayload(token: string): { exp?: number; nivel_acesso?: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return {
      exp: payload.exp,
      nivel_acesso: payload.nivel_acesso ?? undefined,
    };
  } catch {
    return null;
  }
}


export function isTokenExpired(token: string): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return true;
  return payload.exp * 1000 < Date.now();
}


// Format bytes to human readable string
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`
}

// Format date to Brazilian format
export function formatDate(dateString: string | null): string {
  if (!dateString) return "---"
  const date = new Date(dateString)
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date)
}

// Format date to short Brazilian format
export function formatDateShort(dateString: string | null): string {
  if (!dateString) return "---"
  return new Date(dateString).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

// Check if user is admin
export function isAdmin(nivelAcesso: string | null | undefined): boolean {
  const nivel = (nivelAcesso || "").toUpperCase()
  return nivel === "MASTER" || nivel === "ADMINISTRADOR" || nivel === "ADMIN"
}

// Get badge variant based on action type
export function getActionBadgeVariant(
  action: string
): "default" | "secondary" | "destructive" | "outline" {
  const upperAction = action.toUpperCase()
  if (
    upperAction.includes("INSERT") ||
    upperAction.includes("CRIAR") ||
    upperAction.includes("NOVO")
  ) {
    return "default"
  }
  if (
    upperAction.includes("DELETE") ||
    upperAction.includes("EXCLUIR") ||
    upperAction.includes("REMOVER")
  ) {
    return "destructive"
  }
  if (
    upperAction.includes("UPDATE") ||
    upperAction.includes("EDITAR") ||
    upperAction.includes("ALTERAR")
  ) {
    return "secondary"
  }
  return "outline"
}

// Translate action to Portuguese
export function translateAction(action: string): string {
  const upperAction = action.toUpperCase()
  if (upperAction === "INSERT") return "CRIADO"
  if (upperAction === "UPDATE") return "EDITADO"
  if (upperAction === "DELETE") return "EXCLUIDO"
  return action
}
