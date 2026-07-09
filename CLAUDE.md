# FinAI Frontend

This is the **frontend** repo (React 19 + Vite 7 + TypeScript + Tailwind v4). It is one
of two separate git repos in the FinAI project; the backend is a sibling `../backend/`
repo (`Leongt1/go_backend`). This repo is `Leongt1/FinAI` and auto-deploys to Vercel
production on `main`.

**Full project context, architecture, and the complete React coding rules live in
`../00-about.md`** (the single source of truth for the whole project). Read it first.
If you only have this repo checked out, ask for that file.

## Must-follow basics (see `../00-about.md` for the full set)

- **Verify before committing:** `npm run build && npm run lint` - both must be 0 errors.
- **Never work on `main`** (it auto-deploys to Vercel prod). Branch per task
  (`feature/<name>` or `fix/<name>`), push, open a PR with `gh pr create`; the user
  reviews and merges. Work is issue-driven - backlog is GitHub issues on `Leongt1/FinAI`;
  reference `Closes #N` in the PR.
- **Data flow:** `types/index.ts -> api/<feature>.ts -> hooks/use<Feature>.ts -> pages/ + components/`.
  Components consume hooks only - never call `api/` functions or axios directly.
- **Styling:** theme tokens only (`bg-surface`, `text-text-muted`, `text-expense`,
  `border-border`, ...). Never raw Tailwind palette colors (`bg-gray-200`) or hex in
  components - that is what keeps the light/dark switch feasible. Income = green, expense = red.
- **Types:** every request/response shape is an interface in `types/index.ts` matching
  backend JSON (snake_case). No `any`, no non-null assertions (`!`) - both are lint errors.
- **Money** is decimal rupees (`number`) over the wire; format only at display.
- Reuse existing components before creating new ones (`ConfirmDialog`, `TitleText`,
  `CalendarInput`, `CategoryDropdown`, `TransactionModal`, `DashboardLayout`).
- No AI attribution in commits/PRs. Use `-`, never em/en dashes.

See `../00-about.md` for the full React rules, API surface, routes, theme tokens, and
current project state.
