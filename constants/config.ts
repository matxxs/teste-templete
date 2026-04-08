export const CONFIG = {
  API_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  DEFAULT_PAGE_SIZE: 10,
  AUDITORIA_PAGE_SIZE: 15,
} as const
