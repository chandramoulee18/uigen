# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

UIGen is an AI-powered React component generator. Users describe components in natural language, Claude generates code using tool calls, and a live iframe preview renders the result in real-time. All file operations are in-memory (no disk writes).

## Commands

```bash
npm run setup        # Install deps + Prisma generate + migrate (first-time setup)
npm run dev          # Start dev server with Turbopack on http://localhost:3000
npm run build        # Production build
npm run test         # Run Vitest tests
npm run lint         # ESLint
npm run db:reset     # Reset Prisma migrations
```

Run a single test file:
```bash
npx vitest run src/path/to/file.test.ts
```

Environment: copy `.env.example` to `.env` and set `ANTHROPIC_API_KEY`. Without it, the app falls back to a `MockLanguageModel` that generates demo components.

## Architecture

### Request Flow

1. User submits a prompt in `ChatInterface`
2. POST to `/api/chat/route.ts` with messages + serialized VirtualFileSystem
3. Claude receives tool definitions (`str_replace_editor`, `file_manager`) and generates code
4. Tool calls update the `VirtualFileSystem` (in-memory)
5. React Context broadcasts file changes → `FileTree` and `CodeEditor` re-render
6. `PreviewFrame` detects changes, transforms JSX with import maps, and re-renders the iframe
7. For authenticated users, `onFinish` persists to Prisma (project = messages + serialized FS)

### Key Abstractions

**`VirtualFileSystem`** (`src/lib/file-system.ts`) — In-memory file tree. No disk I/O. Serializable for DB storage. All AI-generated files live here.

**Tool System** (`src/lib/tools/`) — Defines the tools Claude can call:
- `str_replace_editor` — create/update files with string replacements
- `file_manager` — rename/delete files

**Provider Selection** (`src/lib/provider.ts`) — Returns `anthropic("claude-sonnet-4-5")` when `ANTHROPIC_API_KEY` is set, otherwise returns `MockLanguageModel`.

**Prompt Caching** (`src/lib/prompts/`) — System prompt uses Anthropic ephemeral `cacheControl` to reduce latency and cost.

**JSX Transform** (`src/lib/transform/`) — Converts App.jsx imports to ESM import map URLs so the iframe can execute React code without a bundler.

### Context Providers

- `FileSystemProvider` (`src/lib/contexts/file-system-context.tsx`) — Holds VirtualFileSystem state, exposes file CRUD operations
- `ChatProvider` (`src/lib/contexts/chat-context.tsx`) — Wraps Vercel AI SDK's `useChat`, manages streaming state

### Auth

JWT sessions via `jose`, stored in HTTP-only cookies. `src/middleware.ts` verifies sessions on protected routes. Passwords hashed with `bcrypt`. Anonymous users get work tracked in localStorage via `src/lib/anon-work-tracker.ts`.

### Database

Prisma with SQLite (`prisma/dev.db`). Two models: `User` and `Project`. `Project.data` stores the serialized VirtualFileSystem; `Project.messages` stores chat history.

### Page Structure

- `/` (`src/app/page.tsx`) — Redirects authenticated users to their latest project; shows anonymous workspace otherwise
- `/[projectId]` (`src/app/[projectId]/page.tsx`) — Loads a saved project for authenticated users
- `src/app/main-content.tsx` — Layout orchestrator: `ChatPanel` (35%) + editor/preview tabs (65%)

### Path Alias

`@/*` maps to `./src/*` (configured in `tsconfig.json`).
