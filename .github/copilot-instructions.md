## Quick orientation for AI coding agents

This is a Next.js 13 (App Router) frontend using TypeScript, Tailwind CSS and a small design-system of local UI primitives. Keep responses focused, actionable, and reference exact files when suggesting edits.

- Project entry: `src/app/layout.tsx` mounts the app-wide fonts and wraps pages with `ClientLayout` (`src/app/ClientLayout.tsx`). The home route redirects to `/login` (`src/app/page.tsx`).
- Routing: App Router (files under `src/app`). Add new pages by creating folders/files under `src/app` (e.g. `src/app/users/page.tsx`).

- UI primitives: `src/components/ui/*` contains reusable components (e.g. `sidebar.tsx`, `button.tsx`, `table.tsx`). Prefer updating or composing these primitives rather than duplicating styles.
- App shell: `ClientLayout` wraps most routes with `SidebarProvider` and `NavBar` — see `src/app/ClientLayout.tsx` and `src/components/AppSidebar.tsx`. Auth pages (`/login`, `/register`) intentionally skip the shell.

- Styling: Tailwind v4 is used with CSS tokens in `src/app/globals.css`. Use the `cn` helper in `src/lib/utils.ts` to merge classes safely.
- Images: static assets live in `public/` and are referenced with `next/image` (see `src/components/AppSidebar.tsx`).

- Conventions & patterns

  - Path alias `@/*` is configured in `tsconfig.json`. Use `@/` for internal imports (e.g. `@/components/ui/button`).
  - Client components must use `"use client"` at the top (see `src/components/ui/sidebar.tsx` and `src/components/DataTable.tsx`). Server components should omit it.
  - Side-effects, browser-only hooks and event listeners belong in client components (e.g. keyboard shortcuts in `sidebar.tsx`).
  - Small stateful providers (SidebarProvider) live alongside UI primitives; prefer using them rather than creating parallel contexts.

- Important files to reference when editing UI or layout

  - App shell & routing: `src/app/layout.tsx`, `src/app/ClientLayout.tsx`, `src/app/page.tsx`
  - UI primitives: `src/components/ui/sidebar.tsx`, `src/components/ui/button.tsx`, `src/components/ui/table.tsx`
  - Pages & examples: `src/app/users/page.tsx`, `src/app/login/page.tsx`, `src/app/register/page.tsx`
  - Utilities: `src/lib/utils.ts` (class merging), `src/hooks/use-mobile.ts`

- Developer workflows (commands discovered in `package.json`)

  - Start dev server (Turbopack): `npm run dev` (uses `next dev --turbopack`).
  - Build: `npm run build` (`next build --turbopack`) then `npm run start` to serve.
  - Lint: `npm run lint` (runs `eslint`).
  - Dev server serves at http://localhost:3000; note: the root redirects to `/login` by design.

- Integration & deps

  - Key libraries: `@tanstack/react-table` (data tables), Radix primitives (`@radix-ui/*`) for accessibility, `lucide-react` for icons, `tailwind-merge` + `clsx` via `src/lib/utils.ts`.
  - No backend or API wiring is present in this frontend folder — expect mock/local data in pages or to add API routes under `src/app/api` if needed.

- How to modify safely (examples)
  - To add a new top-level page: create `src/app/feature/page.tsx`. If it requires browser hooks or providers, add `"use client"` to the file.
  - To change sidebar items: edit `src/components/AppSidebar.tsx` (menu items are defined in the `items` array).
  - To extend a primitive (e.g. button): update `src/components/ui/button.tsx` and adjust consumers across `src/components/*`.

When unsure, include a short code diff referencing the exact file path and explain why the change is safe (preserve accessibility & existing providers). Ask clarifying questions only if a change would affect routing, global CSS tokens, or the banner/app-shell behavior.

---

If any of these sections are unclear or you want more examples (tests, specific page flows), tell me which part to expand and I will iterate.
