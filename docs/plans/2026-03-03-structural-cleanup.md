# Structural Cleanup Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Wyrównać strukturę projektu z zaleceniami React Router v7 Framework Mode, usunąć martwy kod i niespójności wprowadzone podczas migracji z Vike.

**Architecture:** Zachowujemy podział `app/` (routes) + `src/` (shared code), bo shadcn wymaga `src/components/ui/` wg `components.json`. Zamiast przenosić wszystko do `app/`, naprawiamy konkretne odchylenia: niespójne importy, luki typów po dodaniu kategorii 6, martwy kod i nieaktualne docs.

**Tech Stack:** React Router v7, TypeScript 5.9, Vitest 4, Fuse.js 7, Tailwind CSS v4, shadcn/ui

---

## Porównanie: aktualna vs zalecana struktura

| Aspekt | Zalecana (RR v7) | Aktualna | Status |
|--------|-----------------|----------|--------|
| Routes w `app/routes/` | ✅ | ✅ | OK |
| Shared code w `app/` | ✅ preferowane | `src/` (shadcn compat) | Akceptowalne |
| Import alias spójny | ✅ `@/` wszędzie | Mix `@/` i `../../src/` | **FIX** |
| Typy pokrywają API | ✅ | kategoria 6 brak w `CategoryBadge` | **FIX** |
| Brak `any` w źródle | ✅ | `group.tsx` (4x), `SearchBar.tsx` (1x) | **FIX** |
| Brak martwych exportów | ✅ | `CATEGORY_COLORS` nieużywane | **FIX** |
| Brak śmieciowych plików | ✅ | `src/assets/react.svg`, `public/vite.svg` | **FIX** |
| CLAUDE.md aktualny | ✅ | brak Vitest, kat. 6, findPrerequisiteById | **FIX** |
| Vitest config | w `vite.config.ts` | osobny `vitest.config.ts` | opcjonalnie |

---

## Task 1: Standaryzuj importy w `app/routes/*.tsx` → alias `@/`

**Cel:** Usunąć `../../src/` na rzecz `@/` we wszystkich plikach route (tak jak już w `about.tsx`).

**Files:**
- Modify: `app/routes/home.tsx`
- Modify: `app/routes/group.tsx`
- Modify: `app/routes/badge.tsx`

**Step 1: Zweryfikuj alias działa**

Upewnij się, że w `tsconfig.app.json` jest:
```json
"paths": { "@/*": ["./src/*"] }
```
i w `vite.config.ts`:
```ts
resolve: { alias: { '@': new URL('./src', import.meta.url).pathname } }
```
Oba powinny być już skonfigurowane.

**Step 2: Zamień importy w `app/routes/home.tsx`**

Stare → nowe:
```ts
// stare
import { fetchBadgeGroups } from '../../src/data/api'
import { CATEGORY_NAMES, CATEGORY_ICONS, type BadgeGroup } from '../../src/data/types'
import SearchBar from '../../src/components/SearchBar'
import CategoryBadge from '../../src/components/CategoryBadge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '../../src/components/ui/card'
import { Badge } from '../../src/components/ui/badge'

// nowe
import { fetchBadgeGroups } from '@/data/api'
import { CATEGORY_NAMES, CATEGORY_ICONS, type BadgeGroup } from '@/data/types'
import SearchBar from '@/components/SearchBar'
import CategoryBadge from '@/components/CategoryBadge'
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
```

**Step 3: Zamień importy w `app/routes/group.tsx`**

Stare → nowe:
```ts
// stare
import { data, Link } from 'react-router'
import type { Route } from './+types/group'
import { getGroupBySlug } from '../../src/data/api'
import BadgeCard from '../../src/components/BadgeCard'
import StarRating from '../../src/components/StarRating'
import CategoryBadge from '../../src/components/CategoryBadge'
import { Separator } from '../../src/components/ui/separator'

// nowe
import { data, Link } from 'react-router'
import type { Route } from './+types/group'
import { getGroupBySlug } from '@/data/api'
import BadgeCard from '@/components/BadgeCard'
import StarRating from '@/components/StarRating'
import CategoryBadge from '@/components/CategoryBadge'
import { Separator } from '@/components/ui/separator'
```

**Step 4: Zamień importy w `app/routes/badge.tsx`**

