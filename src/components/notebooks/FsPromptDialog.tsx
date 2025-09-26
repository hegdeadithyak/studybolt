"use client"

import React from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface FsPromptDialogProps {
  showFsPrompt: boolean
  setShowFsPrompt: (show: boolean) => void
  setFocusMode: (enabled: boolean) => void
  toast: any
}

export const FsPromptDialog: React.FC<FsPromptDialogProps> = ({
  showFsPrompt,
  setShowFsPrompt,
  setFocusMode,
  toast,
}) => {
  const handleOpenChange = async (open: boolean) => {
    setShowFsPrompt(open)
    if (!open) {
      try {
        await document.exitFullscreen()
      } catch {}
      setFocusMode(false)
    }
  }

  return (
    <Dialog open={showFsPrompt} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Focus Mode</DialogTitle>
          <DialogDescription>
            Focus mode helps you concentrate by minimizing distractions. It works best in
            fullscreen. Press Esc anytime to exit.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default FsPromptDialog