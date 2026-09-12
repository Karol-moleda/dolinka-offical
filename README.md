# Dolinka Olkusz — strona Zarządu Osiedla Młodych

Strona informacyjna stowarzyszenia: park, wydarzenia, aktualności, dokumenty do pobrania.

**Produkcja:** <https://dolinka.olkusz.pl> · hosting vh.pl (Apache) · wdrożenie ręczne przez FTP.

---

## Stack

| Element | Co jest użyte |
|---|---|
| Framework | React 18 + Create React App (`react-scripts` 5.0.1) |
| Style | styled-components 6 + pliki CSS obok komponentów + Bootstrap 5 |
| Animacje | framer-motion, react-responsive-carousel |
| Ikony | Font Awesome |
| Formularz kontaktowy | EmailJS |

Strona jest jednostronicowa — wszystkie sekcje są komponentami składanymi w `src/App.jsx`.

---

## Uruchomienie lokalne

```bash
npm install
npm start          # http://localhost:3000
npm run build      # produkcyjny build do ./build
```

> **Uwaga:** skrypty `start` i `build` w `package.json` używają windowsowej składni
> `set "GENERATE_SOURCEMAP=false" && ...`. Na Linuksie i macOS się nie wykonają —
> do naprawienia w etapie 2, kiedy build będzie się uruchamiał w GitHub Actions.

---

## Wdrożenie (stan obecny)

1. `npm run build`
2. Zawartość katalogu `build/` wrzucana FileZillą do katalogu strony na vh.pl

Plik `public/.htaccess` (cache obrazów, GZIP, Brotli) trafia do builda automatycznie.

Docelowo zastąpi to workflow GitHub Actions — patrz *Plan* niżej.

---

## Gdzie siedzi treść

| Co | Gdzie |
|---|---|
| Aktualności (karuzela) | `src/data/data.json` → `Features[]` |
| Galeria (124 zdjęcia) | `src/data/data.json` → `Gallery[]`, pliki w `public/img/` |
| Teksty „O nas", zespół, kontakt | `src/data/data.json` |
| Kalendarz wydarzeń | **wewnątrz** `src/components/calendar.jsx` |
| Dokumenty do pobrania | **wewnątrz** `src/components/inne.jsx`, pliki w `public/document/` |

Trzy różne formy zapisu tej samej rzeczy — to właśnie rozwiązuje etap 1.

---

## Struktura katalogów

```
src/
├── components/     komponenty sekcji (navigation, header, about, services,
│                   features, gallery, Team, calendar, inne, contact)
│                   + AccessibilityPanel i LazyImage
├── context/        ThemeContext — tryb ciemny, rozmiar czcionki
├── data/           data.json
├── styles/
│   ├── base/       GlobalStyles, MainStyles, App.css, LegacyFixes.css
│   └── components/ ComponentStyles, CarouselDarkMode.css, ToggleSwitch.css
├── App.jsx         składa wszystkie sekcje (lazy loading)
└── index.js        punkt wejścia

public/
├── img/            zdjęcia galerii i aktualności
├── document/       regulaminy i formularze (kosz/, siatk/)
├── .htaccess       cache + kompresja na serwerze
└── index.html      meta, SEO, favicon
```

---

## Plan rozwoju

| Etap | Co | Status |
|---|---|---|
| 0 | Porządki: usunięcie martwego kodu, `legacy-backup`, balastu z repo | ✅ zrobione |
| 1 | Treść wychodzi z kodu do `src/content/*.json` | — |
| 2 | Automatyczny deploy: GitHub Actions → FTP na vh.pl (koniec z FileZillą) | — |
| 3 | Panel CMS dla przewodniczącego (Pages CMS, edycja z telefonu) | — |
| 4 | Migracja z wycofanego Create React App na Astro | — |

### Co zostało usunięte w etapie 0

Martwy kod: `src/utils/googleSheets.js` (nieużywany parser Google Sheets)
i jego szablon CSV, `src/components/testimonials.jsx`, `SimpleImage.jsx`,
`image.jsx` (importował nieistniejący eksport — był zepsuty), `context/AppContextBridge.jsx`,
dwa puste pliki `FontSizeToggle.jsx` i `themeToggle.jsx`, nieużywane `src/App.css`
i `src/logo.svg`, oba katalogi `legacy-backup` (24 pliki) oraz martwy workflow
GitHub Pages. `build.rar` i ustawienia edytorów przestały być śledzone przez gita.

Poprawione: rok w nagłówku kalendarza wyliczany z dat wydarzeń zamiast
wpisanego na sztywno („2025" przy wydarzeniach z 2026), oraz strona kropki
na osi czasu — wcześniej trzy wydarzenia miały ją po złej stronie, bo ręcznie
wpisany `position` rozjechał się z faktyczną kolejnością.

---

## Licencja

MIT — patrz `LICENSE`. Projekt wyrósł z szablonu
[react-landing-page-template](https://github.com/issaafalkattan/react-landing-page-template)
autorstwa Issaafa Kattana.
