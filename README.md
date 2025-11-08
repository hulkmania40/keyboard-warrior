### Keyboard‑Warrior

A beautiful, minimal single‑player typing test app that tracks speed (WPM), accuracy, and time. Built with React + TypeScript, Vite, Tailwind CSS, and shadcn/ui.

> Live typing experience with Start/Pause/Restart controls, auto‑scrolling text, highlighted current word and caret, plus a results dialog when finished.

---

### Features
- Realtime stats
  - WPM: `(correctChars / 5) / minutes`
  - Accuracy: `(correctChars / totalTyped) × 100` (defaults to 100% before typing)
  - Elapsed time
- Typing UX
  - Auto‑scrolls the text as you type
  - Highlights the current word and the current character (caret underline)
  - Difficulty selector: Easy, Medium, Hard
  - Start, Pause, Restart controls
- Results summary dialog at completion
- Accessible focus handling: clicking the typing area refocuses the hidden input for seamless typing
- Clean, minimal UI using shadcn/ui components

---

### Tech stack
- React 19 + TypeScript
- Vite 7
- Tailwind CSS 4
- shadcn/ui + Radix UI (Button, Card, Dialog, Progress, Select)
- class-variance-authority, tailwind-merge

---

### Getting started

#### Prerequisites
- Node.js ≥ 18 (recommended LTS)
- One of the package managers below
  - Bun (bun.lock present) or
  - npm / pnpm / yarn

#### 1) Install dependencies
- With Bun:
```bash
bun install
```
- With npm:
```bash
npm install
```

#### 2) Run the dev server
- With Bun:
```bash
bun run dev
```
- With npm:
```bash
npm run dev
```
Then open http://localhost:5173 (or the port shown in your terminal).

#### 3) Build for production
- With Bun:
```bash
bun run build
```
- With npm:
```bash
npm run build
```

#### 4) Preview the production build
- With Bun:
```bash
bun run preview
```
- With npm:
```bash
npm run preview
```

#### 5) Lint (optional)
```bash
npm run lint
```

---

### How to use
1. Choose a difficulty from the dropdown (Easy / Medium / Hard).
2. Click Start — the timer begins and the hidden input is focused automatically.
3. Type the displayed text. The current word gets a subtle background and the current character has an underline caret.
4. Press Pause to stop the timer; Start to resume; Restart to reset the session.
5. When you finish all characters, a results dialog opens with your WPM, Accuracy, and Time.

Notes
- Typing and backspace only affect state while the test is running.
- Clicking anywhere in the typing card refocuses the hidden input if focus is lost.

---

### Project structure
```
D:/keyboard-warrior
├─ src/
│  ├─ App.tsx                    # Renders the TypingTest page
│  ├─ pages/
│  │  └─ TypingTest.tsx         # Main typing test screen and state management
│  ├─ components/
│  │  ├─ TypingArea.tsx         # Renders paragraph, highlights current word/char, auto-scroll
│  │  ├─ TypingControls.tsx     # Start, Pause, Restart + timer label
│  │  ├─ StatsBar.tsx           # WPM, Accuracy, Time, and progress bar
│  │  └─ ui/                    # shadcn/ui primitives (button, card, dialog, progress, select)
│  ├─ utils/
│  │  └─ const.ts               # Easy/Medium/Hard text strings
│  └─ index.css / App.css       # Tailwind styles
├─ index.html
├─ package.json                  # Scripts: dev, build, preview, lint
├─ vite.config.ts
├─ tailwind / config via @tailwindcss/vite
└─ README.md
```

---

### Core logic at a glance
- Stats formulas
  - WPM: `(correctChars / 5) / minutes`
  - Accuracy: `(correctChars / totalTyped) × 100`
- Hidden input pattern
  - The app uses a visually hidden input (out of tab order via `tabIndex={-1}`) to capture keystrokes.
  - Input remains enabled; the typing handler guards updates via `isRunning`.
  - Clicking the typing area re‑focuses the input for a smooth experience.

---

### Customization
- Change the typing texts in `src/utils/const.ts`:
```ts
export const EASY_TEXT = "..."
export const MEDIUM_TEXT = "..."
export const HARD_TEXT = "..."
```
- Replace with your own text pools, or wire to an API for dynamic content.
- Styling is Tailwind‑based — tweak utility classes or theme tokens as needed.

---

### Screenshots / Demo
Add your screenshots or a short GIF here to showcase the typing flow.

- `docs/screenshot-typing.png`
- `docs/demo.gif`

> Tip: Licecap or ScreenToGif works well for quick demos.

---

### Accessibility
- Focus management: Starting or clicking the typing area programmatically focuses the hidden input.
- Live region: The timer label uses `aria-live` for polite updates.
- Color contrast: Uses Tailwind and shadcn/ui defaults; verify with your theme.

---

### Scripts
- `dev`: start Vite dev server
- `build`: type‑check and build
- `preview`: preview the production build
- `lint`: run ESLint

---

### Acknowledgements
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vite.dev/)

---

### License
This project is released under the MIT License. See `LICENSE` (add one if missing).

---

### Roadmap ideas
- Timed tests (e.g., 1/3/5 minutes)
- Word‑mode vs paragraph‑mode
- History and leaderboard (local storage or backend)
- Theme toggle (light/dark)
- Mobile optimizations

---

### Contributing
Contributions are welcome! Please open an issue or PR.

---

### Maintainer
Keyboard‑Warrior • Updated on 2025‑11‑09
