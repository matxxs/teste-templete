// Auth types
export interface User {
  usuario_id: number
  cadastro_id: number | null
  nome: string
  email: string | null
  nivel_acesso: string
}

export interface LoginCredentials {
  login: string
  senha: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
}

// Drive types
export interface ItemDrive {
  id: string
  parent_id: string | null
  nome: string
  tipo: "pasta" | "arquivo"
  path_disco: string
  cadastro_id: number
  usuario_sessao: string | null
  proprietario_nome: string | null
  grupo_id: string | null
  grupo_cor: string | null
  grupo_nome: string | null
  tamanho: number | null
  mime_type: string | null
  data_criacao: string | null
  data_modificacao: string | null
}

export interface BreadcrumbItem extends ItemDrive {}

export interface DriveListResponse {
  items: ItemDrive[]
  breadcrumb: BreadcrumbItem[]
}

export interface DriveFilters {
  pesquisa: string
  tipo: "" | "pasta" | "arquivo"
  cadastro_id: string
  grupo_id: string
  modificado: string
  modificado_apos: string
  modificado_antes: string
}

export interface ItemDriveAuditoria {
  AUD_ID: number
  ITEM_ID: string
  ACAO: string
  USUARIO_SESSAO: string | null
  DADOS_ANTIGOS: Record<string, unknown> | null
  DADOS_NOVOS: Record<string, unknown> | null
  DATA_AUDITORIA: string
}

// Cadastros types
export interface CadastroItem {
  CADASTRO_ID: number
  NOME: string
  EMAIL: string | null
  NIVEL_ACESSO: string
  ATIVO: string
  DATA_CRIACAO: string | null
}

export interface CadastroForm {
  NOME: string
  EMAIL: string
  NIVEL_ACESSO: string
  ATIVO: string
  senha: string
}

export interface CadastroAuditoriaItem {
  AUD_ID: number
  CADASTRO_ID: number
  NOME: string
  EMAIL: string | null
  ATIVO: string
  USUARIO_SESSAO: string | null
  ACAO: string
  DATA_AUDITORIA: string | null
}

// Grupos types
export interface Grupo {
  id: string
  nome: string
  descricao: string | null;
  cor_tag: string | null;
  data_criacao?: string;
  data_alteracao?: string | null;
}

export interface GrupoForm {
  nome: string
  cor: string | null
  descricao: string
}

// API types
export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  page_size: number
  pages: number
}

export interface ApiError {
  detail: string
  status?: number
}

export interface PageError {
  title: string
  message: string
  status?: number
}