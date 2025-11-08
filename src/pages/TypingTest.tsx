import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TypingArea } from "@/components/TypingArea"
import { TypingControls } from "@/components/TypingControls"
import { StatsBar } from "@/components/StatsBar"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {EASY_TEXT, HARD_TEXT, MEDIUM_TEXT} from "@/utils/const.ts";

function formatTime(ms: number) {
  const totalSec = Math.floor(ms / 1000)
  const m = Math.floor(totalSec / 60)
  const s = totalSec % 60
  return `${m}:${s.toString().padStart(2, "0")}`
}

export default function TypingTest() {
  const [text, setText] = useState<string>(EASY_TEXT)
  const [typed, setTyped] = useState<string>("")
  const [isRunning, setIsRunning] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const [openSummary, setOpenSummary] = useState(false)

  // timer
  const [elapsedMs, setElapsedMs] = useState(0)
  const startRef = useRef<number | null>(null)
  const accumulatedRef = useRef(0) // time accumulated across pauses
  const timerRef = useRef<number | null>(null)

  const inputRef = useRef<HTMLInputElement | null>(null)

  const correctChars = useMemo(() => {
    let ok = 0
    for (let i = 0; i < typed.length && i < text.length; i++) {
      if (typed[i] === text[i]) ok++
    }
    return ok
  }, [typed, text])

  const totalTyped = typed.length
  const minutes = Math.max(elapsedMs / 1000 / 60, 1e-6)
  const wpm = (correctChars / 5) / minutes
  const accuracy = totalTyped === 0 ? 100 : (correctChars / totalTyped) * 100
  const progressPct = Math.min(100, (typed.length / text.length) * 100)

  const startTicking = useCallback(() => {
    if (timerRef.current) return
    startRef.current = performance.now()
    timerRef.current = window.setInterval(() => {
      if (startRef.current == null) return
      const now = performance.now()
      const delta = now - startRef.current
      setElapsedMs(accumulatedRef.current + delta)
    }, 100)
  }, [])

  const stopTicking = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (startRef.current != null) {
      const now = performance.now()
      accumulatedRef.current += now - startRef.current
      startRef.current = null
      setElapsedMs(accumulatedRef.current)
    }
  }, [])

  const handleStart = () => {
    if (!hasStarted) setHasStarted(true)
    setIsRunning(true)
    startTicking()
    // focus input to capture typing
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  const handlePause = () => {
    setIsRunning(false)
    stopTicking()
  }

  const handleRestart = () => {
    setIsRunning(false)
    setHasStarted(false)
    setTyped("")
    accumulatedRef.current = 0
    startRef.current = null
    setElapsedMs(0)
    stopTicking()
    setOpenSummary(false)
    setTimeout(() => inputRef.current?.focus(), 0)
  }

  // Finish when typed full text
  useEffect(() => {
    if (typed.length >= text.length && text.length > 0 && !openSummary) {
      setIsRunning(false)
      stopTicking()
      setOpenSummary(true)
    }
  }, [typed.length, text.length, openSummary, stopTicking])

  // Keystroke handling via hidden input
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isRunning) return
    if (e.key === "Backspace") {
      setTyped((prev) => prev.slice(0, -1))
      e.preventDefault()
      return
    }
    if (e.key.length === 1) {
      // regular character
      setTyped((prev) => (prev + e.key).slice(0, text.length))
      e.preventDefault()
    }
  }

  useEffect(() => {
    return () => {
      // cleanup timer on unmount
      if (timerRef.current) window.clearInterval(timerRef.current)
    }
  }, [])

  return (
    <div className="mx-auto w-full max-w-3xl p-4 md:p-8">
      <div className="mb-6">
        <StatsBar wpm={wpm} accuracy={accuracy} elapsedMs={elapsedMs} progressPct={progressPct} />
      </div>

      <Card>
        <CardHeader className="flex items-center justify-between gap-4 sm:flex-row">
          <CardTitle className="text-xl">Keyboard-Warrior</CardTitle>
            <Select
              defaultValue="easy"
              onValueChange={(value) => {
                if (value === "easy") setText(EASY_TEXT)
                else if (value === "medium") setText(MEDIUM_TEXT)
                else if (value === "hard") setText(HARD_TEXT)
              }}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
            </Select>
          <TypingControls
            isRunning={isRunning}
            hasStarted={hasStarted}
            onStart={handleStart}
            onPause={handlePause}
            onRestart={handleRestart}
            timeLabel={formatTime(elapsedMs)}
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4" onClick={() => inputRef.current?.focus()}>
          <TypingArea key={text[0]} text={text} typed={typed} isActive={isRunning} />

          {/* Hidden input capturing keys (always enabled; we gate behavior via isRunning) */}
          <input
            ref={inputRef}
            value={typed}
            onKeyDown={onKeyDown}
            onChange={() => {}}
            tabIndex={-1}
            className="sr-only"
            aria-hidden="true"
          />
        </CardContent>
      </Card>

      <Dialog open={openSummary} onOpenChange={setOpenSummary}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Results</DialogTitle>
            <DialogDescription>Your typing test summary</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-3 gap-4 py-2">
            <div className="text-center">
              <div className="text-sm text-muted-foreground">WPM</div>
              <div className="text-3xl font-semibold tabular-nums">{Math.round(wpm)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Accuracy</div>
              <div className="text-3xl font-semibold tabular-nums">{Math.round(accuracy)}%</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="text-3xl font-semibold tabular-nums">{formatTime(elapsedMs)}</div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setOpenSummary(false)}>Close</Button>
            <Button variant="secondary" onClick={handleRestart}>Restart</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
