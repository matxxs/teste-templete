"use client"

import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Users, 
  FileText, 
  FolderOpen, 
  Tags, 
  TrendingUp,
  Clock,
  Activity,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react"
import Link from "next/link"
import { ROUTES } from "@/constants/routes"
import { isAdmin } from "@/lib/helpers"
import { useCadastrosList } from "@/hooks/use-cadastros"
import { useGruposList } from "@/hooks/use-grupos"
import { useDriveList } from "@/hooks/use-drive"

// Mock data para atividades recentes
const mockAtividades = [
  {
    id: 1,
    usuario: "joao_silva",
    acao: "enviou",
    item: "Relatorio_Q1_2026.pdf",
    tempo: "2 horas atras",
    tipo: "upload",
  },
  {
    id: 2,
    usuario: "maria_santos",
    acao: "atualizou",
    item: "Planilha_Vendas.xlsx",
    tempo: "5 horas atras",
    tipo: "update",
  },
  {
    id: 3,
    usuario: "carlos_lima",
    acao: "criou grupo",
    item: "Financeiro",
    tempo: "1 dia atras",
    tipo: "create",
  },
  {
    id: 4,
    usuario: "ana_oliveira",
    acao: "baixou",
    item: "Contrato_Cliente.docx",
    tempo: "1 dia atras",
    tipo: "download",
  },
  {
    id: 5,
    usuario: "pedro_costa",
    acao: "criou pasta",
    item: "Projetos 2026",
    tempo: "2 dias atras",
    tipo: "create",
  },
]

export default function DashboardPage() {
  const { user } = useAuth()
  const admin = isAdmin(user?.nivel_acesso)

  // Buscar dados reais/mockados dos hooks
  const { data: cadastrosData } = useCadastrosList(1, undefined, admin)
  const { data: gruposData } = useGruposList()
  const { data: driveData } = useDriveList(null, {
    pesquisa: "",
    tipo: "",
    cadastro_id: "",
    grupo_id: "",
    modificado: "",
    modificado_apos: "",
    modificado_antes: "",
  })

  // Calcular estatísticas dos dados
  const totalUsuarios = cadastrosData?.total || 0
  const usuariosAtivos = cadastrosData?.items?.filter((u) => u.ativo).length || 0
  const totalGrupos = gruposData?.length || 0
  const totalArquivos = driveData?.items?.filter((i) => i.tipo === "arquivo").length || 0
  const totalPastas = driveData?.items?.filter((i) => i.tipo === "pasta").length || 0

  const getAtividadeIcon = (tipo: string) => {
    switch (tipo) {
      case "upload":
        return <ArrowUpRight className="h-4 w-4 text-green-500" />
      case "download":
        return <ArrowDownRight className="h-4 w-4 text-blue-500" />
      case "update":
        return <Activity className="h-4 w-4 text-amber-500" />
      case "create":
        return <FolderOpen className="h-4 w-4 text-primary" />
      default:
        return <FileText className="h-4 w-4 text-muted-foreground" />
    }
  }

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Cabecalho de boas-vindas */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Bem-vindo, {user?.nome?.split(" ")[0] || "Usuario"}
        </h1>
        <p className="text-muted-foreground leading-relaxed">
          Aqui esta um resumo das atividades do DocManager
        </p>
      </div>

      {/* Cards de estatisticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Arquivos
            </CardTitle>
            <FileText className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalArquivos}</div>
            <div className="flex items-center gap-1 mt-1">
              <span className="text-xs text-green-600 dark:text-green-500 font-medium flex items-center gap-0.5">
                <TrendingUp className="h-3 w-3" />
                +15%
              </span>
              <span className="text-xs text-muted-foreground">vs. mes passado</span>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Pastas
            </CardTitle>
            <FolderOpen className="h-5 w-5 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalPastas}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Organizando seus documentos
            </p>
          </CardContent>
        </Card>

        {admin && (
          <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Usuarios
              </CardTitle>
              <Users className="h-5 w-5 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{totalUsuarios}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {usuariosAtivos} ativos no sistema
              </p>
            </CardContent>
          </Card>
        )}

        <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Grupos
            </CardTitle>
            <Tags className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{totalGrupos}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Organizando seus arquivos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Secao de atividades e atalhos */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Atividades recentes */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Atividades Recentes
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-4">
              {mockAtividades.map((atividade) => (
                <div
                  key={atividade.id}
                  className="flex items-start gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted">
                    {getAtividadeIcon(atividade.tipo)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">
                      <span className="font-semibold">@{atividade.usuario}</span>{" "}
                      <span className="text-muted-foreground">{atividade.acao}</span>{" "}
                      <span className="font-medium">{atividade.item}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {atividade.tempo}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Atalhos rapidos */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg font-semibold">Acesso Rapido</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              <Link
                href={ROUTES.HOME}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <FileText className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Arquivos</p>
                  <p className="text-xs text-muted-foreground">Gerenciar documentos</p>
                </div>
              </Link>

              {admin && (
                <Link
                  href={ROUTES.CADASTROS}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                    <Users className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Usuarios</p>
                    <p className="text-xs text-muted-foreground">Gerenciar acessos</p>
                  </div>
                </Link>
              )}

              <Link
                href={ROUTES.GRUPOS}
                className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors group"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors">
                  <Tags className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Grupos</p>
                  <p className="text-xs text-muted-foreground">Organizar categorias</p>
                </div>
              </Link>
            </div>

            {/* Storage info */}
            <div className="mt-6 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-muted-foreground">Armazenamento</span>
                <span className="font-medium text-foreground">
                  2.4 GB / 10 GB
                </span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: "24%" }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                24% do espaco utilizado
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
