# 🏗️ Architecture Overview

This document provides a comprehensive overview of the Visual Component Editor's architecture, design patterns, and system components.

⸻

## 📋 Table of Contents

1. [Component Rendering Pipeline](#1-component-rendering-pipeline)
2. [DOM-Based Visual Editing](#2-dom-based-visual-editing)
3. [DOM → JSX Serialization Engine](#3-dom--jsx-serialization-engine)
4. [Dynamic Component Compilation](#4-dynamic-component-compilation)
5. [State Management & Editing UX](#5-state-management--editing-ux)
6. [Storage System](#6-storage-system)
7. [Project Structure](#7-project-structure)
8. [Data Flow](#8-data-flow)

⸻

## 1. Component Rendering Pipeline

The component rendering pipeline is the core mechanism that transforms stored JSX code into live React components.

### Flow

```
Backend (Redis) → JSX String → Babel Compilation → React Component → Editor Canvas
```

### Steps

1. **Load JSX String from Backend**

   - Fetch component code from Redis using key: `component:{id}`
   - Returns raw JSX string

2. **Compile JSX → React Component**

   - Uses `@babel/standalone` to transform JSX
   - Configuration: `{ presets: ['react'] }`
   - Output: Compiled JavaScript code

3. **Render Inside Editor Canvas**
   - Component is wrapped in a safe container
   - Rendered using React's rendering system
   - Mounted to `userAppAreaRef` for DOM manipulation

### Code Location

- **Loading**: `components/editor-components/editor-provider.tsx` (lines 266-312)
- **Compilation**: `lib/editor/serializeStringToJsx.ts`
- **Rendering**: `components/user-components-loader.tsx`

⸻

## 2. DOM-Based Visual Editing

The editor provides a WYSIWYG (What You See Is What You Get) editing experience by directly manipulating the DOM.

### Interaction Model

#### Click Selection

- Single click on any element selects it
- Highlights element with overlay
- Shows element type and properties
- Locks bounding box for property editing

#### Double-Click Editing

- Double-click enters text-edit mode
- Enables `contentEditable` attribute
- Allows inline text editing
- Auto-disables on blur

#### Hover Feedback

- Mouse hover shows live selection overlay
- Visual feedback for interactive elements
- Helps identify editable regions

### Element Type Detection

The system automatically detects element types:

- **Text**: `p`, `span`, `h1-h6`, `label`, `strong`, `em`, `a`, etc.
- **Image**: `img`
- **Container**: `div`, `section`, `header`, `footer`, `article`, etc.
- **Button**: `button`
- **Input**: `input`, `textarea`, `select`
- **List**: `ul`, `ol`, `li`
- **Video**: `video`

**Location**: `lib/editor/utils.ts` - `getElementType()`

### Toolbar Controls

When a text element is selected, the toolbar provides:

- **Font Size**: `text-xs` through `text-9xl`
- **Font Weight**: `font-thin` through `font-black`
- **Font Style**: `italic` / `not-italic`
- **Text Decoration**: `underline`, `line-through`, `overline`
- **Text Alignment**: `text-left`, `text-center`, `text-right`, `text-justify`
- **Color**: Full Tailwind color palette

**Location**: `components/editor-components/properties-edit-controller.tsx`

⸻

## 3. DOM → JSX Serialization Engine

The serialization engine converts the live DOM back into valid JSX, enabling round-trip editing.

### Key Features

1. **Attribute Conversion**

   - `class` → `className`
   - Preserves data attributes
   - Removes editor-specific attributes (`contenteditable`, `data-editor-*`)

2. **Structure Preservation**

   - Maintains nested element hierarchy
   - Preserves text nodes
   - Handles self-closing tags

3. **Content Escaping**

   - Escapes HTML entities (`&`, `<`, `>`)
   - Preserves whitespace
   - Handles special characters

4. **Editor Element Filtering**
   - Skips overlay elements
   - Ignores editor UI components
   - Only serializes user content

### Serialization Process

```typescript
DOM Element → serializeElementToJsx() → JSX String → Wrapped in Component Function
```

### Code Structure

**Main Function**: `serializeRootToString()` in `lib/editor/serializeDomToString.ts`

**Process**:

1. Gets first child of editor wrapper (actual component root)
2. Recursively serializes each element
3. Wraps result in React component function
4. Returns complete JSX string

### Edge Cases Handled

- Empty elements → self-closing tags
- Text-only elements → inline text
- Mixed content → proper nesting
- Special characters → escaped entities

⸻

## 4. Dynamic Component Compilation

Runtime compilation allows the editor to execute user-generated JSX code safely.

### Compilation Process

```typescript
JSX String → Babel.transform() → Compiled Code → new Function() → React Component
```

### Implementation

**Location**: `lib/editor/serializeStringToJsx.ts`

```typescript
export function compileJsxToComponent(jsx: string) {
  const compiled = Babel.transform(jsx, {
    presets: ["react"],
  }).code;

  const Component = new Function("React", `${compiled}; return Component`)(
    React
  );

  return Component;
}
```

### Error Handling

- Invalid JSX → Component set to `"error"`
- Compilation failures → Error state displayed
- Runtime errors → Graceful fallback UI

⸻

## 5. State Management & Editing UX

The editor uses React Context API for global state management with local state for component-specific data.

### Editor Context

**Location**: `components/editor-components/editor-provider.tsx`

#### State Properties

- **Component**: Current rendered component or `"loading"` | `"error"`
- **editableMode**: Boolean for edit/preview toggle
- **activeElement**: Currently selected DOM element
- **elementType**: Type of selected element
- **lockedBoundingClients**: Fixed position data for selected element
- **saveState**: `{ dirty, saving, error, success }`
- **isResetting**: Loading state for reset operation

#### Key Methods

- `toggleEditableMode()`: Switch between edit and preview
- `setActiveElement()`: Update selected element
- `updateBoundingClients()`: Lock element position
- `saveComponentHandler()`: Serialize and save changes
- `resetToOriginalComponent()`: Restore original version

### UX Features

#### Visual Feedback

1. **Hover Overlay**

   - Blue border on hover
   - Shows element tag name
   - Real-time position updates

2. **Selected Element Overlay**

   - Fixed border for selected element
   - Stays visible during scrolling
   - Displays element metadata

3. **Loading States**

   - Spinner during component load
   - Loading indicator during save
   - Reset progress feedback

4. **Error States**
   - Error message display
   - Retry options
   - Fallback UI

#### Dirty State Tracking

- Tracks when component is modified
- Disables save button when no changes
- Shows visual indicator for unsaved changes
- Resets after successful save

**Location**: `hooks/use-typography.ts` (line 72)

⸻

## 6. Storage System

The application uses **Redis (Upstash)** for persistent component storage.

### Why Redis?

- ✅ Vercel serverless filesystem is read-only
- ✅ Redis provides persistent, global storage
- ✅ Fast reads/writes for component code
- ✅ Supports original version + edited version
- ✅ Scalable and reliable

### Storage Keys

#### Pattern

```
component:{id}              # Current/edited version
component:{id}:original     # Original backup version
```

#### Example

```
component:hero              # Editable version
component:hero:original     # Original backup
```

### Operations

#### Read

```typescript
const code = await redis.get(`component:${id}`);
```

#### Write

```typescript
await redis.set(`component:${id}`, jsxCode);
```

#### Check Existence

```typescript
const exists = await redis.exists(`component:${id}`);
```

### Configuration

**Location**: `lib/redis.ts`

```typescript
import { Redis } from "@upstash/redis";

export const redis = Redis.fromEnv();
```

**Environment Variables Required**:

- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

⸻

## 7. Project Structure

```
runnable-task/
├── app/
│   ├── api/
│   │   └── component/
│   │       ├── [id]/
│   │       │   └── route.ts          # GET, PUT endpoints
│   │       └── reset/
│   │           └── [id]/
│   │               └── route.ts     # POST reset endpoint
│   ├── layout.tsx                    # Root layout with Toaster
│   ├── page.tsx                     # Main editor page
│   └── globals.css                  # Global styles
│
├── components/
│   ├── editor-components/
│   │   ├── component-editor.tsx     # Main editor wrapper
│   │   ├── editor-provider.tsx      # Context provider
│   │   ├── element-overlay.tsx      # Selection overlays
│   │   ├── header.tsx               # Toolbar and controls
│   │   ├── properties-edit-controller.tsx  # Typography controls
│   │   └── edit-mode-toggle.tsx     # Edit/Preview toggle
│   ├── user-components/
│   │   └── hero.tsx         # Example component
│   ├── user-components-loader.tsx   # Component renderer
│   └── ui/                          # shadcn/ui components
│
├── hooks/
│   ├── use-element-tracker.ts       # DOM event handlers
│   ├── use-typography.ts            # Typography state
│   └── useComponentApi.ts          # API client
│
├── lib/
│   ├── editor/
│   │   ├── serializeDomToString.ts # DOM → JSX
│   │   ├── serializeStringToJsx.ts # JSX → Component
│   │   └── utils.ts                 # Element type detection
│   ├── redis.ts                     # Redis client
│   └── utils.ts                     # Utility functions
│
└── components.json                 # shadcn/ui config
```

⸻

## 8. Data Flow

### Component Load Flow

```
1. User visits page
   ↓
2. EditorProvider mounts
   ↓
3. useEffect triggers loadComponent()
   ↓
4. GET /api/component/:id
   ↓
5. Redis returns JSX string
   ↓
6. compileJsxToComponent() transforms JSX
   ↓
7. Component state updated
   ↓
8. React renders component
   ↓
9. User can now edit
```

### Save Flow

```
1. User makes edits (DOM changes)
   ↓
2. User clicks Save button
   ↓
3. saveComponentHandler() called
   ↓
4. serializeRootToString() converts DOM → JSX
   ↓
5. PUT /api/component/:id with JSX code
   ↓
6. Redis stores updated code
   ↓
7. Success toast shown
   ↓
8. Dirty state reset
```

### Reset Flow

```
1. User clicks Reset button
   ↓
2. resetToOriginalComponent() called
   ↓
3. POST /api/component/reset/:id
   ↓
4. Backend fetches original from Redis
   ↓
5. Backend overwrites main with original
   ↓
6. Returns original JSX code
   ↓
7. Frontend recompiles and re-renders
   ↓
8. Component restored to original state
```

⸻

## 🚀 Performance Optimizations

### Current Optimizations

- Memoized typography calculations
- Request animation frame for overlays
- Debounced save operations (via dirty state)

## 📚 Related Documentation

- [API Documentation](./API.md) - API endpoints and testing
- [README.md](./README.md) - Project overview and setup
