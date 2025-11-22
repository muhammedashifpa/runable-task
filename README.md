<p align="center">
  <h1 align="center">⚡ Visual Component Editor ⚡</h1>

  <p align="center">
    A real-time, inline UI editor built with Next.js, React 19, Tailwind, and shadcn/ui.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=nextdotjs" />
    <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.0-38BDF8?style=for-the-badge&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/shadcn-ui-000?style=for-the-badge" />
    <img src="https://img.shields.io/badge/Babel-standalone-F9DC3E?style=for-the-badge&logo=babel" />
  </p>

  <p align="center">
    <img src="https://img.shields.io/github/license/muhammedashifpa/runable-task?style=flat-square" />
    <img src="https://img.shields.io/github/last-commit/muhammedashifpa/runable-task?style=flat-square" />
    <img src="https://img.shields.io/github/languages/top/muhammedashifpa/runable-task?style=flat-square" />
  </p>
</p>

A Next.js–powered visual component editor that lets users click, edit, and save UI components in real time.
The editor converts DOM → JSX, compiles JSX back into React components, and syncs updates to the backend.

⸻

<h2>🎯 Features</h2>

<h3>✨ 1. Live Component Editing</h3>
• Double-click any text element to edit inline
• Click any element to inspect and style
• Automatic detection of element type
• Sandbox-style editing mode with real-time updates

<h3>✨ 2. Smart Serialization</h3>
• Takes live HTML DOM
• Serializes into clean JSX
• Compiles JSX back into a React component (safe + validated)
• Maintains classNames, text nodes, and structure

<h3>✨ 3. Toolbar Controls</h3>

Use the built-in toolbar to style your text:
• Font size
• Font weight
• Italic
• Text decoration
• Alignment
• Color

Everything updates immediately in the preview.

<h3>✨ 4. Component Lifecycle Actions</h3>

<h2>💾 Save Component</h2>
• Serializes the edited UI
• Sends PUT request to /api/component/[id]
• Shows loading, success toast, and error toast
• Tracks dirty state and disables Save unless changed

<h2>🔄 Reset to Original</h2>
• Restores the original version using /api/component/reset/[id]
• Recompiles JSX and refreshes editor state
• Use this to “undo everything”

<h2>👁 Preview Mode</h2>
• Disables editing mode
• Switch between Edit ↔ Preview instantly

<h3>✨ 5. Error-Resilient Architecture</h3>

The editor handles:
• Invalid JSX
• Missing component files
• Network failures
• Serialization errors
• Unexpected runtime crashes

Fallback modes: "loading" and "error" ensure graceful UI states.

⸻

<h2>📦 Tech Stack</h2>

Layer Technology
Framework Next.js 16
UI React 19, Tailwind CSS, shadcn/ui, Lucide Icons
State Context API + Local state
Notifications Sonner
JSX Compiler @babel/standalone
Storage File-based (text components) — easy to replace with KV/DB

⸻

<h2>📁 Project Structure</h2>

/app
/api
/component/[id]
route.ts # Load + Save component
/component/reset/[id]
route.ts # Reset component to original
/lib/editor
serializeDomToString.ts
serializeStringToJsx.ts
elements.ts
/context
EditorContext.tsx
/components
Toolbar.tsx
EditorCanvas.tsx
Spinner.tsx
/data
hero.txt
hero.original.txt

⸻

<h2>⚙️ How It Works</h2>

<h3>1. Load Component</h3>

`GET /api/component/:id`

Loads the component’s .txt file → compiles → mounts into editor.

<h3>2. Save Component</h3>

`PUT /api/component/:id`

Frontend serializes DOM → JSX → sends to backend.

<h3>3. Reset Component</h3>

`POST /api/component/reset/:id`

Copies id.original.txt → id.txt and returns fresh JSX.

⸻

<h2>🧩 Editor Context Capabilities</h2>

<h3>The EditorContext exposes:</h3>
• Component — current rendered component or "loading" | "error"
• editableMode
• saveState → { dirty, saving, error, success }
• resetToOriginalComponent()
• saveComponentHandler()
• activeElement + elementType
• lockedBoundingClients
• userAppAreaRef
• toggleEditableMode()

⸻

<h2>🛠 Development</h2>

<h3>Install dependencies</h3>

`pnpm install`

<h3>Run dev server</h3>

`pnpm dev`

<h3>Build for production</h3>

`pnpm build`

⸻

<h2>🧪 API Testing With Curl</h2>

<h3>Restore a component:</h3>

`curl -X POST http://localhost:3000/api/component/reset/hero`

⸻

<h2>🚧 Roadmap</h2>
• Add Upstash Redis or Vercel Blob storage
• Multi-component editing support
• Component version history
• Drag & drop layout editing
• Cloud sync
• Reusable style presets

⸻

```

```
