import React from "react"
import { Button } from "@/components/ui/button"

export interface TypingControlsProps {
  isRunning: boolean
  hasStarted: boolean
  onStart: () => void
  onPause: () => void
  onRestart: () => void
  timeLabel: string
}

export function TypingControls({
  isRunning,
  hasStarted,
  onStart,
  onPause,
  onRestart,
  timeLabel,
}: TypingControlsProps) {
  return (
    <div className="flex items-center gap-2">
      {!hasStarted || !isRunning ? (
        <Button onClick={onStart} aria-label="Start typing test">
          Start
        </Button>
      ) : (
        <Button variant="secondary" onClick={onPause} aria-label="Pause typing test">
          Pause
        </Button>
      )}
      <Button variant="outline" onClick={onRestart} aria-label="Restart typing test">
        Restart
      </Button>
      <div className="ml-3 text-sm tabular-nums text-muted-foreground" aria-live="polite">
        {timeLabel}
      </div>
    </div>
  )
}
