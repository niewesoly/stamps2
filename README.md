# Stamps – Odkryj swój szlak

Aplikacja webowa do przeglądania i wyszukiwania sprawności harcerskich ZHR.

## 🚀 Stack technologiczny

- **React 19** + **TypeScript**
- **React Router v7** (Framework Mode) – routing + SSG
- **Tailwind CSS v4** – stylowanie
- **shadcn/ui** – komponenty UI
- **Fuse.js** – wyszukiwarka fuzzy
- **Vite 7** – build tool + dev server
- **Vitest** – testy jednostkowe

## 📦 Instalacja

```bash
npm install
```

## 🛠️ Komendy

| Komenda | Opis |
|---------|------|
| `npm run dev` | Dev server z HMR (http://localhost:5173) |
| `npm run build` | Build produkcyjny (SSG) → `build/client/` |
| `npm run preview` | Podgląd builda produkcyjnego |
| `npm run test` | Uruchomienie testów Vitest |
| `npm run lint` | ESLint |
| `npm run typecheck` | Sprawdzenie typów TypeScript |

## 🏗️ Struktura projektu

```
stamps2/
├── app/                      # Aplikacja React Router
│   ├── root.tsx              # Główny layout + ErrorBoundary
│   ├── routes.ts             # Definicje routes
│   └── routes/
│       ├── home.tsx          # Strona główna
│       ├── group.tsx         # Widok grupy sprawności
│       ├── badge.tsx         # Widok pojedynczej sprawności
│       └── about.tsx         # Strona informacyjna
├── src/
│   ├── components/           # Komponenty React
│   │   ├── ui/               # shadcn/ui components
│   │   ├── BadgeTree/        # Drzewo sprawności
│   │   ├── SearchBar.tsx     # Wyszukiwarka
│   │   └── ...
│   ├── data/
│   │   ├── api.ts            # Fetchowanie danych z API
│   │   ├── types.ts          # Typy TypeScript
│   │   ├── search.ts         # Indeks Fuse.js
│   │   └── tree-utils.ts     # Budowa drzewa
│   └── index.css             # Style globalne + Tailwind
├── public/                   # Statyczne pliki
├── react-router.config.ts    # Konfiguracja React Router
└── vite.config.ts            # Konfiguracja Vite
```

## 🔌 API

Aplikacja korzysta z publicznego API ZHR:

- **Endpoint:** `https://stamps.zhr.pl/api/badges`
- **Dane:** Grupy sprawności, badge, wymagania, ikony

## 🧪 Testy

```bash
# Uruchom wszystkie testy
npm run test

# Testy z watch mode
npm run test -- --watch
```

Testy pokrywają:
- Sortowanie grup po ordinal
- Wyszukiwanie prerequisite cross-group
- Validację typów kategorii

## 📱 Funkcjonalności

- **Wyszukiwarka** – fuzzy search po nazwach, keywords i wymaganiach
- **Drzewo wymagań** – wizualizacja powiązań między sprawnościami
- **Kategorie** – przeglądanie po kategoriach (obozownictwo, sport, sztuka...)
- **Responsywność** – mobile-first, działa na telefonach i desktopie
- **SSG** – statyczny build, szybkie ładowanie, brak servera

## 🚀 Deployment

### Build statyczny

```bash
npm run build
```

Output: `build/client/` – gotowe do wrzucenia na dowolny hosting statyczny.

### Hostingi

Aplikacja działa na każdym hostingu statycznym:

- **Netlify** – drop `build/client/` lub podłącz repo
- **Vercel** – automatyczne wykrycie React Router
- **GitHub Pages** – push do gh-pages branch
- **Cloudflare Pages** – podłącz repo, build command: `npm run build`

### Przykład: Netlify

1. Podłącz repozytorium GitHub
2. Build command: `npm run build`
3. Publish directory: `build/client`
4. Deploy

## 📊 Jakość kodu

| Metryka | Status |
|---------|--------|
| ESLint | ✅ 0 błędów |
| Testy | ✅ 18 passing |
| TypeScript | ✅ 0 errors |
| Bundle size | ~500K (gzipped: ~150K) |

## 📝 Licencja

Dane: [Związek Harcerstwa Rzeczpospolitej](https://stamps.zhr.pl)

Aplikacja: MIT
