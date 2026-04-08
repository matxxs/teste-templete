export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    ME: "/api/auth/me",
  },
  DRIVE: {
    LIST: "/api/drive",
    PASTAS: "/api/drive/pastas",
    UPLOAD: "/api/drive/upload",
    DOWNLOAD: (id: string) => `/api/drive/${id}/download`,
    DELETE: (id: string) => `/api/drive/${id}`,
  },
  CADASTROS: {
    LIST: "/api/cadastros",
    DETAIL: (id: string) => `/api/cadastros/${id}`,
    AUDITORIA: "/api/auditoria/cadastros",
  },
  GRUPOS: {
    LIST: "/api/grupos",
    DETAIL: (id: string) => `/api/grupos/${id}`,
    AUDITORIA: "/api/auditoria/grupos",
  },
  AUDITORIA: {
    ITENS_DRIVE: "/api/auditoria/itens-drive",
    CADASTROS: "/api/auditoria/cadastros",
    GRUPOS: "/api/auditoria/grupos",
  },
} as const
