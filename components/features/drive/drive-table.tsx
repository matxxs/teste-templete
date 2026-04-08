"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Folder,
  FileText,
  MoreVertical,
  FolderPlus,
  Upload,
  Download,
  Trash2,
} from "lucide-react"
import { formatBytes, formatDateShort } from "@/lib/helpers"
import type { ItemDrive } from "@/interfaces"

interface DriveTableProps {
  items: ItemDrive[]
  loading: boolean
  onNavigate: (id: string | null) => void
  onDownload: (item: ItemDrive) => void
  onDelete: (item: ItemDrive) => void
  onCreateSubfolder: (parentId: string) => void
  onUploadHere: (parentId: string) => void
}

export function DriveTable({
  items,
  loading,
  onNavigate,
  onDownload,
  onDelete,
  onCreateSubfolder,
  onUploadHere,
}: DriveTableProps) {
  return (
    <Card className="border-border/50 shadow-sm overflow-visible">
      <CardContent className="p-0">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/30">
                <th className="w-8 py-2.5 px-3" />
                <th className="text-left py-2.5 px-3 font-medium text-xs text-muted-foreground uppercase tracking-wider">
                  Nome
                </th>
                <th className="text-left py-2.5 px-3 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden md:table-cell">
                  Proprietario
                </th>
                <th className="text-left py-2.5 px-3 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden sm:table-cell">
                  Modificado
                </th>
                <th className="text-left py-2.5 px-3 font-medium text-xs text-muted-foreground uppercase tracking-wider hidden lg:table-cell">
                  Tamanho
                </th>
                <th className="w-10 py-2.5 px-2" />
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-16 text-center text-sm text-muted-foreground"
                  >
                    Carregando...
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <Folder className="h-10 w-10 text-muted-foreground/30" />
                      <p className="text-sm text-muted-foreground">
                        Esta pasta esta vazia
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Use os botoes acima para criar pastas ou enviar arquivos
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                items.map((item) => (
                  <tr
                    key={item.id}
                    className="border-b border-border/50 last:border-0 hover:bg-muted/20 transition-colors group"
                  >
                    <td className="py-2.5 px-3">
                      {item.grupo_cor ? (
                        <span
                          className="inline-block w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: item.grupo_cor }}
                          title={item.grupo_nome ?? undefined}
                        />
                      ) : (
                        <span className="inline-block w-2.5" />
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <button
                        type="button"
                        className="flex items-center gap-2.5 text-left hover:text-primary transition-colors"
                        onClick={() =>
                          item.tipo === "pasta" && onNavigate(item.id)
                        }
                      >
                        {item.tipo === "pasta" ? (
                          <Folder className="h-4.5 w-4.5 text-primary/70 shrink-0" />
                        ) : (
                          <FileText className="h-4.5 w-4.5 text-muted-foreground shrink-0" />
                        )}
                        <span className="font-medium text-sm truncate">
                          {item.nome}
                        </span>
                      </button>
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs hidden md:table-cell">
                      {item.proprietario_nome ?? "---"}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs hidden sm:table-cell">
                      {formatDateShort(item.data_modificacao)}
                    </td>
                    <td className="py-2.5 px-3 text-muted-foreground text-xs hidden lg:table-cell">
                      {item.tipo === "arquivo" && item.tamanho != null
                        ? formatBytes(item.tamanho)
                        : "---"}
                    </td>
                    <td className="py-2 px-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger >
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-44">
                          {item.tipo === "pasta" && (
                            <>
                              <DropdownMenuItem
                                onClick={() => onCreateSubfolder(item.id)}
                              >
                                <FolderPlus className="h-3.5 w-3.5 mr-2" />
                                Nova subpasta
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onUploadHere(item.id)}
                              >
                                <Upload className="h-3.5 w-3.5 mr-2" />
                                Upload aqui
                              </DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuItem onClick={() => onDownload(item)}>
                            <Download className="h-3.5 w-3.5 mr-2" />
                            {item.tipo === "pasta" ? "Baixar ZIP" : "Download"}
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => onDelete(item)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-2" />
                            Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
