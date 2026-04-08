export const ROUTES = {
  LOGIN: "/",
  HOME: "/home",
  DASHBOARD: "/home/dashboard",
  CADASTROS: "/home/cadastros",
  GRUPOS: "/home/grupos",
} as const

export type RouteKey = keyof typeof ROUTES
