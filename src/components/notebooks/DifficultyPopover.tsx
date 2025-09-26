"use client"

import React from "react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"

interface DifficultyPopoverProps {
  difficulty: number
  setDifficulty: (value: number) => void
  showDifficulty: boolean
  setShowDifficulty: (show: boolean) => void
}

export const DifficultyPopover: React.FC<DifficultyPopoverProps> = ({
  difficulty,
  setDifficulty,
  showDifficulty,
  setShowDifficulty,
}) => {
  return (
    <Popover open={showDifficulty} onOpenChange={setShowDifficulty}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="gap-2 font-normal"
        >
          Difficulty: {difficulty}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Difficulty</h4>
            <p className="text-sm text-muted-foreground">
              Adjust the difficulty level of the AI responses
            </p>
          </div>
          <Slider
            value={[difficulty]}
            onValueChange={([value]) => setDifficulty(value)}
            max={10}
            min={1}
            step={1}
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}

export default DifficultyPopover