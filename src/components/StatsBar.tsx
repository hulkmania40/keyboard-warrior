import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface StatsBarProps {
  wpm: number
  accuracy: number // 0..100
  elapsedMs: number
  progressPct: number // 0..100
}

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export function StatsBar({ wpm, accuracy, elapsedMs, progressPct }: StatsBarProps) {
  return (
    <Card>
      <CardContent className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-3">
        <div className="flex items-center justify-between gap-6">
          <div className="text-sm text-muted-foreground">WPM</div>
          <div className="text-2xl font-semibold tabular-nums">{Math.round(wpm)}</div>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="text-sm text-muted-foreground">Accuracy</div>
          <div className="text-2xl font-semibold tabular-nums">{Math.round(accuracy)}%</div>
        </div>
        <div className="flex items-center justify-between gap-6">
          <div className="text-sm text-muted-foreground">Time</div>
          <div className="text-2xl font-semibold tabular-nums">{formatTime(elapsedMs)}</div>
        </div>
        <div className="col-span-1 sm:col-span-3">
          <Progress value={progressPct} />
        </div>
      </CardContent>
    </Card>
  )
}
