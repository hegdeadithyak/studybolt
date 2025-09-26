"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import AutoResizeTextarea from "./AutoResizeTextarea"
interface InputFormProps {
  input: string
  setInput: (value: string) => void
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  handleSubmit: (e?: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  enableWebSearch: boolean
}

export const InputForm: React.FC<InputFormProps> = ({
  input,
  setInput,
  handleKeyDown,
  handleSubmit,
  isLoading,
  enableWebSearch,
}) => {
  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative grow">
        <AutoResizeTextarea
          value={input}
          onChange={(e) => setInput(e)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything..."
          className="min-h-[2.5rem] w-full rounded-lg border bg-background px-4 py-2 pr-20"
        />
        <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
          {enableWebSearch && (
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 shrink-0 rounded-full bg-background opacity-50 hover:bg-muted hover:opacity-100"
              disabled={!input.trim() || isLoading}
              type="submit"
            >
              <Search className="h-4 w-4" />
              <span className="sr-only">Search</span>
            </Button>
          )}
          <Button
            type="submit"
            className="bg-primary font-medium text-primary-foreground shadow hover:bg-primary/90"
            disabled={!input.trim() || isLoading}
          >
            Send
          </Button>
        </div>
      </div>
    </form>
  )
}

export default InputForm