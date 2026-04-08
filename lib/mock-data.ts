import type {
  CadastroItem,
  CadastroAuditoriaItem,
  Grupo,
  ItemDrive,
  ItemDriveAuditoria,
  DriveListResponse,
  PaginatedResponse,
} from "@/interfaces"

// Dados mockados de usuários
export const mockCadastros: CadastroItem[] = [
  {
    usuario_id: "1",
    username: "admin",
    nome: "Administrador do Sistema",
    email: "admin@empresa.com",
    nivel_acesso: "MASTER",
    ativo: true,
    data_criacao: "2024-01-15T10:00:00Z",
  },
  {
    usuario_id: "2",
    username: "joao_silva",
    nome: "Joao Silva",
    email: "joao.silva@empresa.com",
    nivel_acesso: "ADMINISTRADOR",
    ativo: true,
    data_criacao: "2024-02-20T14:30:00Z",
  },
  {
    usuario_id: "3",
    username: "maria_santos",
    nome: "Maria Santos",
    email: "maria.santos@empresa.com",
    nivel_acesso: "USUARIO",
    ativo: true,
    data_criacao: "2024-03-10T09:15:00Z",
  },
  {
    usuario_id: "4",
    username: "carlos_oliveira",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@empresa.com",
    nivel_acesso: "USUARIO",
    ativo: true,
    data_criacao: "2024-03-25T11:45:00Z",
  },
  {
    usuario_id: "5",
    username: "ana_costa",
    nome: "Ana Costa",
    email: "ana.costa@empresa.com",
    nivel_acesso: "USUARIO",
    ativo: false,
    data_criacao: "2024-04-05T16:20:00Z",
  },
  {
    usuario_id: "6",
    username: "pedro_lima",
    nome: "Pedro Lima",
    email: "pedro.lima@empresa.com",
    nivel_acesso: "ADMINISTRADOR",
    ativo: true,
    data_criacao: "2024-04-18T08:00:00Z",
  },
]

// Dados mockados de grupos
export const mockGrupos: Grupo[] = [
  {
    id: "g1",
    nome: "Financeiro",
    descricao: "Documentos financeiros e contabeis",
    cor_tag: "#22C55E",
    data_criacao: "2024-01-10T10:00:00Z",
    data_alteracao: null,
  },
  {
    id: "g2",
    nome: "Recursos Humanos",
    descricao: "Documentos de RH e contratos",
    cor_tag: "#3B82F6",
    data_criacao: "2024-01-15T14:30:00Z",
    data_alteracao: null,
  },
  {
    id: "g3",
    nome: "Marketing",
    descricao: "Materiais de marketing e campanhas",
    cor_tag: "#F97316",
    data_criacao: "2024-02-01T09:00:00Z",
    data_alteracao: null,
  },
  {
    id: "g4",
    nome: "Projetos",
    descricao: "Documentacao de projetos ativos",
    cor_tag: "#8B5CF6",
    data_criacao: "2024-02-20T11:00:00Z",
    data_alteracao: null,
  },
  {
    id: "g5",
    nome: "Juridico",
    descricao: "Contratos e documentos legais",
    cor_tag: "#EF4444",
    data_criacao: "2024-03-05T15:45:00Z",
    data_alteracao: null,
  },
]

