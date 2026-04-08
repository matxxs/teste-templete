export const ROUTES = {
  LOGIN: "/",
  HOME: "/home",
  CADASTROS: "/home/cadastros",
  GRUPOS: "/home/grupos",
} as const

export type RouteKey = keyof typeof ROUTES