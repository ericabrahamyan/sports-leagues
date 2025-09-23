# Sports Leagues

A lightweight React + Vite app that lists **all leagues**, supports **search + sport filter** with **inline highlighting**, and shows **season badges** when a card expands. Data fetching, caching, prefetch, and reload persistence are powered by TanStack React Query.

## Table of contents

- [AI assistance & time](#ai-assistance--time)
- [Folder structure](#folder-structure)
- [Notable patterns](#notable-patterns)
- [Tools & libraries](#tools--libraries)
- [Getting started](#getting-started)
- [React Compiler (RC) setup](#react-compiler-rc-setup)
- [Data freshness & persistence (required)](#data-freshness--persistence-required)
- [Architecture & data flow](#architecture--data-flow)
- [Assignment mapping](#assignment-mapping)
- [Testing](#testing)
- [Scripts](#scripts)
- [Useful links](#useful-links)

---

## AI assistance & time

**AI usage:** OpenAI ChatGPT (**GPT-5**) and Anthropic **Claude** assisted with README drafting, API/React Query configuration reviews and test scaffolding ideas. All code changes were reviewed and finalized manually.

- **Requirement implementation:** \~1.5 h
- **Additional features:** \~1 h
- **Polish (styles, a11y, README):** \~.5 h
- **Total:** \~3h

---

## Folder structure

```text
.
├─ .claude/                         # AI tool settings (local)
├─ .husky/                          # Git hooks (pre-commit, etc.)
├─ public/                          # Static assets served at root (/)
│  ├─ favicon.ico
│  └─ sporty-logo.png
├─ src/
│  ├─ api/                          # API client, schemas & types
│  │  └─ leagues/                   # TheSportsDB integration (all leagues, details)
│  ├─ components/                   # UI (Header, Hero, Leagues, cards, grid, filters, toaster)
│  ├─ hooks/                        # Data/state hooks (useLeagues, useSeasonBadges)
│  │  └─ __tests__/                 # Hook tests
│  ├─ utils/                        # Helpers (filtering, highlighting, response validation)
│  ├─ test/                         # Test setup (vitest + RTL)
│  ├─ providers.tsx                 # Chakra + React Query (+ persistence)
│  ├─ App.tsx / App.test.tsx        # App shell + tests
│  └─ main.tsx                      # App entry
├─ index.html                       # Vite HTML entry
├─ vite.config.ts                   # Vite config (React, alias, React Compiler)
├─ tsconfig*.json                   # TS project configs
├─ eslint.config.js                 # ESLint v9 flat config
├─ .prettierrc / .prettierignore    # Prettier config
├─ .nvmrc                           # Node version pin
├─ .env.example                     # Example env vars
└─ README.md                        # You are here
```

---

## Notable patterns

- **Feature folders**: `src/api/leagues/*` keeps client, schema, and types together.
- **UI decomposition**: `LeagueCard`, `LeagueFilters`, `LeagueGrid`, plus a page wrapper `Leagues`.
- **Hooks encapsulate data**:
  - `src/hooks/useLeagues.ts` — fetch the full list once and filter locally by search/sport.
  - `src/hooks/useSeasonBadges.ts` — fetch per league on expand; **prefetch** on hover/focus/touch.

- **Search highlighting**: matching text is emphasized inline while typing (see `src/utils/highlight.tsx`, used by `LeagueCard`).
- **Providers**: `src/providers.tsx` centralizes Chakra and React Query, enables **cache persistence** and a **version buster** for freshness.
- **Zod soft-parse + logging**: responses are validated without hard failures; mismatches are logged for visibility (see `src/utils/validateResponse.ts`).

---

## Tools & libraries

**Core**
React 19 with **React Compiler (RC)**, Vite 7 with `@vitejs/plugin-react`, TypeScript 5.8.

**UI**
Chakra UI 3 (including modern Select via `createListCollection`), `react-icons`.

**Data**
TanStack **React Query v5** for fetching, caching, background revalidation, and **prefetch**. Persisted with `@tanstack/react-query-persist-client` + `@tanstack/query-async-storage-persister` and **localforage** (IndexedDB).

**API & validation**
`axios` client (`src/api/index.ts`), **Zod** schemas (`src/api/leagues/leagues.schema.ts`), soft-validate & log (`src/utils/validateResponse.ts`).

**Quality**
ESLint v9, Prettier 3, Husky + lint-staged.
**Testing**: Vitest 3 + Testing Library + JSDOM (setup in `src/test/setup.ts`).

---

## Getting started

- Use the Node version in `.nvmrc`.
- Install: `npm install`.
- Run: `npm run dev`.
- (Optional) Config: copy `.env.example` to `.env` and set `VITE_API_BASE_URL` if you want to override the default TheSportsDB base URL. Restart the dev server after changes.

---

## React Compiler (RC) setup

Enabled in `vite.config.ts`. The compiler reduces the need for manual `useMemo`/`useCallback`/`React.memo` for typical prop/function stability within React. Keep explicit memoization only when a third-party integration depends on identity outside React’s lifecycle.

---

## Data freshness & persistence (required)

- **Persisted cache with deploy-time buster**: `src/providers.tsx` persists the React Query cache to IndexedDB and ties a buster to `package.json` version, invalidating old caches on new releases.
- **Always revalidate the leagues list on mount**: `useLeagues` shows hydrated data instantly, then background-refreshes whenever the view remounts.
- **Long-lived details**: `useSeasonBadges` uses a long freshness window and infinite in-memory GC (badges change rarely), keeping expand interactions instant.
- **Prefetch on intent**: `LeagueCard` prefetches season badges on hover/focus/touch to minimize perceived latency.

---

## Architecture & data flow

- **API layer**: `src/api/index.ts` (client), `src/api/leagues/leagues.api.ts` (endpoints), Zod schemas in `src/api/leagues/leagues.schema.ts`, and TS types in `leagues.types.ts`. Soft validation & logging live in `src/utils/validateResponse.ts`.
- **Queries**: `['leagues']` for the list; `['season-badges', leagueId]` for details per league.
- **UI flow**: `LeagueFilters` manages search/sport; `LeagueGrid` renders the list; `LeagueCard` expands to show the badge/logo; **search matches are highlighted inline** via `highlight.tsx`.

---

## Assignment mapping

- **All Leagues list**: `src/api/leagues/leagues.api.ts` (+ schemas/types).
- **Search + Filter + Highlighting**: `useLeagues` + `filterLeagues` + `highlight.tsx`, UI in `LeagueFilters.tsx`.
- **Season Badge on click**: `useSeasonBadges` + `LeagueCard.tsx` (expanded view).
- **Performance**: React Query caching, **prefetch**, persistent cache with version buster, and React Compiler.

---

## Testing

- **Hooks**: `src/hooks/__tests__/useLeagues.test.tsx`, `src/hooks/__tests__/useSeasonBadges.test.tsx`.
- **Recommended additions**: utility tests for `filterLeagues` and `highlightText`, and a small component test for `LeagueCard` prefetch behavior.

---

## Scripts

- `dev` — start Vite dev server
- `build` — type-check + production build
- `preview` — preview the production build
- `test` — run Vitest suite
- `lint` — ESLint
- `format` / `format:check` — Prettier

---

## Useful links

- React — [https://react.dev](https://react.dev)
- Vite — [https://vitejs.dev](https://vitejs.dev)
- Chakra UI — [https://chakra-ui.com](https://chakra-ui.com)
- TanStack Query — [https://tanstack.com/query/latest](https://tanstack.com/query/latest)
- Axios — [https://axios-http.com](https://axios-http.com)
- Zod — [https://zod.dev](https://zod.dev)
- Vitest — [https://vitest.dev](https://vitest.dev)
- Testing Library — [https://testing-library.com](https://testing-library.com)
- TheSportsDB — [https://www.thesportsdb.com/documentation](https://www.thesportsdb.com/documentation)