Stare → nowe:
```ts
// stare
import { getBadgeBySlug, fetchBadgeGroups, findPrerequisiteById } from '../../src/data/api'
import StarRating from '../../src/components/StarRating'
import CategoryBadge from '../../src/components/CategoryBadge'
import { Card, CardContent } from '../../src/components/ui/card'
import { Badge } from '../../src/components/ui/badge'

// nowe
import { getBadgeBySlug, fetchBadgeGroups, findPrerequisiteById } from '@/data/api'
import StarRating from '@/components/StarRating'
import CategoryBadge from '@/components/CategoryBadge'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
```

**Step 5: Uruchom lint + testy**

```bash
npm run lint && npm run test
```
Oczekiwane: 0 błędów, 6 testów green.

**Step 6: Commit**

```bash
git add app/routes/home.tsx app/routes/group.tsx app/routes/badge.tsx
git commit -m "refactor: standardize imports to @/ alias in all route files"
```

---

## Task 2: Napraw typ props `CategoryBadge` — dodaj kategorię 6

**Cel:** `CategoryBadge` przyjmuje `category: 1 | 2 | 3 | 4` ale po poprawce CR `BadgeGroup.category` to `1 | 2 | 3 | 4 | 6`. TypeScript zgłosi błąd przy przekazaniu grupy kategorii 6.

**Files:**
- Test: `src/components/CategoryBadge.test.tsx` (nowy)
- Modify: `src/components/CategoryBadge.tsx`

**Step 1: Napisz failing test**

Utwórz `src/components/CategoryBadge.test.tsx`:
```ts
import { describe, it, expect } from 'vitest'
import { CATEGORY_NAMES, CATEGORY_ICONS } from '@/data/types'

// CategoryBadge uses these constants internally.
// We test that all valid category values (including 6) have entries.
describe('CategoryBadge category support', () => {
  it('CATEGORY_NAMES has entry for every category accepted by CategoryBadge props', () => {
    const validCategories: Array<1 | 2 | 3 | 4 | 6> = [1, 2, 3, 4, 6]
    validCategories.forEach(c => {
      expect(CATEGORY_NAMES[c]).toBeDefined()
      expect(CATEGORY_ICONS[c]).toBeDefined()
    })
  })
})
```

**Step 2: Uruchom i zweryfikuj RED**

```bash
npm run test -- src/components/CategoryBadge.test.tsx
```
Oczekiwane: test PASS (bo typy już mamy) — jeśli PASS, przejdź do zmiany props.

> Uwaga: Właściwy "fail" dla tego tasku to błąd TypeScript. Weryfikacja jest przez `tsc`:
> ```bash
> npx tsc --noEmit
> ```
> Przed poprawką: błąd `Argument of type '1 | 2 | 3 | 4 | 6' is not assignable to parameter of type '1 | 2 | 3 | 4'`

**Step 3: Popraw Props w `CategoryBadge.tsx`**

Zmień:
```ts
// src/components/CategoryBadge.tsx, linie 4-7
interface Props {
  category: 1 | 2 | 3 | 4   // ← stare
  size?: 'sm' | 'md'
}
```
Na:
```ts
interface Props {
  category: 1 | 2 | 3 | 4 | 6
  size?: 'sm' | 'md'
}
```

**Step 4: Zweryfikuj GREEN**

```bash
npm run test && npx tsc --noEmit
```
Oczekiwane: 0 błędów TypeScript, wszystkie testy green.

**Step 5: Commit**

```bash
git add src/components/CategoryBadge.tsx src/components/CategoryBadge.test.tsx
git commit -m "fix: extend CategoryBadge props to accept category 6"
```

---

## Task 3: Usuń `any` w `group.tsx` — użyj `BadgeSpec`

**Cel:** `group.tsx` używa `(b: any)` i `(badge: any)` mimo że dane są typowane jako `BadgeSpec[]`.

**Files:**
- Test: `src/data/api.test.ts` (istniejący — sprawdza już dane)
- Modify: `app/routes/group.tsx`

**Step 1: Zidentyfikuj miejsca `any`**

W `app/routes/group.tsx`:
- Linie 39–41: `spec.badges.filter((b: any) => b.stars === 1/2/3)`
- Linia 112: `badgesByStars[stars].map((badge: any) => (`

