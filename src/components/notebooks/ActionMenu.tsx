"use client"

import React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowUpIcon, Globe } from "lucide-react"

interface ActionMenuProps {
  setShowActionMenu: (show: boolean) => void
  openOverlay: (type: "quiz" | "summary" | "insights") => void
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ 
  setShowActionMenu,
  openOverlay
}) => {
  return (
    <div className="fixed right-0 top-16 z-40 flex flex-col items-center gap-2 px-4 py-4">
      <div className="flex flex-col gap-2">
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-primary/10"
          onClick={() => openOverlay('quiz')}
        >
          <ArrowUpIcon className="h-5 w-5" />
          <span className="sr-only">Quiz Challenge</span>
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="hover:bg-primary/10"
          onClick={() => openOverlay('insights')}
        >
          <Globe className="h-5 w-5" />
          <span className="sr-only">Key Insights</span>
        </Button>
      </div>
    </div>
  )
}

export default ActionMenu