// Dados mockados de arquivos/pastas
export const mockDriveItems: ItemDrive[] = [
  {
    id: "d1",
    parent_id: null,
    nome: "Documentos Financeiros",
    tipo: "pasta",
    path_disco: "/documentos-financeiros",
    usuario_id: "1",
    usuario_sessao: "admin",
    proprietario_nome: "Administrador do Sistema",
    grupo_id: "g1",
    grupo_cor: "#22C55E",
    grupo_nome: "Financeiro",
    tamanho: null,
    mime_type: null,
    data_criacao: "2024-01-20T10:00:00Z",
    data_modificacao: "2024-04-01T14:30:00Z",
  },
  {
    id: "d2",
    parent_id: null,
    nome: "Relatorios 2024",
    tipo: "pasta",
    path_disco: "/relatorios-2024",
    usuario_id: "2",
    usuario_sessao: "joao_silva",
    proprietario_nome: "Joao Silva",
    grupo_id: "g4",
    grupo_cor: "#8B5CF6",
    grupo_nome: "Projetos",
    tamanho: null,
    mime_type: null,
    data_criacao: "2024-02-15T09:00:00Z",
    data_modificacao: "2024-03-28T16:45:00Z",
  },
  {
    id: "d3",
    parent_id: null,
    nome: "Contratos",
    tipo: "pasta",
    path_disco: "/contratos",
    usuario_id: "1",
    usuario_sessao: "admin",
    proprietario_nome: "Administrador do Sistema",
    grupo_id: "g5",
    grupo_cor: "#EF4444",
    grupo_nome: "Juridico",
    tamanho: null,
    mime_type: null,
    data_criacao: "2024-01-25T11:30:00Z",
    data_modificacao: "2024-04-02T10:15:00Z",
  },
  {
    id: "d4",
    parent_id: null,
    nome: "Apresentacao_Q1_2024.pptx",
    tipo: "arquivo",
    path_disco: "/apresentacao-q1-2024.pptx",
    usuario_id: "3",
    usuario_sessao: "maria_santos",
    proprietario_nome: "Maria Santos",
    grupo_id: "g3",
    grupo_cor: "#F97316",
    grupo_nome: "Marketing",
    tamanho: 2458624,
    mime_type: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    data_criacao: "2024-03-15T14:00:00Z",
    data_modificacao: "2024-03-20T09:30:00Z",
  },
  {
    id: "d5",
    parent_id: null,
    nome: "Planilha_Orcamento.xlsx",
    tipo: "arquivo",
    path_disco: "/planilha-orcamento.xlsx",
    usuario_id: "2",
    usuario_sessao: "joao_silva",
    proprietario_nome: "Joao Silva",
    grupo_id: "g1",
    grupo_cor: "#22C55E",
    grupo_nome: "Financeiro",
    tamanho: 524288,
    mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    data_criacao: "2024-02-28T16:20:00Z",
    data_modificacao: "2024-04-05T11:00:00Z",
  },
  {
    id: "d6",
    parent_id: null,
    nome: "Manual_Funcionario.pdf",
    tipo: "arquivo",
    path_disco: "/manual-funcionario.pdf",
    usuario_id: "6",
    usuario_sessao: "pedro_lima",
    proprietario_nome: "Pedro Lima",
    grupo_id: "g2",
    grupo_cor: "#3B82F6",
    grupo_nome: "Recursos Humanos",
    tamanho: 1048576,
    mime_type: "application/pdf",
    data_criacao: "2024-04-10T08:45:00Z",
    data_modificacao: "2024-04-10T08:45:00Z",
  },
  {
    id: "d7",
    parent_id: "d1",
    nome: "Balanco_Mensal_Marco.xlsx",
    tipo: "arquivo",
    path_disco: "/documentos-financeiros/balanco-mensal-marco.xlsx",
    usuario_id: "2",
    usuario_sessao: "joao_silva",
    proprietario_nome: "Joao Silva",
    grupo_id: "g1",
    grupo_cor: "#22C55E",
    grupo_nome: "Financeiro",
    tamanho: 358400,
    mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    data_criacao: "2024-04-01T10:00:00Z",
    data_modificacao: "2024-04-01T14:30:00Z",
  },
  {
    id: "d8",
    parent_id: "d1",
    nome: "Notas_Fiscais",
    tipo: "pasta",
    path_disco: "/documentos-financeiros/notas-fiscais",
    usuario_id: "1",
    usuario_sessao: "admin",
    proprietario_nome: "Administrador do Sistema",
    grupo_id: "g1",
    grupo_cor: "#22C55E",
    grupo_nome: "Financeiro",
    tamanho: null,
    mime_type: null,
    data_criacao: "2024-02-01T09:00:00Z",
    data_modificacao: "2024-03-30T15:20:00Z",
  },
]

// Auditoria de cadastros mockada
export const mockCadastrosAuditoria: CadastroAuditoriaItem[] = [
  {
    aud_id: 1,
    usuario_id: "3",
    username: "maria_santos",
    nome: "Maria Santos",
    email: "maria.santos@empresa.com",
    ativo: true,
    acao: "INSERT",
    usuario_sessao: "admin",
    data_auditoria: "2024-03-10T09:15:00Z",
  },
  {
    aud_id: 2,
    usuario_id: "4",
    username: "carlos_oliveira",
    nome: "Carlos Oliveira",
    email: "carlos.oliveira@empresa.com",
    ativo: true,
    acao: "INSERT",
    usuario_sessao: "admin",
    data_auditoria: "2024-03-25T11:45:00Z",
  },
  {
    aud_id: 3,
    usuario_id: "5",
    username: "ana_costa",
    nome: "Ana Costa",
    email: "ana.costa@empresa.com",
    ativo: true,
    acao: "INSERT",
    usuario_sessao: "joao_silva",
    data_auditoria: "2024-04-05T16:20:00Z",
  },
  {
    aud_id: 4,
    usuario_id: "5",
    username: "ana_costa",
    nome: "Ana Costa",
    email: "ana.costa@empresa.com",
    ativo: false,
    acao: "UPDATE",
    usuario_sessao: "admin",
    data_auditoria: "2024-04-08T10:30:00Z",
  },
  {
    aud_id: 5,
    usuario_id: "6",
    username: "pedro_lima",
    nome: "Pedro Lima",
    email: "pedro.lima@empresa.com",
    ativo: true,
    acao: "INSERT",
    usuario_sessao: "admin",
    data_auditoria: "2024-04-18T08:00:00Z",
  },
]

