# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A full-stack app for tracking student conduct violations: student profiles, violation records (Minor/Major severity), stats/trend dashboards, and admin-only user role management. React/Vite frontend, Express/MongoDB backend, JWT auth.

## Commands

Run from the repo root unless noted.

- `npm run dev` — runs frontend (Vite, port 8080) and backend (`server/`, via nodemon+ts-node) together with `concurrently`.
- `npm run dev:frontend` / `npm run dev:server` — run just one side.
- `npm run build` / `npm run build:dev` — Vite production / development-mode build.
- `npm run lint` — ESLint over the frontend.
- `npm run preview` — preview the built frontend.

Backend-only (from `server/`):
- `npm run dev` — nodemon + ts-node on `server.ts`.
- `npm run build` — `tsc` to `dist/`.
- `npm start` — run the compiled `dist/server.js`.

There is no test suite in this repo currently.

### Environment

Backend needs a `server/.env` with:
```
MONGO_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
PORT=5000
```
Frontend reads `VITE_API_BASE_URL` (falls back to `http://localhost:5000/api` if unset).

## Architecture

**Two independent npm packages, not an npm workspace.** The repo root *is* the frontend package (Vite/React/shadcn, deps in root `package.json`); `server/` is a separate Node package with its own `package.json`/`node_modules`/`tsconfig.json`. There's no dev proxy between them — the frontend talks to the backend over plain HTTP using an absolute `API_BASE` URL, and CORS is wide open (`cors()` with no options) on the Express side.

**No shared API client.** Each frontend component/page that needs the backend independently redeclares `const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"` and calls `fetch`/`axios` directly (e.g. `src/components/auth/Login.tsx`, `src/components/dashboard/Dashboard.tsx`, `src/components/layout/Header.tsx`, `src/components/students/*`, `src/components/users/UserRolesModal.tsx`). When adding a new API call, follow this existing per-component pattern rather than introducing a central client — that would be a larger refactor than any single feature warrants.

**Auth**: JWT-based, no server sessions. `server/routes/auth.ts` issues a token (`{id, username, role}`, 7-day expiry) on login; the frontend stores it in `localStorage` under `token` and reads it directly (`src/App.tsx`) to gate routes client-side via `ProtectedRoute`/`PublicRoute` — there's no auth context/provider, just a module-level `localStorage.getItem("token")` read at app load. Backend route protection is via two composable Express middlewares in `server/middleware/auth.ts`: `authMiddleware` (verifies JWT, populates `req.user`) and `requireAdmin` (checks `req.user.role === "admin"`), applied per-route (`router.post("/", authMiddleware, requireAdmin, ...)`).

**Roles**: `User.role` is `"admin" | "general"` (see `server/models/User.ts`). Admins can create/edit/delete violations and manage other users' roles (`server/routes/users.ts`); general users have read-only access to the shared violation pool. Role changes are blocked for a user acting on their own account (see `users.ts`'s self-role-change guard).

**Data model** (`server/models/`): `Student` (has a `studentId` business key distinct from Mongo `_id`, and a `user` ref), `Violation` (references a `Student` by `studentId` string, not ObjectId, and carries `severity: "Minor"|"Major"` plus a `resolved` boolean), `User`. Violations are a shared pool across all users — not scoped per-student in the DB, filtering by student happens in queries/frontend.

**File uploads**: profile pictures go through `multer` (`server/routes/students.ts`, `server/routes/profile.ts`) with a 2MB limit and image-mimetype filter, written to `../uploads/` relative to `server/`, and served statically at `/uploads` by `server.ts`. The `uploads/` directory lives at the repo root.

**Frontend structure**: feature-folder layout under `src/components/` (`auth/`, `dashboard/`, `students/`, `users/`, `violations/`, `layout/`, `theme/`), plus `src/components/ui/` for the full shadcn/ui primitive set (don't hand-edit these unless intentionally customizing a primitive — regenerate/add via shadcn conventions instead). Path alias `@/*` → `src/*` (configured in `tsconfig.json`/`tsconfig.app.json` and mirrored in `vite.config.ts`, `components.json`).

**TypeScript strictness differs by side**: the frontend (`tsconfig.app.json`) has `strict: false` and most strict-family checks disabled (lovable.dev scaffold defaults). The backend (`server/tsconfig.json`) has `strict: true`. Don't assume frontend type errors will surface the way they would in a strict project.

## Notes

- `vite.config.ts` conditionally loads `lovable-tagger`'s `componentTagger` in development mode — this project originated from/is synced with lovable.dev; expect some scaffold-y patterns (e.g. permissive tsconfig) as a result.
- The Vite dev server binds `host: "::"` (all interfaces) on port 8080.
