"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface HeaderBarProps {
  notebookTitle: string
  onBack: () => void
}

export const HeaderBar: React.FC<HeaderBarProps> = ({ notebookTitle, onBack }) => {
  return (
    <header className="sticky left-0 top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-14 items-center">
        <Button variant="ghost" size="icon" onClick={onBack}>
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">Go back</span>
        </Button>
        <h1 className="mx-4 line-clamp-1 text-lg font-medium">
          {notebookTitle}
        </h1>
      </div>
    </header>
  )
}

export default HeaderBar