// Auditoria de arquivos mockada
export const mockDriveAuditoria: ItemDriveAuditoria[] = [
  {
    aud_id: 1,
    item_id: "d1",
    acao: "INSERT",
    usuario_sessao: "admin",
    dados_antigos: null,
    dados_novos: { nome: "Documentos Financeiros", tipo: "pasta" },
    data_auditoria: "2024-01-20T10:00:00Z",
  },
  {
    aud_id: 2,
    item_id: "d4",
    acao: "INSERT",
    usuario_sessao: "maria_santos",
    dados_antigos: null,
    dados_novos: { nome: "Apresentacao_Q1_2024.pptx", tipo: "arquivo" },
    data_auditoria: "2024-03-15T14:00:00Z",
  },
  {
    aud_id: 3,
    item_id: "d5",
    acao: "UPDATE",
    usuario_sessao: "joao_silva",
    dados_antigos: { nome: "Orcamento_2024.xlsx" },
    dados_novos: { nome: "Planilha_Orcamento.xlsx" },
    data_auditoria: "2024-04-05T11:00:00Z",
  },
  {
    aud_id: 4,
    item_id: "d6",
    acao: "INSERT",
    usuario_sessao: "pedro_lima",
    dados_antigos: null,
    dados_novos: { nome: "Manual_Funcionario.pdf", tipo: "arquivo" },
    data_auditoria: "2024-04-10T08:45:00Z",
  },
  {
    aud_id: 5,
    item_id: "d7",
    acao: "INSERT",
    usuario_sessao: "joao_silva",
    dados_antigos: null,
    dados_novos: { nome: "Balanco_Mensal_Marco.xlsx", tipo: "arquivo" },
    data_auditoria: "2024-04-01T10:00:00Z",
  },
]

// Auditoria de grupos mockada
export interface GrupoAuditoriaItem {
  aud_id: number
  grupo_id: string
  nome: string
  descricao: string | null
  cor_tag: string | null
  acao: string
  usuario_sessao: string | null
  data_auditoria: string
}

export const mockGruposAuditoria: GrupoAuditoriaItem[] = [
  {
    aud_id: 1,
    grupo_id: "g1",
    nome: "Financeiro",
    descricao: "Documentos financeiros e contabeis",
    cor_tag: "#22C55E",
    acao: "INSERT",
    usuario_sessao: "admin",
    data_auditoria: "2024-01-10T10:00:00Z",
  },
  {
    aud_id: 2,
    grupo_id: "g2",
    nome: "Recursos Humanos",
    descricao: "Documentos de RH e contratos",
    cor_tag: "#3B82F6",
    acao: "INSERT",
    usuario_sessao: "admin",
    data_auditoria: "2024-01-15T14:30:00Z",
  },
  {
    aud_id: 3,
    grupo_id: "g3",
    nome: "Marketing",
    descricao: "Materiais de marketing e campanhas",
    cor_tag: "#F97316",
    acao: "INSERT",
    usuario_sessao: "joao_silva",
    data_auditoria: "2024-02-01T09:00:00Z",
  },
  {
    aud_id: 4,
    grupo_id: "g4",
    nome: "Projetos",
    descricao: "Documentacao de projetos ativos",
    cor_tag: "#8B5CF6",
    acao: "INSERT",
    usuario_sessao: "admin",
    data_auditoria: "2024-02-20T11:00:00Z",
  },
  {
    aud_id: 5,
    grupo_id: "g5",
    nome: "Juridico",
    descricao: "Contratos e documentos legais",
    cor_tag: "#EF4444",
    acao: "INSERT",
    usuario_sessao: "pedro_lima",
    data_auditoria: "2024-03-05T15:45:00Z",
  },
]

// Funções helper para simular paginação
export function paginateData<T>(
  items: T[],
  page: number,
  pageSize: number
): PaginatedResponse<T> {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  const paginatedItems = items.slice(start, end)
  
  return {
    items: paginatedItems,
    total: items.length,
    page,
    page_size: pageSize,
    pages: Math.ceil(items.length / pageSize),
  }
}

export function getMockDriveList(parentId: string | null): DriveListResponse {
  const items = mockDriveItems.filter((item) => item.parent_id === parentId)
  
  const breadcrumb: ItemDrive[] = []
  if (parentId) {
    let currentId: string | null = parentId
    while (currentId) {
      const item = mockDriveItems.find((i) => i.id === currentId)
      if (item) {
        breadcrumb.unshift(item)
        currentId = item.parent_id
      } else {
        break
      }
    }
  }
  
  return { items, breadcrumb }
}

// Flag para habilitar/desabilitar modo mock
export const USE_MOCK_DATA = true
