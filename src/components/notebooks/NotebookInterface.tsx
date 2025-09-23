"use client"

import type React from "react"
import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/integrations/supabase/client"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import {
  ArrowUpIcon,
  BookOpen,
  Menu,
  Focus,
  RotateCcw,
  Minimize2,
  Loader2,
  ArrowLeft,
  MoreHorizontal,
  Share,
  Download,
  Brain,
  Zap,
  Target,
  List,
  Lightbulb,
  MessageSquare,
  CheckCircle2,
  Coffee,
  Play,
  Pause,
  Sliders,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
}

interface NotebookInterfaceProps {
  notebookId: string
  notebookTitle: string
  onBack: () => void
}

const studyTips = [
  {
    icon: <Brain className="h-4 w-4 text-blue-500" />,
    title: "Memory Palace Technique",
    description: "Create mental maps of familiar places to remember complex information more effectively.",
  },
  {
    icon: <Zap className="h-4 w-4 text-yellow-500" />,
    title: "Pomodoro Method",
    description: "Study in 25-minute focused sessions followed by 5-minute breaks for maximum focus.",
  },
  {
    icon: <Target className="h-4 w-4 text-green-500" />,
    title: "Active Recall",
    description: "Test yourself frequently rather than just re-reading notes to improve retention.",
  },
]

// AutoResize Textarea Component
const AutoResizeTextarea: React.FC<{
  value: string
  onChange: (value: string) => void
  onKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void
  placeholder?: string
  className?: string
  disabled?: boolean
}> = ({ value, onChange, onKeyDown, placeholder = "", className = "", disabled = false }) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      placeholder={placeholder}
      className={cn("resize-none overflow-hidden border-none outline-none bg-transparent", className)}
      disabled={disabled}
      rows={1}
    />
  )
}

