# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Stack

- **React 19** + **TypeScript** + **Vite 7**
- **React Router v7** (Framework Mode - Remix-style) for routing + SSG
- **Tailwind CSS v4** with custom scout/outdoor theme (`src/index.css`)
- **shadcn/ui** components in `src/components/ui/`
- **Fuse.js** for client-side fuzzy search

## Commands

```bash
npm run dev        # dev server with HMR (http://localhost:5173)
npm run build      # SSG build -> build/client/ (fetches API at build time)
npm run preview    # serve production build locally
npm run test       # run Vitest unit tests
npm run lint       # ESLint
```

## Project Structure

```
app/
  root.tsx          <- root HTML shell (Layout) + App (Outlet) + ErrorBoundary
  routes.ts         <- route definitions: index, :groupSlug, sprawnosc/:badgeSlug
  routes/
    home.tsx        <- / - loader fetches all groups, renders hero + category grid
    group.tsx       <- /:groupSlug - loader fetches group, renders badge list by stars
    badge.tsx       <- /sprawnosc/:badgeSlug - loader fetches badge + prerequisite
    about.tsx       <- /o-sprawnosciach - static info page
src/
  data/
    api.ts          <- fetchBadgeGroups(), getGroupBySlug(), getBadgeBySlug(), findPrerequisiteById() - singleton cache
    api.test.ts     <- unit tests for sort order and findPrerequisiteById
    types.ts        <- BadgeGroup, BadgeSpec, CATEGORY_NAMES/ICONS
    types.test.ts   <- unit tests for CATEGORY_NAMES/ICONS
    slugify.ts      <- Polish diacritics -> URL slug (a->a, l->l, n->n, etc.)
    search.ts       <- Fuse.js buildSearchIndex()
  components/
    layout/         <- Header.tsx, Footer.tsx
    ui/             <- shadcn/ui components (button, badge, input, card, separator)
    BadgeCard.tsx   <- badge list card with icon, name, stars, first requirement
    StarRating.tsx  <- 1-3 filled gold stars display
    CategoryBadge.tsx <- category pill (forest/earth colors)
    SearchBar.tsx   <- Fuse.js live search dropdown
  lib/utils.ts      <- cn() utility (clsx + tailwind-merge)
  index.css         <- Tailwind v4 @import + @theme (scout colors) + @layer base
react-router.config.ts <- ssr: true, prerender() -> all static paths
vite.config.ts      <- Vite + Vitest config (plugins, @/ alias, test environment)
```

## Key Patterns

- **Routing:** `app/routes.ts` defines routes via `@react-router/dev/routes` helpers
- **Data loading:** Each route exports `async function loader({ params })` - runs server-side/build-time
- **SSG:** `react-router.config.ts` exports `prerender()` returning all route paths; `npm run build` fetches API and pre-renders HTML
- **404 handling:** `throw data(null, { status: 404 })` in loaders -> caught by `ErrorBoundary` in `root.tsx`
- **Slugs:** Polish group/badge names -> ASCII slugs via `src/data/slugify.ts`
- **Icons:** `https://stamps.zhr.pl/img/form/{uuid.svg}` (from API `badgeIcons` field)
- **API:** `https://stamps.zhr.pl/api/badges` - fetched once, cached in module singleton `_cache`
- **Search:** Fuse.js client-side fuzzy search; `SearchBar` receives `groups` prop and builds index on mount
- **Categories:** API returns categories 1, 2, 3, 4, 6. `CATEGORY_NAMES`/`CATEGORY_ICONS` and `BadgeGroup.category` cover all values.
- **Prerequisite lookup:** `findPrerequisiteById(groups, id)` in `api.ts` searches across all groups (cross-group).
- **Import alias:** All imports from `app/routes/` to `src/` use the `@/` alias (e.g. `@/data/api`, `@/components/SearchBar`).

## TypeScript

Route types are auto-generated to `.react-router/types/app/routes/+types/*.ts` - run `npm run build` or `npm run dev` to regenerate after changing `app/routes.ts`.
