"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { LayoutGrid, ScrollText } from "lucide-react"

interface ScreenSubNavigationProps {
  mainContent: React.ReactNode
  logContent: React.ReactNode
  isVisible?: boolean
}

export function ScreenSubNavigation({
  mainContent,
  logContent,
  isVisible = true,
}: ScreenSubNavigationProps) {
  const [activeTab, setActiveTab] = useState<"main" | "logs">("main")

  if (!isVisible) return null

  return (
    <div className="flex flex-col h-full">
      <div className="border-b bg-card">
        <div className="flex items-center px-6">
          <button
            type="button"
            onClick={() => setActiveTab("main")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer",
              activeTab === "main"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <LayoutGrid className="h-4 w-4" />
            Dados
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("logs")}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors cursor-pointer",
              activeTab === "logs"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            <ScrollText className="h-4 w-4" />
            Auditoria
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-6">
        {activeTab === "main" ? mainContent : logContent}
      </div>
    </div>
  )
}
