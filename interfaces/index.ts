// Auth types
export interface User {
  usuario_id: string
  username: string
  nome: string
  email: string
  nivel_acesso: string
  ativo: boolean
}

export interface LoginCredentials {
  username: string
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
  usuario_id: string
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
  aud_id: number
  item_id: string
  acao: string
  usuario_sessao: string | null
  dados_antigos: Record<string, unknown> | null
  dados_novos: Record<string, unknown> | null
  data_auditoria: string
}

// Cadastros types
export interface CadastroItem {
  usuario_id: string
  username: string
  nome: string
  email: string
  nivel_acesso: string
  ativo: boolean
  data_criacao: string | null
}

export interface CadastroForm {
  username: string
  nome: string
  email: string
  nivel_acesso: string
  ativo: boolean
  senha: string
}

export interface UsernameSuggestion {
  value: string
  available: boolean
}

export interface CadastroAuditoriaItem {
  aud_id: number
  usuario_id: string
  username: string
  nome: string
  email: string
  ativo: boolean
  acao: string
  usuario_sessao: string | null
  data_auditoria: string | null
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