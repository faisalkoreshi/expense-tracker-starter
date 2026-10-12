# AGENTS.md

## Project

Vite + React 19 single-page expense/finance tracker (plain JS/JSX, no TypeScript). Starter project for a course — the code is intentionally messy and buggy (see README).

## Commands

- `npm run dev` — Vite dev server on http://localhost:5173
- `npm run build` — production build to `dist/` (gitignored build output)
- `npm run lint` — ESLint 9 flat config; the **only** static check available
- Package manager is **npm only** (`package-lock.json`, lockfileVersion 3). No yarn/pnpm.
- There is **no test framework and no typecheck script**. `@types/react*` are devDeps but no `tsconfig`/`tsc` exists. After changes, run `npm run lint` and verify in the dev server manually.

## Architecture

- All persistent state lives in `src/App.jsx`: `transactions` (seeded with 8 hard-coded rows) and the two filter values. Child components (`Summary`, `TransactionForm`, `TransactionList`, `ConfirmDialog`) are presentational and receive data/callbacks via props.
- Data flows down through props: add via `TransactionForm`'s `onSubmit` → `handleAddTransaction` (which assigns `id: Date.now()`), delete via `TransactionList`'s `onDelete` → `handleDeleteTransaction`. `Summary` derives totals from `transactions`, never holds its own copy.
- Transient UI-only state stays local to components (e.g. `pendingDeleteId` in `TransactionList.jsx`, form fields in `TransactionForm.jsx`). Anything that must survive re-render or be shared belongs in `App.jsx`.
- `TransactionList` filters rows locally; `Summary` always totals the **full** unfiltered list.

## Gotchas

- Seed data in `src/App.jsx` contains the intentional course bug (e.g. `{ description: "Freelance Work", amount: 800, type: "expense" }` — wrong `type`). Do not treat seed rows as correct data; the bug is meant to be found and fixed.
- `amount` is a **string** in seed rows but a **Number** from `TransactionForm`. Always coerce with `Number(t.amount)` before arithmetic (pattern in `src/Summary.jsx`).
- Styling is a single global `src/App.css` imported separately by each component. No CSS modules, no Tailwind. The existing aesthetic is flat/minimal (solid `#333`/`#eee`, no border-radius/shadows) — reuse existing classes like `.delete-btn` instead of inventing parallel ones.
- ESLint (`eslint.config.js`): `no-unused-vars` is an error with `varsIgnorePattern: '^[A-Z_]'`; `dist` is globally ignored.
- Past feature plans are stored under `.kilo/plans/` (e.g. `1791779164279-delete-transaction-confirmation.md`) and are useful references for how changes are scoped.
