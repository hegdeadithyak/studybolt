"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { MoreHorizontal, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface FocusModeOverlayProps {
  focusSession: number
  focusTimer: number
  isTimerRunning: boolean
  toggleTimer: () => void
  resetTimer: () => void
  toggleFocusMode: () => void
  loadingMessages: boolean
  messages: any[]
  formatTime: (seconds: number) => string
  messageList: React.ReactNode
  input: string
  setInput: (value: string) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  scrollAreaRef: React.RefObject<HTMLDivElement>
}

export const FocusModeOverlay: React.FC<FocusModeOverlayProps> = ({
  focusSession,
  focusTimer,
  isTimerRunning,
  toggleTimer,
  resetTimer,
  toggleFocusMode,
  loadingMessages,
  messages,
  formatTime,
  messageList,
  input,
  setInput,
  handleKeyDown,
  handleSubmit,
  isLoading,
  scrollAreaRef,
}) => {
  return (
    <div className="fixed inset-0 z-50 flex h-screen w-screen items-center justify-center">
      <div className="flex h-full w-full flex-col rounded-none bg-transparent text-center text-white">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent"></div>
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/80 to-transparent"></div>
        <header className="relative z-10 flex items-center justify-between p-4">
          <Button
            variant="ghost"
            className="text-white hover:bg-white/20"
            onClick={toggleFocusMode}
          >
            <MoreHorizontal className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="rounded bg-white/10 px-4 py-2 text-sm">
              Session {focusSession + 1}
            </div>
            <div className="text-lg font-mono">{formatTime(focusTimer)}</div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={toggleTimer}
              >
                {isTimerRunning ? "Pause" : "Start"}
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:bg-white/20"
                onClick={resetTimer}
              >
                Reset
              </Button>
            </div>
          </div>
        </header>
        <main className="relative z-10 mx-auto flex max-w-4xl grow flex-col gap-8 overflow-hidden p-8">
          <div ref={scrollAreaRef} className="relative grow">
            <ScrollArea className="h-full w-full rounded-lg border border-white/10 bg-white/5 p-4">
              {loadingMessages ? (
                <div className="flex h-full items-center justify-center">
                  Loading...
                </div>
              ) : (
                messageList
              )}
            </ScrollArea>
          </div>
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative grow">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask anything..."
                className="min-h-[2.5rem] w-full resize-none rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-white placeholder-white/50 focus:border-white/20 focus:outline-none focus:ring-0"
                rows={1}
                style={{
                  height: "2.5rem",
                  maxHeight: "10rem",
                }}
              />
              <div className="absolute right-2 top-1/2 -translate-y-1/2">
                <Button
                  type="submit"
                  size="icon"
                  variant="ghost"
                  className="text-white opacity-50 hover:bg-white/10 hover:opacity-100"
                  disabled={!input.trim() || isLoading}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </form>
        </main>
      </div>
    </div>
  )
}

export default FocusModeOverlay