"use client"

import React from "react"
import { cn } from "@/lib/utils"

interface GamifiedOverlayProps {
  activeOverlay: {
    type: "quiz" | "summary" | "insights"
    title: string
    description: string
  }
  setActiveOverlay: (overlay: null) => void
  toast: any
}

export const GamifiedOverlay: React.FC<GamifiedOverlayProps> = ({
  activeOverlay,
  setActiveOverlay,
  toast,
}) => {
  return (
    <div 
      className={cn(
        "fixed inset-0 z-50 bg-background/80 backdrop-blur-sm",
        "flex items-center justify-center p-4"
      )}
      onClick={() => setActiveOverlay(null)}
    >
      <div className="max-w-lg rounded-lg bg-card p-6 shadow-lg">
        <h3 className="text-xl font-semibold">{activeOverlay.title}</h3>
        <p className="mt-2 text-muted-foreground">{activeOverlay.description}</p>
      </div>
    </div>
  )
}

export default GamifiedOverlay