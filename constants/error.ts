import type { PageError } from "@/interfaces"

export const PAGE_ERROR_MESSAGES: Record<string, { title: string; message: string }> = {
  "401": { 
    title: "Nao autorizado", 
    message: "Sua sessao expirou ou voce nao esta autenticado. Por favor, faca login novamente." 
  },
  "403": { 
    title: "Acesso negado", 
    message: "Voce nao tem permissao para acessar esta pagina. Verifique suas credenciais ou entre em contato com o administrador do sistema." 
  },
  "404": { 
    title: "Pagina nao encontrada", 
    message: "Desculpe, a pagina que voce esta procurando nao existe ou foi movida. Aqui estao alguns links uteis:" 
  },
  "500": { 
    title: "Erro interno do servidor", 
    message: "Ocorreu um erro inesperado. Nossa equipe foi notificada e esta trabalhando para resolver o problema." 
  },
}

export function getPageErrorMessage(error: PageError): string {
  if (error.status && PAGE_ERROR_MESSAGES[error.status.toString()]) {
    return `${PAGE_ERROR_MESSAGES[error.status.toString()].title}: ${PAGE_ERROR_MESSAGES[error.status.toString()].message}`
  }
  return error.message || "Ocorreu um erro desconhecido."
}

export function getPageErrorConfig(status: number | string): { title: string; message: string } {
  const statusStr = status.toString()
  return PAGE_ERROR_MESSAGES[statusStr] || {
    title: `Erro ${status}`,
    message: "Ocorreu um erro inesperado. Por favor, tente novamente."
  }
}
