import { useEffect, useMemo, useRef } from "react"

export interface TypingAreaProps {
  text: string
  typed: string
  isActive: boolean
}

// Renders the full paragraph as character spans so we can highlight
// the current word and current character, and scroll as the user types.
export function TypingArea({ text, typed, isActive }: TypingAreaProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const currentIndex = typed.length

  const chars = useMemo(() => text.split(""), [text])

  const isWordBoundary = (idx: number) => {
    if (idx < 0 || idx >= chars.length) return false
    return chars[idx] === " " || chars[idx] === "\n" || chars[idx] === "\t"
  }

  // Determine current word range [start, end)
  const [wordStart, wordEnd] = useMemo(() => {
    let start = currentIndex
    while (start > 0 && !isWordBoundary(start - 1)) start--
    let end = currentIndex
    while (end < chars.length && !isWordBoundary(end)) end++
    return [start, end]
  }, [currentIndex, chars])

  // Scroll current char into view smoothly
  useEffect(() => {
    if (!containerRef.current) return
    const el = containerRef.current.querySelector<HTMLSpanElement>(`span[data-idx="${currentIndex}"]`)
    if (el) {
      el.scrollIntoView({ block: "nearest", inline: "nearest" })
    }
  }, [currentIndex])

  return (
    <div className="rounded-lg border bg-background p-4 md:p-6">
      <div
        ref={containerRef}
        className="max-h-[40vh] overflow-auto leading-relaxed text-base md:text-lg selection:bg-primary/20"
      >
        {chars.map((ch, idx) => {
          const expected = ch
          const typedCh = typed[idx]
          const isTyped = idx < typed.length
          const isCorrect = isTyped ? typedCh === expected : false
          const isCurrent = idx === currentIndex
          const inCurrentWord = idx >= wordStart && idx < wordEnd

          let cls = ""
          if (isTyped) {
            cls += isCorrect ? " text-foreground" : " text-destructive"
          } else {
            cls += " text-muted-foreground/70"
          }
          if (inCurrentWord) cls += " bg-primary/5"
          if (isCurrent) cls += " border-b-2 border-primary"

          // Render non-breaking space for space character for visibility
          const display = ch === " " ? "\u00A0" : ch

          return (
            <span
              key={idx}
              data-idx={idx}
              className={cls}
            >
              {display}
            </span>
          )
        })}
        {/* Cursor at end when completed */}
        {currentIndex >= chars.length && (
          <span className="border-b-2 border-primary inline-block w-2" />
        )}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        {isActive ? "Typing enabled — go!" : "Press Start to begin"}
      </div>
    </div>
  )
}
