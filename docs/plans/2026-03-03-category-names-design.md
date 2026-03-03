# Category Names & Icons — Design

## Analiza

Aplikacja stamps.zhr.pl/#/ (reference app) wymaga JavaScript — nie można zweryfikować feature parity bezpośrednio. Weryfikacja danych przez API wykazała:

- **Pokrycie danych: 100%** — app i API są zsynchronizowane (27 grup, ~103 odznaki, kategorie 1/2/3/4/6)
- **Problem: CATEGORY_NAMES** — używają nieformalnych skrótów zamiast oficjalnych nazw działów ZHR

## Wymagane zmiany

### `src/data/types.ts` — CATEGORY_NAMES

| Kat. | Stara nazwa | Nowa nazwa (oficjalna ZHR) |
|---|---|---|
| 1 | Puszcza i przyroda | Obozownictwo i przyroda |
| 2 | Sport | Sport, turystyka i krajoznawstwo |
| 3 | Umiejętności | Sztuka i technika |
| 4 | Kultura i wiedza | Nauka i kultura |
| 6 | Duch i charakter | Duch i charakter (bez zmian) |

### `src/data/types.ts` — CATEGORY_ICONS

| Kat. | Stara ikona | Nowa ikona | Uzasadnienie |
|---|---|---|---|
| 1 | 🌲 | ⛺ | Obozownictwo (namiot) lepsze niż las |
| 2 | 🏹 | ⛰️ | Turystyka/sport górski |
| 3 | 🔧 | 🎨 | Sztuka (paleta) > klucz dla "Sztuka i technika" |
| 4 | 📚 | 📚 | Bez zmian — pasuje do "Nauka i kultura" |
| 6 | 🎭 | ⚜️ | Lilija harcerska ZHR — symbol "Duch i charakter" |

## Mapowanie kategorii API → oficjalne działy ZHR

Potwierdzone przez analizę grup należących do każdej kategorii API:

- **Kat. 1**: Puszczaństwo, Zielarstwo, Obozownictwo, Biwakowanie, Łączność… → **Obozownictwo i przyroda**
- **Kat. 2**: Strzelectwo, Narty, Bieganie, Żeglarstwo, Sporty zespołowe… → **Sport, turystyka i krajoznawstwo**
- **Kat. 3**: Gotowanie, Ogrodnictwo, Hodowla, Film i Kino → **Sztuka i technika**
- **Kat. 4**: Gry, Lingwistyka, Komunikacja, Obywatelstwo, Kolekcjonerstwo → **Nauka i kultura**
- **Kat. 6**: Aktorstwo i teatr → **Duch i charakter**
- **Kat. 5**: brak grup w API (dział "Muzyka i ekspresja" nieobecny w danych)

## Pliki do zmiany

1. `src/data/types.ts` — CATEGORY_NAMES + CATEGORY_ICONS
2. `src/data/types.test.ts` — zaktualizuj testy do nowych nazw