export const NotebookInterface: React.FC<NotebookInterfaceProps> = ({ notebookId, notebookTitle, onBack }) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [showActionMenu, setShowActionMenu] = useState(false)
  const [currentTipIndex, setCurrentTipIndex] = useState(0)
  const [focusMode, setFocusMode] = useState(false)
  const [focusTimer, setFocusTimer] = useState(25 * 60)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [focusSession, setFocusSession] = useState(0)
  const [activeOverlay, setActiveOverlay] = useState<null | {
    type: "quiz" | "summary" | "insights"
    title: string
    description: string
  }>(null)
  const [showFsPrompt, setShowFsPrompt] = useState(false)
  const [difficulty, setDifficulty] = useState<number>(5)
  const [showDifficulty, setShowDifficulty] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notebookId])

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (!scrollAreaRef.current) return
    const scrollContainer = scrollAreaRef.current.querySelector(
      "[data-radix-scroll-area-viewport]",
    ) as HTMLElement | null
    if (scrollContainer) {
      scrollContainer.scrollTop = scrollContainer.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTipIndex((prev) => (prev + 1) % studyTips.length)
    }, 8000)
    return () => clearInterval(interval)
  }, [])

  // Timer effect for focus mode
  useEffect(() => {
    let interval: number | undefined
    if (isTimerRunning && focusTimer > 0) {
      interval = window.setInterval(() => {
        setFocusTimer((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            setFocusSession((s) => s + 1)
            try {
              toast({
                title: "Focus Session Complete!",
                description: `Great work! You completed a ${focusSession % 4 === 3 ? "long" : "short"} focus session.`,
              })
            } catch (err) {
              // ignore toast errors in tests
            }
            return 25 * 60 // reset
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) window.clearInterval(interval)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isTimerRunning, focusTimer])

  // Lock page scroll when focus mode or overlay is active
  useEffect(() => {
    try {
      if (focusMode || activeOverlay || showActionMenu) {
        document.body.style.overflow = "hidden"
      } else {
        document.body.style.overflow = ""
      }
    } catch {
      // no-op for SSR or tests
    }
    return () => {
      try {
        document.body.style.overflow = ""
      } catch {}
    }
  }, [focusMode, activeOverlay, showActionMenu])

  useEffect(() => {
    const onFsChange = () => {
      if (!document.fullscreenElement && focusMode) {
        setFocusMode(false)
      }
    }
    document.addEventListener("fullscreenchange", onFsChange)
    return () => document.removeEventListener("fullscreenchange", onFsChange)
  }, [focusMode])

  useEffect(() => {
    if (typeof window === "undefined") return
    const key = `difficulty:${notebookId}`
    const stored = window.localStorage.getItem(key)
    if (stored) {
      const n = Number(stored)
      if (!Number.isNaN(n)) {
        const clamped = Math.min(10, Math.max(1, n))
        setDifficulty(clamped)
      }
    }
  }, [notebookId])

  useEffect(() => {
    if (typeof window === "undefined") return
    const key = `difficulty:${notebookId}`
    try {
      window.localStorage.setItem(key, String(difficulty))
    } catch {}
  }, [difficulty, notebookId])

  const fetchMessages = async () => {
    setLoadingMessages(true)
    try {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("notebook_id", notebookId)
        .order("created_at", { ascending: true })

      if (error) throw error

      const formattedMessages: Message[] = (data || []).map((msg: any) => ({
        id: String(msg.id),
        type: msg.type === "user" ? "user" : "assistant",
        content: msg.content,
        timestamp: new Date(msg.created_at),
        difficulty: msg.difficulty,
      }))

      if (formattedMessages.length === 0) {
        const welcomeMessage: Message = {
          id: "welcome",
          type: "assistant",
          content: `Welcome to your ${notebookTitle} notebook! I'm your AI study assistant. I can help you understand concepts, solve problems, and organize your learning. What would you like to explore today?`,
          timestamp: new Date(),
        }
        setMessages([welcomeMessage])
      } else {
        setMessages(formattedMessages)
      }
    } catch (err) {
      console.error("Error fetching messages:", err)
      toast({ title: "Error", description: "Failed to load messages", variant: "destructive" })
    } finally {
      setLoadingMessages(false)
    }
  }

  const saveMessage = async (message: Omit<Message, "id" | "timestamp">) => {
    try {
      const { error } = await supabase.from("messages").insert([
        {
          notebook_id: notebookId,
          type: message.type,
          content: message.content,
        },
      ])
      if (error) throw error
    } catch (err) {
      console.error("Error saving message:", err)
    }
  }

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    await saveMessage({ type: "user", content: userMessage.content})

    // simulated AI response (replace with real AI call)
    setTimeout(async () => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: `I understand you're asking about "${userMessage.content}". This is a simulated response to demonstrate the interface. In the full version, this would connect to your AI backend with sophisticated reasoning capabilities.\n\nHere's how I would help:\n• Break down complex concepts into digestible parts\n• Provide step-by-step explanations \n• Reference your existing notes for context\n• Suggest related topics to explore\n\nWhat specific aspect would you like me to explain further?`,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiResponse])
      await saveMessage({ type: "assistant", content: aiResponse.content })
      setIsLoading(false)
    }, 1500)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  const toggleTimer = () => setIsTimerRunning((r) => !r)
  const resetTimer = () => {
    setIsTimerRunning(false)
    setFocusTimer(25 * 60)
  }

  const toggleFocusMode = async () => {
    if (!focusMode) {
      try {
        // Attempt to enter fullscreen on user gesture
        await (document.documentElement as any)?.requestFullscreen?.()
      } catch (err) {
        // Ignore; toast gives context even if fullscreen was blocked
      }
      setFocusMode(true)
      try {
        toast({
          title: "Focus Mode Activated",
          description: "Entering immersive mode. Press Esc to exit fullscreen.",
        })
      } catch {}
    } else {
      try {
        if (document.fullscreenElement) {
          await (document as any)?.exitFullscreen?.()
        }
      } catch {}
      setFocusMode(false)
    }
  }

  const openOverlay = (type: "quiz" | "summary" | "insights") => {
    const meta = {
      quiz: { title: "Quiz Challenge", description: "Answer fast questions pulled from your chat to test mastery." },
      summary: { title: "Session Summary", description: "Get a punchy TL;DR of this conversation with highlights." },
      insights: { title: "Key Insights", description: "See top takeaways, aha-moments, and action items." },
    } as const
    setActiveOverlay({ type, title: meta[type].title, description: meta[type].description })
  }

  const header = (
    <header className="m-auto flex max-w-md flex-col gap-5 text-center py-8">
      <div className="flex items-center justify-center gap-3">
        <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-full border border-blue-200 dark:border-blue-800">
          <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
        </div>
        <h1 className="text-2xl font-semibold leading-none tracking-tight text-gray-900 dark:text-white">
          {notebookTitle}
        </h1>
      </div>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        Your AI study assistant is here to help you understand concepts, solve problems, and organize your learning.
      </p>
      <p className="text-gray-500 dark:text-gray-400 text-sm">Ask me anything about your studies to get started.</p>
    </header>
  )

  const messageList = (
    <div className="flex h-fit min-h-full flex-col gap-3 py-4">
      {messages.map((message) => (
        <div
          key={message.id}
          data-role={message.type === "user" ? "user" : "assistant"}
          className="max-w-[80%] rounded-xl px-4 py-3 text-sm leading-relaxed data-[role=assistant]:self-start data-[role=user]:self-end data-[role=assistant]:bg-gray-100 dark:data-[role=assistant]:bg-[#1a1a1a] data-[role=user]:bg-blue-600 dark:data-[role=user]:bg-blue-500 data-[role=assistant]:text-gray-900 dark:data-[role=assistant]:text-white data-[role=user]:text-white border data-[role=assistant]:border-gray-200 dark:data-[role=assistant]:border-gray-700 data-[role=user]:border-blue-600 dark:data-[role=user]:border-blue-500"
        >
          <div className="whitespace-pre-wrap">
            {message.content.split("\n").map((line, index) => {
              if (line.startsWith("•")) {
                return (
                  <div key={index} className="flex items-start gap-2 my-1">
                    <span className="text-blue-600 dark:text-blue-400 opacity-70">•</span>
                    <span>{line.slice(1).trim()}</span>
                  </div>
                )
              }
              return line ? (
                <div key={index} className="mb-1 last:mb-0">
                  {line}
                </div>
              ) : (
                <br key={index} />
              )
            })}
          </div>
          
        </div>
      ))}

      {isLoading && (
        <div
          data-role="assistant"
          className="max-w-[80%] rounded-xl px-4 py-3 text-sm self-start bg-gray-100 dark:bg-[#1a1a1a] text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"></div>
              <div
                className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.1s" }}
              />
              <div
                className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce"
                style={{ animationDelay: "0.2s" }}
              />
            </div>
            <span className="text-gray-600 dark:text-gray-300 ml-1">AI is thinking...</span>
          </div>
        </div>
      )}
    </div>
  )

  return (
    <TooltipProvider>
      <div
        className={`relative flex min-h-[100dvh] w-screen transition-all duration-500 ${
          focusMode
            ? "bg-slate-950 dark:from-[#0a0a0a] dark:via-slate-900/40 dark:to-[#0a0a0a]"
            : "bg-white dark:bg-[#0f0f0f]"
        } ${activeOverlay || showActionMenu ? "scale-[0.995]" : ""}`}
      >
        {/* Focus Mode Overlay */}
        {focusMode && (
          <div className="fixed inset-0 z-50">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
            <div className="relative flex flex-col h-full">
              {/* Focus Mode Header */}
              <div className="flex items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-9 w-9 rounded-md bg-primary text-background flex items-center justify-center">
                    <Target className="h-4 w-4" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Focus Mode</h2>
                    <p className="text-white/70 text-sm">Deep learning session • Session #{focusSession + 1}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Pomodoro Timer */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-3xl font-mono font-bold text-white">{formatTime(focusTimer)}</div>
                        <div className="text-xs text-white/60 uppercase tracking-wide">
                          {focusSession % 4 === 3 ? "Long Break" : focusSession % 2 === 1 ? "Break" : "Focus"}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          onClick={toggleTimer}
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border-white/20"
                          variant="outline"
                        >
                          {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                        </Button>
                        <Button
                          onClick={resetTimer}
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/20 hover:bg-white/30 text-white border-white/20"
                          variant="outline"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={toggleFocusMode}
                    variant="outline"
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-md"
                  >
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Exit Focus
                  </Button>
                </div>
              </div>

              {/* Focus Mode Chat Area */}
              <div className="flex-1 overflow-hidden px-6">
                <div className="rounded-3xl border border-white/10 bg-white/10 h-full flex flex-col shadow-2xl">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <div className="text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-white/60 mx-auto mb-3" />
                        <p className="text-white/70">Loading your conversation...</p>
                      </div>
                    </div>
                  ) : messages.length ? (
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                      {messageList}
                    </ScrollArea>
                  ) : (
                    header
                  )}
                </div>
              </div>

              {/* Focus Mode Progress */}
              <div className="p-6">
                <div className="flex items-center justify-center gap-8 text-white/60 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-400" />
                    <span>Sessions completed: {focusSession}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    <span>{Math.max(0, messages.length - 1)} messages this session</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="h-4 w-4" />
                    <span>Next break in {formatTime(focusTimer)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Gamified Pop-Up Overlay */}
        {activeOverlay && (
          <div className="fixed inset-0 z-[70]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveOverlay(null)} />
            <div className="relative z-10 flex h-full items-center justify-center p-6">
              <div className="relative w-full max-w-lg rounded-3xl border border-border bg-background text-foreground shadow-2xl p-8">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-xl font-semibold">{activeOverlay.title}</h3>
                  <Button variant="ghost" size="icon" onClick={() => setActiveOverlay(null)} aria-label="Close">
                    <Minimize2 className="h-4 w-4" />
                  </Button>
                </div>

                <p className="text-sm text-muted-foreground mb-6">{activeOverlay.description}</p>

                <div className="flex gap-3">
                  <Button
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => {
                      toast({
                        title: "Coming soon",
                        description: `The ${activeOverlay.type} experience will be epic.`,
                      })
                      setActiveOverlay(null)
                    }}
                  >
                    Let’s go
                  </Button>
                  <Button variant="outline" onClick={() => setActiveOverlay(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Regular Interface (when not in focus mode) */}
        {!focusMode && (
          <>
            {/* Sidebar Toggle */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowActionMenu(true)}
              className="fixed top-4 left-4 z-50 h-10 w-10 bg-white/90 dark:bg-[#1a1a1a]/90 border border-gray-200 dark:border-gray-800 shadow-lg hover:bg-white dark:hover:bg-[#1a1a1a] text-gray-900 dark:text-white"
            >
              <Menu className="h-4 w-4" />
            </Button>

            {/* Focus Mode Toggle Button */}
            <Button
              onClick={() => setShowFsPrompt(true)}
              className="fixed top-4 right-4 z-50 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <Focus className="h-4 w-4 mr-2" />
              Focus Mode
            </Button>

            {showFsPrompt && (
              <>
                <div
                  className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowFsPrompt(false)}
                />
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                  <div className="w-full max-w-sm rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] p-6 shadow-2xl">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full p-2 bg-blue-100 dark:bg-blue-900/30">
                        <Focus className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-base font-semibold text-gray-900 dark:text-white">Enter fullscreen?</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          Chrome will ask for permission. This makes Focus Mode truly immersive.
                        </p>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowFsPrompt(false)
                          setFocusMode(true)
                        }}
                        className="border-gray-300 dark:border-gray-700"
                      >
                        Not now
                      </Button>
                      <Button
                        onClick={async () => {
                          setShowFsPrompt(false)
                          try {
                            await (document.documentElement as any)?.requestFullscreen?.()
                          } catch {}
                          setFocusMode(true)
                          try {
                            toast({ title: "Focus Mode Activated", description: "Press Esc to exit fullscreen." })
                          } catch {}
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        Enter fullscreen
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {showActionMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/40 dark:bg-black/60 backdrop-blur-sm z-40"
                  onClick={() => setShowActionMenu(false)}
                />
                {/* Gamified launcher near the menu button */}
                <div className="fixed top-16 left-4 z-50">
                  <div className="relative w-[20rem] rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-2xl p-5 overflow-hidden">
                    {/* playful accents */}
                    <div className="pointer-events-none absolute inset-0 -z-10">
                      <div className="absolute -top-6 -left-6 h-20 w-20 rounded-full bg-blue-500/15 blur-xl animate-pulse" />
                      <div className="absolute bottom-0 right-0 h-16 w-16 rounded-full bg-cyan-500/15 blur-xl animate-ping" />
                    </div>

                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Power-Ups</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowActionMenu(false)}
                        className="h-8 w-8 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      >
                        <Minimize2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      <Button
                        className="w-full justify-start rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md"
                        size="sm"
                        onClick={() => {
                          setShowActionMenu(false)
                          openOverlay("quiz")
                        }}
                      >
                        <Brain className="h-4 w-4 mr-2 text-white" />
                        Create Quiz
                      </Button>
                      <Button
                        className="w-full justify-start rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-md"
                        size="sm"
                        onClick={() => {
                          setShowActionMenu(false)
                          openOverlay("summary")
                        }}
                      >
                        <List className="h-4 w-4 mr-2 text-white" />
                        Summarize Chat
                      </Button>
                      <Button
                        className="w-full justify-start rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white shadow-md"
                        size="sm"
                        onClick={() => {
                          setShowActionMenu(false)
                          openOverlay("insights")
                        }}
                      >
                        <Lightbulb className="h-4 w-4 mr-2 text-white" />
                        Key Insights
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Main Chat Interface - Full Width */}
            <main className="flex h-screen w-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#0f0f0f]">
                <div className="flex items-center gap-3 ml-16">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onBack}
                    className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-blue-100 dark:bg-blue-900/30">
                        <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{notebookTitle}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">AI Study Assistant</div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {/* Difficulty control */}
                  <div className="relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDifficulty((v) => !v)}
                      className="h-8 px-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                      aria-haspopup="dialog"
                      aria-expanded={showDifficulty}
                      aria-controls="difficulty-popover"
                    >
                      <Sliders className="h-4 w-4 mr-2" />
                      <span className="text-xs font-medium">Difficulty</span>
                      <span className="ml-2 rounded border border-cyan-500/20 bg-cyan-500/15 px-1.5 py-0.5 text-[10px] leading-none text-cyan-400">
                        {difficulty}
                      </span>
                    </Button>

                    {showDifficulty && (
                      <>
                        {/* click-outside catcher */}
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => setShowDifficulty(false)}
                          aria-hidden="true"
                        />
                        <div
                          id="difficulty-popover"
                          role="dialog"
                          aria-label="Select difficulty"
                          className="absolute right-0 top-10 z-50 w-72 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#121212] shadow-xl p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">Select Difficulty</div>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => setShowDifficulty(false)}
                              className="h-7 w-7 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                              aria-label="Close"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="text-xs text-gray-500 dark:text-gray-400">1</span>
                            <input
                              type="range"
                              min={1}
                              max={100}
                              step={1}
                              value={difficulty}
                              onChange={(e) => setDifficulty(Number(e.target.value))}
                              aria-valuemin={1}
                              aria-valuemax={10}
                              aria-valuenow={difficulty}
                              aria-label="Difficulty level"
                              className="flex-1 appearance-none h-2 rounded-full bg-gray-200 dark:bg-gray-700 outline-none accent-cyan-500"
                            />
                            <span className="text-xs text-gray-500 dark:text-gray-400">10</span>
                          </div>

                          <div className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                            {difficulty <= 3
                              ? "Chill: gentle hints and smaller steps."
                              : difficulty <= 6
                                ? "Standard: balanced guidance and challenges."
                                : difficulty <= 8
                                  ? "Challenging: fewer hints, bigger leaps."
                                  : "Insane: minimal guidance, tough prompts."}
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Share / Download / More */}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                      >
                        <Share className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Share</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Download</TooltipContent>
                  </Tooltip>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#1a1a1a]"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>More</TooltipContent>
                  </Tooltip>
                </div>
              </div>

              {/* Messages Area - Full Width with max-width constraint */}
              <div className="flex-1 overflow-y-auto px-6 bg-white dark:bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto h-full flex flex-col">
                  {loadingMessages ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-gray-400 dark:text-gray-500" />
                    </div>
                  ) : messages.length ? (
                    <ScrollArea className="h-full" ref={scrollAreaRef}>
                      {messageList}
                    </ScrollArea>
                  ) : (
                    header
                  )}
                </div>
              </div>

              {/* Input Form - Floating with glow effect */}
              <div className="px-6 py-6 bg-white dark:bg-[#0f0f0f]">
                <div className="max-w-4xl mx-auto">
                  <form
                    onSubmit={(e) => handleSubmit(e)}
                    className="relative flex items-center rounded-3xl border px-5 py-4 pr-14 text-sm transition-all duration-200 shadow-lg hover:shadow-xl bg-white dark:bg-[#111111] border-gray-300 dark:border-white/15 focus-within:ring-4 focus-within:ring-blue-500/10 dark:focus-within:ring-white/10 focus-within:before:opacity-100 before:transition-opacity"
                  >
                    <AutoResizeTextarea
                      value={input}
                      onChange={setInput}
                      onKeyDown={handleKeyDown}
                      placeholder="Ask me anything about your studies..."
                      className="flex-1 bg-transparent focus:outline-none min-h-[24px] max-h-32 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 text-base leading-relaxed"
                      disabled={isLoading}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="submit"
                          size="sm"
                          className="absolute right-3 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full p-0 bg-white hover:bg-white/90 text-gray-900 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50"
                          disabled={!input.trim() || isLoading}
                        >
                          <ArrowUpIcon className="h-6 w-6" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={12}>Send message</TooltipContent>
                    </Tooltip>
                  </form>

                  {/* Footer Info */}
                  <div className="flex items-center justify-center pt-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <MessageSquare className="h-3 w-3" />
                      <span>{Math.max(0, messages.length - 1)} messages</span>
                    </div>
                  </div>
                </div>
              </div>
            </main>
          </>
        )}
      </div>
    </TooltipProvider>
  )
}

export default NotebookInterface