**Step 2: Dodaj import `BadgeSpec` i usuń `any`**

Na początku pliku dodaj `BadgeSpec` do importu z `@/data/types` (po Task 1 będzie to `@/data/types`):
```ts
import type { BadgeGroup, BadgeSpec } from '@/data/types'
```

Zamień blok `badgesByStars`:
```ts
// stare (linie ~38-44)
const badgesByStars = {
  1: spec.badges.filter((b: any) => b.stars === 1),
  2: spec.badges.filter((b: any) => b.stars === 2),
  3: spec.badges.filter((b: any) => b.stars === 3),
} as Record<1 | 2 | 3, typeof spec.badges>

// nowe
const badgesByStars: Record<1 | 2 | 3, BadgeSpec[]> = {
  1: spec.badges.filter(b => b.stars === 1),
  2: spec.badges.filter(b => b.stars === 2),
  3: spec.badges.filter(b => b.stars === 3),
}
```

Zamień `(badge: any)` w mapie:
```ts
// stare (linia ~112)
{badgesByStars[stars].map((badge: any) => (

// nowe
{badgesByStars[stars].map((badge) => (
```

**Step 3: Zweryfikuj brak błędów TypeScript**

```bash
npm run test && npx tsc --noEmit
```
Oczekiwane: 0 błędów, 6 testów green.

**Step 4: Commit**

```bash
git add app/routes/group.tsx
git commit -m "refactor: replace any types with BadgeSpec in group.tsx"
```

---

## Task 4: Napraw `Fuse<any>` w `SearchBar.tsx`

**Cel:** `useRef<Fuse<any>>` traci bezpieczeństwo typów. Powinno być `Fuse<SearchDocument>`.

**Files:**
- Modify: `src/components/SearchBar.tsx`

**Step 1: Sprawdź eksport `SearchDocument`**

Otwórz `src/data/search.ts`. Funkcja `buildSearchIndex` zwraca `Fuse<SearchDocument>`. Sprawdź czy `SearchDocument` jest eksportowany — jeśli nie, dodaj `export` przed `interface SearchDocument`.

**Step 2: Zaimportuj `SearchDocument` i `Fuse` w `SearchBar.tsx`**

```ts
// Dodaj do istniejących importów w SearchBar.tsx:
import Fuse from 'fuse.js'
import type { SearchDocument } from '@/data/search'
```

**Step 3: Zamień typ `useRef`**

```ts
// stare (linia 18)
const fuseRef = useRef<Fuse<any> | null>(null)

// nowe
const fuseRef = useRef<Fuse<SearchDocument> | null>(null)
```

**Step 4: Zweryfikuj**

```bash
npm run test && npx tsc --noEmit
```

**Step 5: Commit**

```bash
git add src/components/SearchBar.tsx src/data/search.ts
git commit -m "refactor: replace Fuse<any> with Fuse<SearchDocument> in SearchBar"
```

---

## Task 5: Usuń martwy kod i śmieciowe pliki

**Cel:** Usunąć `CATEGORY_COLORS` (dead export, nigdzie nieimportowane), `src/assets/react.svg` i `public/vite.svg` (resztki scaffold Vite).

**Files:**
- Modify: `src/data/types.ts` (usuń CATEGORY_COLORS)
- Delete: `src/assets/react.svg`
- Delete: `public/vite.svg`
- Delete: `src/assets/` (katalog jeśli pusty)

**Step 1: Zweryfikuj że `CATEGORY_COLORS` jest naprawdę nieużywane**

```bash
grep -r "CATEGORY_COLORS" src/ app/
```
Oczekiwane: tylko `src/data/types.ts` (definicja). Żadnych importów.

**Step 2: Usuń `CATEGORY_COLORS` z `types.ts`**

Usuń blok (linie 38–43 przed zmianami, +1 po dodaniu kat. 6):
```ts
// usuń cały ten blok:
export const CATEGORY_COLORS: Record<number, string> = {
  1: 'bg-forest-700 text-parchment',
  2: 'bg-earth-700 text-parchment',
  3: 'bg-earth-500 text-parchment',
  4: 'bg-forest-600 text-parchment',
}
```

