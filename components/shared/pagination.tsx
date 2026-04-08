"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  page: number
  totalPages: number
  onPageChange: (page: number) => void
  className?: string
  variant?: "default" | "compact"
}

export function Pagination({
  page,
  totalPages,
  onPageChange,
  className = "",
  variant = "default",
}: PaginationProps) {
  if (totalPages <= 1) return null

  if (variant === "compact") {
    return (
      <div
        className={`flex items-center justify-between py-2 px-3 border-t border-border/50 bg-muted/20 ${className}`}
      >
        <span className="text-xs text-muted-foreground">
          Pagina {page} de {totalPages}
        </span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 cursor-pointer"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={`flex justify-center items-center gap-2 py-3 border-t border-border/50 ${className}`}
    >
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs cursor-pointer"
        disabled={page <= 1}
        onClick={() => onPageChange(Math.max(1, page - 1))}
      >
        Anterior
      </Button>
      <span className="text-xs text-muted-foreground">
        {page} / {totalPages}
      </span>
      <Button
        variant="outline"
        size="sm"
        className="h-7 text-xs cursor-pointer"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Proxima
      </Button>
    </div>
  )
}
