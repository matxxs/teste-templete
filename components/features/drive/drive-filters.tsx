"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ChevronDown, X, FolderPlus, Upload } from "lucide-react"
import type { DriveFilters, Grupo, CadastroItem } from "@/interfaces"
import { isAdmin as checkIsAdmin } from "@/lib/helpers"

interface DriveFiltersProps {
  filtros: DriveFilters
  setFiltros: React.Dispatch<React.SetStateAction<DriveFilters>>
  grupos: Grupo[]
  cadastros: CadastroItem[]
  userNivelAcesso: string | null | undefined
  userCadastroId: string | null | undefined
  userName: string | undefined
  pessoaLabel: string
  setPessoaLabel: (label: string) => void
  buscaPessoa: string
  setBuscaPessoa: (busca: string) => void
  buscaGrupo: string
  setBuscaGrupo: (busca: string) => void
  onSearch: () => void
  onNovaPasta: () => void
  onUpload: () => void
}

type DropdownFiltro = "tipo" | "modificado" | "pessoa" | "grupo" | null

export function DriveFiltersComponent({
  filtros,
  setFiltros,
  grupos,
  cadastros,
  userNivelAcesso,
  userCadastroId,
  userName,
  pessoaLabel,
  setPessoaLabel,
  buscaPessoa,
  setBuscaPessoa,
  buscaGrupo,
  setBuscaGrupo,
  onSearch,
  onNovaPasta,
  onUpload,
}: DriveFiltersProps) {
  const [dropdownAberto, setDropdownAberto] = useState<DropdownFiltro>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const isAdminUser = checkIsAdmin(userNivelAcesso)

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (
        dropdownAberto != null &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownAberto(null)
      }
    }
    document.addEventListener("mousedown", onMouseDown)
    return () => document.removeEventListener("mousedown", onMouseDown)
  }, [dropdownAberto])

  const removerFiltroTipo = () => {
    setFiltros((f) => ({ ...f, tipo: "" }))
    setDropdownAberto(null)
  }

  const removerFiltroPessoa = () => {
    setFiltros((f) => ({ ...f, cadastro_id: "" }))
    setPessoaLabel("")
    setDropdownAberto(null)
  }

  const removerFiltroGrupo = () => {
    setFiltros((f) => ({ ...f, grupo_id: "" }))
    setDropdownAberto(null)
  }

  const removerFiltroModificado = () => {
    setFiltros((f) => ({
      ...f,
      modificado: "",
      modificado_apos: "",
      modificado_antes: "",
    }))
    setDropdownAberto(null)
  }

  const modificadoLabel = () => {
    if (filtros.modificado_apos || filtros.modificado_antes)
      return "Periodo personalizado"
    if (filtros.modificado === "hoje") return "Hoje"
    if (filtros.modificado === "7") return "Ultimos sete dias"
    if (filtros.modificado === "30") return "Ultimos 30 dias"
    return null
  }

  const gruposFiltrados = grupos.filter((g) =>
    buscaGrupo.trim()
      ? g.nome.toLowerCase().includes(buscaGrupo.toLowerCase())
      : true
  )
  const gruposExibir = gruposFiltrados.slice(0, 5)
  const cadastrosExibir = cadastros.slice(0, 5)
  const pessoaOpcoes =
    !isAdminUser && userCadastroId != null
      ? [{ usuario_id: userCadastroId, username: userName || "Eu", nome: userName || "Eu", email: "", nivel_acesso: "", ativo: true, data_criacao: null }].filter(
          (c) =>
            !buscaPessoa.trim() ||
            c.nome.toLowerCase().includes(buscaPessoa.trim().toLowerCase())
        )
      : cadastrosExibir

  return (
    <div className="flex flex-wrap items-center gap-2" ref={dropdownRef}>
      {/* Tipo filter */}
      <div className="relative">
        {filtros.tipo ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-sm font-medium text-primary">
            {filtros.tipo === "pasta" ? "Pastas" : "Arquivos"}
            <button
              type="button"
              onClick={removerFiltroTipo}
              className="rounded p-0.5 hover:bg-primary/20 cursor-pointer"
              aria-label="Remover filtro tipo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                setDropdownAberto(dropdownAberto === "tipo" ? null : "tipo")
              }
              className="flex items-center gap-1 rounded-md border border-input bg-card px-2.5 py-1.5 text-sm text-foreground hover:bg-muted/50 cursor-pointer"
            >
              Tipo
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {dropdownAberto === "tipo" && (
              <div className="absolute left-0 top-full z-30 mt-1 min-w-[160px] rounded-lg border bg-card shadow-lg py-1">
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setFiltros((f) => ({ ...f, tipo: "pasta" }))
                    setDropdownAberto(null)
                  }}
                >
                  Pastas
                </button>
                <button
                  type="button"
                  className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 cursor-pointer"
                  onClick={() => {
                    setFiltros((f) => ({ ...f, tipo: "arquivo" }))
                    setDropdownAberto(null)
                  }}
                >
                  Arquivos
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Pessoa filter */}
      <div className="relative">
        {filtros.cadastro_id ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-sm font-medium text-primary">
            {pessoaLabel ||
              (userCadastroId === Number(filtros.cadastro_id)
                ? userName || "Eu"
                : "Pessoa")}
            <button
              type="button"
              onClick={removerFiltroPessoa}
              className="rounded p-0.5 hover:bg-primary/20 cursor-pointer"
              aria-label="Remover filtro pessoa"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                setDropdownAberto(dropdownAberto === "pessoa" ? null : "pessoa")
              }
              className="flex items-center gap-1 rounded-md border border-input bg-card px-2.5 py-1.5 text-sm text-foreground hover:bg-muted/50 cursor-pointer"
            >
              Pessoa
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {dropdownAberto === "pessoa" && (
              <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-lg border bg-card shadow-lg p-2">
                <Input
                  placeholder="Pesquisar pessoa..."
                  value={buscaPessoa}
                  onChange={(e) => setBuscaPessoa(e.target.value)}
                  className="mb-2 h-8 text-sm"
                />
                <div className="max-h-48 overflow-y-auto">
                  {pessoaOpcoes.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-muted-foreground">
                      Nenhum resultado
                    </p>
                  ) : (
                    pessoaOpcoes.map((c) => (
                      <button
                        key={c.usuario_id}
                        type="button"
                        className="w-full px-2 py-2 text-left text-sm hover:bg-muted/50 rounded cursor-pointer"
                        onClick={() => {
                          setFiltros((f) => ({
                            ...f,
                            cadastro_id: String(c.usuario_id),
                          }))
                          setPessoaLabel(c.nome)
                          setDropdownAberto(null)
                        }}
                      >
                        {c.nome}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Grupo filter */}
      <div className="relative">
        {filtros.grupo_id ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-sm font-medium text-primary">
            {grupos.find((g) => g.id === filtros.grupo_id)?.nome ?? "Grupo"}
            <button
              type="button"
              onClick={removerFiltroGrupo}
              className="rounded p-0.5 hover:bg-primary/20 cursor-pointer"
              aria-label="Remover filtro grupo"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                setDropdownAberto(dropdownAberto === "grupo" ? null : "grupo")
              }
              className="flex items-center gap-1 rounded-md border border-input bg-card px-2.5 py-1.5 text-sm text-foreground hover:bg-muted/50 cursor-pointer"
            >
              Grupo
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {dropdownAberto === "grupo" && (
              <div className="absolute left-0 top-full z-30 mt-1 w-64 rounded-lg border bg-card shadow-lg p-2">
                <Input
                  placeholder="Pesquisar grupo..."
                  value={buscaGrupo}
                  onChange={(e) => setBuscaGrupo(e.target.value)}
                  className="mb-2 h-8 text-sm"
                />
                <div className="max-h-48 overflow-y-auto">
                  {gruposExibir.length === 0 ? (
                    <p className="px-2 py-3 text-xs text-muted-foreground">
                      Nenhum grupo
                    </p>
                  ) : (
                    gruposExibir.map((g) => (
                      <button
                        key={g.id}
                        type="button"
                        className="w-full px-2 py-2 text-left text-sm hover:bg-muted/50 rounded cursor-pointer"
                        onClick={() => {
                          setFiltros((f) => ({ ...f, grupo_id: g.id }))
                          setDropdownAberto(null)
                        }}
                      >
                        {g.nome}
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Modificado filter */}
      <div className="relative">
        {filtros.modificado ||
        filtros.modificado_apos ||
        filtros.modificado_antes ? (
          <span className="inline-flex items-center gap-1.5 rounded-md border border-primary/30 bg-primary/10 px-2.5 py-1.5 text-sm font-medium text-primary">
            {modificadoLabel() ?? "Modificado"}
            <button
              type="button"
              onClick={removerFiltroModificado}
              className="rounded p-0.5 hover:bg-primary/20 cursor-pointer"
              aria-label="Remover filtro data"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </span>
        ) : (
          <>
            <button
              type="button"
              onClick={() =>
                setDropdownAberto(
                  dropdownAberto === "modificado" ? null : "modificado"
                )
              }
              className="flex items-center gap-1 rounded-md border border-input bg-card px-2.5 py-1.5 text-sm text-foreground hover:bg-muted/50 cursor-pointer"
            >
              Modificado
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </button>
            {dropdownAberto === "modificado" && (
              <div className="absolute left-0 top-full z-30 mt-1 w-80 rounded-lg border bg-card shadow-lg p-3">
                <div className="space-y-2 mb-3">
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 rounded cursor-pointer"
                    onClick={() => {
                      setFiltros((f) => ({
                        ...f,
                        modificado: "hoje",
                        modificado_apos: "",
                        modificado_antes: "",
                      }))
                      setDropdownAberto(null)
                    }}
                  >
                    Hoje
                  </button>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 rounded cursor-pointer"
                    onClick={() => {
                      setFiltros((f) => ({
                        ...f,
                        modificado: "7",
                        modificado_apos: "",
                        modificado_antes: "",
                      }))
                      setDropdownAberto(null)
                    }}
                  >
                    Ultimos sete dias
                  </button>
                  <button
                    type="button"
                    className="w-full px-3 py-2 text-left text-sm hover:bg-muted/50 rounded cursor-pointer"
                    onClick={() => {
                      setFiltros((f) => ({
                        ...f,
                        modificado: "30",
                        modificado_apos: "",
                        modificado_antes: "",
                      }))
                      setDropdownAberto(null)
                    }}
                  >
                    Ultimos 30 dias
                  </button>
                </div>
                <div className="border-t pt-3 space-y-2">
                  <p className="text-xs font-medium text-muted-foreground">
                    Periodo personalizado
                  </p>
                  <div className="flex gap-2 items-center">
                    <Input
                      type="date"
                      value={filtros.modificado_apos?.slice(0, 10) ?? ""}
                      onChange={(e) =>
                        setFiltros((f) => ({
                          ...f,
                          modificado_apos: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "",
                        }))
                      }
                      className="h-8 text-sm"
                    />
                    <span className="text-xs text-muted-foreground">ate</span>
                    <Input
                      type="date"
                      value={filtros.modificado_antes?.slice(0, 10) ?? ""}
                      onChange={(e) =>
                        setFiltros((f) => ({
                          ...f,
                          modificado_antes: e.target.value
                            ? new Date(e.target.value).toISOString()
                            : "",
                        }))
                      }
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div className="flex justify-end items-center mt-3 pt-2 border-t">
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs cursor-pointer"
                      onClick={() => setDropdownAberto(null)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      className="h-7 text-xs cursor-pointer"
                      onClick={() => setDropdownAberto(null)}
                    >
                      Aplicar
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="ml-auto flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          className="h-8 gap-1.5 text-xs cursor-pointer"
          onClick={onNovaPasta}
        >
          <FolderPlus className="h-3.5 w-3.5" /> Nova pasta
        </Button>
        <Button size="sm" className="h-8 gap-1.5 text-xs cursor-pointer" onClick={onUpload}>
          <Upload className="h-3.5 w-3.5" /> Upload
        </Button>
      </div>
    </div>
  )
}