**Step 3: Zweryfikuj TypeScript nie narzeka**

```bash
npm run test && npx tsc --noEmit
```

**Step 4: Usuń śmieciowe pliki**

```bash
rm src/assets/react.svg
rmdir src/assets 2>/dev/null || true
rm public/vite.svg
```

**Step 5: Sprawdź że żaden plik nie importuje usuniętych zasobów**

```bash
grep -r "react.svg\|vite.svg" src/ app/ index.html
```
Oczekiwane: brak wyników.

**Step 6: Commit**

```bash
git add -A
git commit -m "chore: remove dead CATEGORY_COLORS export and Vite template assets"
```

---

## Task 6: Zaktualizuj `CLAUDE.md`

**Cel:** CLAUDE.md jest nieaktualny — nie zawiera informacji o Vitest, kategorii 6, `findPrerequisiteById`, trasie `/o-sprawnosciach`.

**Files:**
- Modify: `CLAUDE.md`

**Step 1: Zaktualizuj sekcję Commands**

Dodaj komendę `test`:
```markdown
## Commands

\```bash
npm run dev        # dev server with HMR (http://localhost:5173)
npm run build      # SSG build -> build/client/ (fetches API at build time)
npm run preview    # serve production build locally
npm run test       # run Vitest unit tests
npm run lint       # ESLint
\```
```

**Step 2: Zaktualizuj sekcję Project Structure**

Dodaj brakujące elementy:
- W `app/routes/` dodaj: `about.tsx  <- /o-sprawnosciach - static info page`
- W `src/data/` dodaj:
  - `api.ts  <- ..., findPrerequisiteById() - cross-group prerequisite lookup`
  - `api.test.ts   <- unit tests for sort order and findPrerequisiteById`
  - `types.test.ts <- unit tests for CATEGORY_NAMES/ICONS`
- Dodaj `vitest.config.ts` do plików konfiguracyjnych

**Step 3: Zaktualizuj sekcję Key Patterns**

Dodaj/zaktualizuj:
```markdown
- **Categories:** API zwraca kategorie 1, 2, 3, 4, 6. CATEGORY_NAMES/ICONS/BadgeGroup.category pokrywają wszystkie wartości.
- **Prerequisite lookup:** `findPrerequisiteById(groups, id)` w api.ts przeszukuje wszystkie grupy (cross-group).
- **Import alias:** Wszystkie importy z `app/routes/` do `src/` używają aliasu `@/` (np. `@/data/api`, `@/components/SearchBar`).
```

**Step 4: Commit**

```bash
git add CLAUDE.md
git commit -m "docs: update CLAUDE.md with Vitest, category 6, findPrerequisiteById, about route"
```

---

## Opcjonalnie: Task 7 — Scal `vitest.config.ts` z `vite.config.ts`

**Cel:** Uniknąć duplikacji konfiguracji aliasów. React Router v7 zaleca konfigurację Vitest w `vite.config.ts`.

> **Uwaga:** Wymaga `/// <reference types="vitest" />` na górze `vite.config.ts` oraz usunięcia `vitest.config.ts`.

**Files:**
- Modify: `vite.config.ts`
- Delete: `vitest.config.ts`

**Step 1: Zaktualizuj `vite.config.ts`**

```ts
/// <reference types="vitest" />
import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    reactRouter(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  test: {
    environment: 'node',
  },
})
```

**Step 2: Usuń `vitest.config.ts`**

```bash
rm vitest.config.ts
```

**Step 3: Zweryfikuj testy nadal działają**

```bash
npm run test
```
Oczekiwane: 6 testów green.

**Step 4: Commit**

```bash
git add vite.config.ts
git rm vitest.config.ts
git commit -m "refactor: merge vitest config into vite.config.ts"
```

---

## Kolejność wykonania

```
Task 1 (importy @/)
  └─> Task 2 (CategoryBadge props) — używa już @/ aliasów
      └─> Task 3 (group.tsx any) — wymaga @/data/types z Task 1
          └─> Task 4 (SearchBar Fuse<any>)
              └─> Task 5 (martwy kod)
                  └─> Task 6 (CLAUDE.md)
                      └─> Task 7 (opcjonalnie: vitest config)
```

**Czas:** ~30–60 min razem, każdy task to 5–15 min.
