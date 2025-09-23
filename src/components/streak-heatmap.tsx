"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type DayCell = {
  date: Date
  level: number // 0-4 intensity
  key: string // YYYY-MM-DD
}

const STORAGE_KEY = "study-activity-v1"

function formatDate(d: Date) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, "0")
  const day = String(d.getDate()).padStart(2, "0")
  return `${y}-${m}-${day}`
}

function startOfDay(d: Date) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export function StreakHeatmap() {
  const [activity, setActivity] = useState<Record<string, number>>({})
  const [todayKey, setTodayKey] = useState<string>(formatDate(new Date()))

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setActivity(JSON.parse(raw))
    } catch {}
    setTodayKey(formatDate(new Date()))
  }, [])

  // Generate last ~20 weeks like GitHub (140 days)
  const days: DayCell[] = useMemo(() => {
    const out: DayCell[] = []
    const totalDays = 7 * 20
    const today = startOfDay(new Date())
    for (let i = totalDays - 1; i >= 0; i--) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = formatDate(d)
      const count = activity[key] || 0
      // Map count to intensity 0-4
      let level = 0
      if (count >= 1 && count < 3) level = 1
      else if (count >= 3 && count < 6) level = 2
      else if (count >= 6 && count < 10) level = 3
      else if (count >= 10) level = 4
      out.push({ date: d, level, key })
    }
    return out
  }, [activity])

  // Compute current and longest streaks (consecutive days with count > 0)
  const { currentStreak, longestStreak } = useMemo(() => {
    let cur = 0
    let best = 0
    const today = startOfDay(new Date())
    // Iterate backwards from today
    for (let i = 0; i < 365; i++) {
      const d = new Date(today)
      d.setDate(today.getDate() - i)
      const key = formatDate(d)
      const active = (activity[key] || 0) > 0
      if (i === 0 && !active) {
        // if today inactive, current streak is 0
        cur = 0
      }
      if (active) {
        cur = cur === 0 && i !== 0 ? 1 : cur + 1
        best = Math.max(best, cur)
      } else {
        // break current streak only if we’ve started counting
        if (i === 0) {
          // do nothing
        } else {
          cur = 0
        }
      }
    }
    // If today is active, cur already holds consecutive count including today
    // If today is not active, we recompute current streak from yesterday
    if ((activity[formatDate(today)] || 0) === 0) {
      let c = 0
      for (let i = 1; i < 365; i++) {
        const d = new Date(today)
        d.setDate(today.getDate() - i)
        const key = formatDate(d)
        if ((activity[key] || 0) > 0) c++
        else break
      }
      return { currentStreak: c, longestStreak: Math.max(best, c) }
    }
    return { currentStreak: cur, longestStreak: best }
  }, [activity])

  const markToday = () => {
    const key = formatDate(new Date())
    const next = { ...activity, [key]: (activity[key] || 0) + 1 }
    setActivity(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {}
  }

  const resetActivity = () => {
    setActivity({})
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {}
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Current Streak</p>
          <p className="text-2xl font-bold">
            {currentStreak} day{currentStreak === 1 ? "" : "s"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Longest Streak</p>
          <p className="text-2xl font-bold">
            {longestStreak} day{longestStreak === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="flex gap-2 items-center">
        <Button size="sm" variant="default" onClick={markToday}>
          Check in today
        </Button>
        <Button size="sm" variant="secondary" onClick={resetActivity}>
          Reset
        </Button>
      </div>

      {/* Heatmap */}
      <div className="flex gap-1 overflow-x-auto pb-1" aria-label="Study streak heatmap">
        {/* Columns: 20 weeks */}
        {Array.from({ length: 20 }).map((_, colIdx) => {
          const col = days.slice(colIdx * 7, colIdx * 7 + 7)
          return (
            <div key={colIdx} className="grid grid-rows-7 gap-1">
              {col.map((cell) => (
                <div
                  key={cell.key}
                  title={`${cell.key} • ${activity[cell.key] || 0} sessions`}
                  aria-label={`${cell.key} has ${activity[cell.key] || 0} sessions`}
                  className={cn(
                    "h-3 w-3 rounded-sm border border-border/60",
                    cell.level === 0 && "bg-muted",
                    cell.level === 1 && "bg-primary/20",
                    cell.level === 2 && "bg-primary/40",
                    cell.level === 3 && "bg-primary/60",
                    cell.level === 4 && "bg-primary",
                  )}
                />
              ))}
            </div>
          )
        })}
      </div>

      <p className="text-xs text-muted-foreground">
        Tip: Every time you study, hit “Check in today.” Keep your streak alive like GitHub commits.
      </p>
    </div>
  )
}
