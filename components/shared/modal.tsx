"use client"

import { useEffect, useCallback } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  icon?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  children: React.ReactNode
  footer?: React.ReactNode
  preventClose?: boolean
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

export function Modal({
  open,
  onClose,
  title,
  icon,
  size = "md",
  children,
  footer,
  preventClose = false,
}: ModalProps) {
  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape" && !preventClose) {
        onClose()
      }
    },
    [onClose, preventClose]
  )

  useEffect(() => {
    if (open) {
      document.addEventListener("keydown", handleEscape)
      document.body.style.overflow = "hidden"
    }
    return () => {
      document.removeEventListener("keydown", handleEscape)
      document.body.style.overflow = "unset"
    }
  }, [open, handleEscape])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/20 backdrop-blur-sm"
      onClick={() => !preventClose && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className={cn(
          "bg-card rounded-xl shadow-xl border p-6 w-full mx-4 animate-in fade-in-0 zoom-in-95",
          sizeClasses[size]
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2
            id="modal-title"
            className="text-base font-semibold flex items-center gap-2 text-foreground"
          >
            {icon}
            {title}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={onClose}
            disabled={preventClose}
            aria-label="Fechar modal"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div>{children}</div>

        {footer && (
          <div className="mt-4 pt-4 border-t flex justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}
