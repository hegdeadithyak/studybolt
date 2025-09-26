"use client"

import React from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface MessageListProps {
  messages: Array<{
    id: string
    type: "user" | "assistant"
    content: string
  }>
  isLoading: boolean
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={cn(
            "flex items-start gap-4 rounded-lg p-4",
            message.type === "assistant"
              ? "bg-muted/50"
              : "bg-primary/5"
          )}
        >
          <Avatar className="h-8 w-8">
            <AvatarFallback>
              {message.type === "user" ? "U" : "AI"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-2">
            <div className="prose dark:prose-invert max-w-none">
              {message.content}
            </div>
          </div>
        </div>
      ))}
      {isLoading && (
        <div className="flex items-center justify-center p-4">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
        </div>
      )}
    </div>
  )
}

export default MessageList