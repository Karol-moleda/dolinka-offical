/**
 * tina/config.ts — opis panelu, z ktorego przewodniczacy zmienia tresc strony.
 *
 * Jak to dziala:
 *
 * Panel nie ma wlasnej bazy danych. Kazde pole ponizej odpowiada polu
 * w jednym z siedmiu plikow `src/content/*.json`. Zapis w panelu = commit
 * do repozytorium = GitHub Actions buduje strone = FTP wgrywa ja na serwer.
 * Przewodniczacy nie widzi ani GitHuba, ani FTP - tylko formularz.
 *
 * WAZNE przy zmianach:
 *
 * `name` kazdego pola MUSI byc identyczne jak klucz w pliku JSON. Panel
 * zapisuje dokladnie pod ta nazwa, a `src/tresc.js` sprawdza plik schematem
 * Zod przy budowaniu. Rozjazd miedzy tym plikiem a `tresc.js` konczy sie
 * zatrzymanym buildem - co jest dobre (blad widac od razu), ale kosztuje
 * jedno nieudane wdrozenie. Zmieniajac cokolwiek tutaj, sprawdz `tresc.js`.
 *
 * `label` i `description` to jedyne, co widzi przewodniczacy. Dlatego sa
 * po polsku i mowia, gdzie dana rzecz wyladuje na stronie - nie jak sie
 * nazywa pole w kodzie.
 */

import { defineConfig } from 'tinacms';

/* Galaz, na ktora ida zapisy. W CI zmienne sa ustawione przez GitHuba,
   lokalnie - przez `.env`. Domyslnie `main`, bo taka jest ta strona. */
const galaz =
  process.env.GITHUB_BRANCH ||
  process.env.HEAD ||
  'main';

/* Pola powtarzalne - wydzielone, zeby nie kopiowac tego samego opisu
   w czterech miejscach i nie rozjechac ich przy pierwszej poprawce. */

/* =====================================================================
   Sprawdzanie przy wpisywaniu
   =====================================================================

   To jest PIERWSZA linia obrony i najwazniejsza, bo dziala natychmiast:
   przewodniczacy widzi czerwony komunikat pod polem i nie moze zapisac.

   Druga linia jest w `src/tresc.js` - tam zepsuty wpis jest pomijany,
   zeby budowanie strony nigdy sie nie zatrzymalo. Ale to juz tylko siatka
   bezpieczenstwa: wtedy wpis po cichu nie pojawia sie na stronie, a autor
   nie wie dlaczego. Dlatego blad ma byc zlapany tutaj.
*/

/** Data w postaci RRRR-MM-DD, ktora naprawde istnieje w kalendarzu. */
const sprawdzDate = (wartosc?: string) => {
  if (!wartosc) return undefined;

  const dopasowanie = /^(\d{4})-(\d{2})-(\d{2})$/.exec(wartosc.trim());
  if (!dopasowanie) {
    return 'Data musi mieć postać RRRR-MM-DD, np. 2026-09-25';
  }

  const [, rok, miesiac, dzien] = dopasowanie.map(Number) as unknown as number[];
  const data = new Date(Date.UTC(rok, miesiac - 1, dzien));

  // `new Date('2026-02-31')` nie zglasza bledu - JavaScript po cichu
  // przewija te date na 3 marca. Bez tego porownania 31 lutego
  // wyladowalby na stronie jako 3 marca.
  const istnieje =
    data.getUTCFullYear() === rok &&
    data.getUTCMonth() === miesiac - 1 &&
    data.getUTCDate() === dzien;

  return istnieje ? undefined : 'Taka data nie istnieje w kalendarzu';
};

const sprawdzRok = (wartosc?: string) => {
  if (!wartosc) return 'Podaj rok, np. 2026';
  return /^(19|20)\d{2}$/.test(wartosc.trim())
    ? undefined
    : 'Rok to cztery cyfry, np. 2026';
};

const sprawdzAdresWww = (wartosc?: string) => {
  if (!wartosc) return undefined;
  try {
    const czysty = wartosc.trim();
    new URL(/^https?:\/\//i.test(czysty) ? czysty : `https://${czysty}`);
    return undefined;
  } catch {
    return 'To nie wygląda na adres strony, np. https://umig.olkusz.pl';
  }
};

const sprawdzEmail = (wartosc?: string) => {
  if (!wartosc) return undefined;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(wartosc.trim())
    ? undefined
    : 'To nie wygląda na adres e-mail';
};

const sprawdzNiepuste = (co: string) => (wartosc?: string) =>
  wartosc && wartosc.trim().length > 0 ? undefined : `${co} nie może być puste`;

const poleOpublikowane = (nazwa: string) => ({
  type: 'boolean' as const,
  name: nazwa,
  label: 'Pokazuj na stronie',
  description:
    'Wylaczone = wpis zostaje zapisany, ale mieszkancy go nie widza. ' +
    'Uzywaj tego zamiast kasowania - nic nie ginie bezpowrotnie.',
});

export default defineConfig({
  branch: galaz,
  clientId: process.env.TINA_CLIENT_ID ?? process.env.PUBLIC_TINA_CLIENT_ID ?? '',
  token: process.env.TINA_TOKEN ?? '',

  build: {
    // Panel jest zwykla statyczna strona. Astro kopiuje `public/` do `dist/`,
    // wiec panel wyladuje pod adresem dolinka-olkusz.pl/admin/ bez zadnego
    // serwera Node na hostingu - a vh.pl zadnego Node nie ma.
    outputFolder: 'admin',
    publicFolder: 'public',
  },

  media: {
    tina: {
      // Zdjecia wgrane w panelu MUSZA trafic do `src/`, nie do `public/`.
      // Tylko wtedy Astro zrobi z nich miniatury i lzejsze warianty.
      // Zdjecie 5 MB wrzucone do `public/` poszloby na telefon mieszkanca
      // w calosci - dokladnie ten problem usuwalismy w poprzednim etapie.
      publicFolder: 'src',
      mediaRoot: 'images',
    },
  },

  schema: {
    collections: [
      /* =================================================================
         AKTUALNOSCI - to, co przewodniczacy zmienia najczesciej,
         wiec stoi pierwsze na liscie.
         ================================================================= */
      {
        name: 'aktualnosci',
        label: 'Aktualności',
        path: 'src/content',
        format: 'json',
        match: { include: 'aktualnosci' },
        ui: {
          // Plik jest jeden i ma zostac jeden. Bez tego panel pokazuje
          // przycisk "utworz nowy", ktory zrobilby plik, ktorego strona
          // nigdzie nie czyta.
          allowedActions: { create: false, delete: false },
        },
        fields: [
          {
            type: 'object',
            name: 'wpisy',
            label: 'Ogłoszenia',
            list: true,
            ui: {
              itemProps: (wpis) => ({ label: wpis?.title || '(bez tytułu)' }),
              description:
                'Na stronie widoczne jest jedno ogłoszenie naraz; ' +
                'starsze mieszkaniec wybiera z listy rozwijanej. ' +
                'Pierwsze z góry jest tym pokazywanym po wejściu na stronę — ' +
                'nowe ogłoszenie przeciągnij na samą górę.',
            },
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Tytuł',
                required: true,
                isTitle: true,
              },
              {
                type: 'string',
                name: 'text',
                label: 'Treść',
                required: true,
                ui: { component: 'textarea' },
                description:
                  'Enter robi nowy akapit. Na stronie pokazuje się pięć pierwszych ' +
                  'linijek, reszta po kliknięciu „Czytaj więcej”.',
              },
              {
                type: 'image',
                name: 'img',
                label: 'Plakat (opcjonalnie)',
                description:
                  'Pokazywany obok treści, zawsze w całości — nic nie zostanie ucięte. ' +
                  'To samo zdjęcie pojawia się w podglądzie linku na Facebooku, ' +
                  'więc warto je dodać nawet do krótkiego ogłoszenia.',
              },
              {
                type: 'string',
                name: 'data',
                label: 'Data ogłoszenia (opcjonalnie)',
                description:
                  'Postać RRRR-MM-DD, np. 2026-09-25. Pokazuje się pod tytułem ' +
                  'i mówi Google, jak świeże jest ogłoszenie.',
                ui: { validate: sprawdzDate },
              },
              {
                type: 'string',
                name: 'slug',
                label: 'Adres podstrony (opcjonalnie)',
                description:
                  'Każde ogłoszenie ma własny adres, np. dolinka-olkusz.pl/aktualnosci/zebranie-z-mieszkancami/. ' +
                  'Zostaw puste, a powstanie sam z tytułu. ' +
                  'UWAGA: zmiana tego pola (albo tytułu, gdy pole jest puste) ' +
                  'zmienia adres — linki wysłane wcześniej na Facebooku przestaną działać.',
              },
              poleOpublikowane('published'),
            ],
          },
        ],
      },

      /* =================================================================
         KALENDARZ
         ================================================================= */
      {
        name: 'kalendarz',
        label: 'Kalendarz wydarzeń',
        path: 'src/content',
        format: 'json',
        match: { include: 'kalendarz' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'wydarzenia',
            label: 'Wydarzenia',
            list: true,
            ui: {
              itemProps: (wydarzenie) => ({
                label: [wydarzenie?.date, wydarzenie?.title]
                  .filter(Boolean)
                  .join(' — ') || '(nowe wydarzenie)',
              }),
              description:
                'Kolejność na stronie wynika z daty, nie z kolejności na tej liście — ' +
                'nowe wydarzenie dopisz gdziekolwiek, samo trafi na swoje miejsce. ' +
                'Minione wydarzenia wyszarzają się automatycznie.',
            },
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Nazwa wydarzenia',
                required: true,
                isTitle: true,
              },
              {
                type: 'string',
                name: 'date',
                label: 'Data',
                required: true,
                description: 'Postać RRRR-MM-DD, np. 2026-09-25.',
                ui: {
                  validate: (wartosc?: string) =>
                    sprawdzNiepuste('Data')(wartosc) ?? sprawdzDate(wartosc),
                },
              },
              {
                type: 'string',
                name: 'dateText',
                label: 'Termin przybliżony (opcjonalnie)',
                description:
                  'Wpisz, gdy dokładny dzień nie jest jeszcze znany — np. „wrzesień 2026”. ' +
                  'Wtedy to pokaże się mieszkańcowi zamiast daty, ale pole „Data” ' +
                  'i tak wypełnij (decyduje o kolejności).',
              },
              {
                type: 'string',
                name: 'text',
                label: 'Opis (opcjonalnie)',
                ui: { component: 'textarea' },
              },
              poleOpublikowane('published'),
            ],
          },
        ],
      },

      /* =================================================================
         GALERIA
         ================================================================= */
      {
        name: 'galeria',
        label: 'Galeria zdjęć',
        path: 'src/content',
        format: 'json',
        match: { include: 'galeria' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'albumy',
            label: 'Albumy',
            list: true,
            ui: {
              itemProps: (album) => ({
                label: [album?.year, album?.title].filter(Boolean).join(' · ') || '(nowy album)',
              }),
              description:
                'Album bez zdjęć nie pokaże się na stronie. ' +
                'Zakładki z latami tworzą się same na podstawie pola „Rok”.',
            },
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Nazwa albumu',
                required: true,
                isTitle: true,
                description:
                  'Ta nazwa jest też czytana przez czytniki ekranu osobom niewidomym ' +
                  'przy każdym zdjęciu z albumu — dlatego niech opisuje wydarzenie, ' +
                  'np. „Festyn rodzinny 2026”, a nie „Album 3”.',
              },
              {
                type: 'string',
                name: 'year',
                label: 'Rok',
                required: true,
                description: 'Cztery cyfry, np. 2026. Decyduje o zakładce nad galerią.',
                ui: { validate: sprawdzRok },
              },
              {
                type: 'image',
                name: 'photos',
                label: 'Zdjęcia',
                list: true,
                description:
                  'Można wgrać wiele naraz. Miniatury i lżejsze wersje na telefon ' +
                  'robią się same przy budowaniu strony — wgrywaj oryginały, nic nie zmniejszaj.',
              },
              poleOpublikowane('published'),
            ],
          },
        ],
      },

      /* =================================================================
         DOKUMENTY
         ================================================================= */
      {
        name: 'dokumenty',
        label: 'Dokumenty do pobrania',
        path: 'src/content',
        format: 'json',
        match: { include: 'dokumenty' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'kategorie',
            label: 'Zakładki',
            list: true,
            ui: {
              itemProps: (kategoria) => ({ label: kategoria?.label || '(nowa zakładka)' }),
              description:
                'Zakładka pojawi się na stronie dopiero wtedy, gdy ma choć jeden ' +
                'widoczny dokument. Pusta zakładka to ślepy zaułek dla mieszkańca.',
            },
            fields: [
              {
                type: 'string',
                name: 'id',
                label: 'Identyfikator',
                required: true,
                description:
                  'Tylko małe litery, cyfry i myślniki — np. „koszykowka”. ' +
                  'To po nim dokument wie, do której zakładki należy, ' +
                  'więc po utworzeniu lepiej go już nie zmieniać.',
                ui: {
                  validate: (wartosc?: string) => {
                    if (!wartosc || !wartosc.trim()) return 'Identyfikator nie może być pusty';
                    return /^[a-z0-9-]+$/.test(wartosc.trim())
                      ? undefined
                      : 'Tylko małe litery bez polskich znaków, cyfry i myślniki — np. „koszykowka”';
                  },
                },
              },
              {
                type: 'string',
                name: 'label',
                label: 'Nazwa zakładki',
                required: true,
                isTitle: true,
              },
              {
                type: 'string',
                name: 'icon',
                label: 'Ikona (opcjonalnie)',
              },
            ],
          },
          {
            type: 'object',
            name: 'dokumenty',
            label: 'Pliki',
            list: true,
            ui: {
              itemProps: (dokument) => ({ label: dokument?.title || '(nowy dokument)' }),
            },
            fields: [
              {
                type: 'string',
                name: 'title',
                label: 'Nazwa',
                required: true,
                isTitle: true,
              },
              {
                type: 'string',
                name: 'description',
                label: 'Krótki opis (opcjonalnie)',
                ui: { component: 'textarea' },
              },
              {
                type: 'image',
                name: 'file',
                label: 'Plik PDF',
                required: true,
              },
              {
                type: 'string',
                name: 'downloadName',
                label: 'Nazwa przy zapisie (opcjonalnie)',
                description:
                  'Pod taką nazwą plik zapisze się mieszkańcowi na dysku. ' +
                  'Warto wpisać po polsku, np. „Regulamin Turnieju 2026.pdf”.',
              },
              {
                type: 'string',
                name: 'kategoria',
                label: 'Zakładka',
                required: true,
                description: 'Identyfikator zakładki z listy powyżej — np. „koszykowka”.',
              },
              poleOpublikowane('published'),
            ],
          },
        ],
      },

      /* =================================================================
         ZARZAD
         ================================================================= */
      {
        name: 'zarzad',
        label: 'Zarząd',
        path: 'src/content',
        format: 'json',
        match: { include: 'zarzad' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'osoby',
            label: 'Członkowie Zarządu',
            list: true,
            ui: {
              itemProps: (osoba) => ({ label: osoba?.imieNazwisko || '(nowa osoba)' }),
              description: 'Kolejność na tej liście to kolejność na stronie.',
            },
            fields: [
              {
                type: 'string',
                name: 'imieNazwisko',
                label: 'Imię i nazwisko',
                required: true,
                isTitle: true,
              },
              {
                type: 'string',
                name: 'funkcja',
                label: 'Funkcja',
                required: true,
                description: 'Np. „Przewodniczący Zarządu”, „Członek Zarządu”.',
              },
              {
                type: 'image',
                name: 'zdjecie',
                label: 'Zdjęcie',
                required: true,
                description:
                  'Najlepiej portret, twarz mniej więcej na środku — ' +
                  'strona przycina zdjęcie do kwadratu.',
              },
              poleOpublikowane('opublikowane'),
            ],
          },
        ],
      },

      /* =================================================================
         NASZE DZIALANIA
         ================================================================= */
      {
        name: 'dzialania',
        label: 'Nasze działania',
        path: 'src/content',
        format: 'json',
        match: { include: 'dzialania' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'pozycje',
            label: 'Działania',
            list: true,
            ui: {
              itemProps: (pozycja) => ({ label: pozycja?.tytul || '(nowe działanie)' }),
            },
            fields: [
              {
                type: 'string',
                name: 'tytul',
                label: 'Tytuł',
                required: true,
                isTitle: true,
              },
              {
                type: 'string',
                name: 'opis',
                label: 'Opis',
                required: true,
                ui: { component: 'textarea' },
              },
              {
                type: 'image',
                name: 'zdjecie',
                label: 'Zdjęcie',
                required: true,
              },
              poleOpublikowane('opublikowane'),
            ],
          },
        ],
      },

      /* =================================================================
         STRONA GLOWNA - rzeczy zmieniane raz na rok, wiec na koncu listy.
         ================================================================= */
      {
        name: 'strona',
        label: 'Ustawienia strony',
        path: 'src/content',
        format: 'json',
        match: { include: 'strona' },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: 'object',
            name: 'naglowek',
            label: 'Nagłówek (pierwszy ekran)',
            fields: [
              { type: 'string', name: 'tytul', label: 'Tytuł', required: true },
              { type: 'string', name: 'podtytul', label: 'Podtytuł', required: true },
              {
                type: 'image',
                name: 'zdjecie',
                label: 'Zdjęcie w tle',
                required: true,
                description:
                  'Zdjęcie poziome, najlepiej bez ważnych szczegółów na środku — ' +
                  'tam jest napis „Dolinka”.',
              },
            ],
          },
          {
            type: 'object',
            name: 'oNas',
            label: 'Sekcja „O nas”',
            fields: [
              { type: 'string', name: 'tytul', label: 'Tytuł', required: true },
              {
                type: 'string',
                name: 'tresc',
                label: 'Treść',
                required: true,
                ui: { component: 'textarea' },
              },
              { type: 'image', name: 'zdjecie', label: 'Zdjęcie', required: true },
              {
                type: 'string',
                name: 'opisZdjecia',
                label: 'Opis zdjęcia',
                required: true,
                description:
                  'To czyta na głos czytnik ekranu osobie niewidomej. ' +
                  'Napisz, co widać — np. „Członkowie Zarządu Osiedla Młodych”.',
              },
              {
                type: 'string',
                name: 'coRobimy',
                label: 'Co robimy',
                list: true,
                description: 'Lista punktów po lewej stronie.',
              },
              {
                type: 'string',
                name: 'czymSieZajmujemy',
                label: 'Czym się zajmujemy',
                list: true,
              },
            ],
          },
          {
            type: 'object',
            name: 'kontakt',
            label: 'Kontakt',
            fields: [
              { type: 'string', name: 'adres', label: 'Adres', required: true },
              {
                type: 'string',
                name: 'email',
                label: 'E-mail',
                required: true,
                description: 'Widoczny publicznie na stronie.',
                ui: { validate: sprawdzEmail },
              },
              {
                type: 'string',
                name: 'facebook',
                label: 'Adres profilu na Facebooku',
                required: true,
                description: 'Pełny adres, razem z https://',
                ui: { validate: sprawdzAdresWww },
              },
              {
                type: 'object',
                name: 'przewodniczacy',
                label: 'Przewodniczący',
                fields: [
                  {
                    type: 'string',
                    name: 'imieNazwisko',
                    label: 'Imię i nazwisko',
                    required: true,
                  },
                  { type: 'string', name: 'telefon', label: 'Telefon', required: true },
                ],
              },
              {
                type: 'object',
                name: 'telefony',
                label: 'Ważne telefony',
                list: true,
                ui: {
                  itemProps: (telefon) => ({
                    label: [telefon?.numer, telefon?.opis].filter(Boolean).join(' — ') ||
                      '(nowy numer)',
                  }),
                },
                fields: [
                  { type: 'string', name: 'numer', label: 'Numer', required: true },
                  { type: 'string', name: 'opis', label: 'Opis', required: true },
                  {
                    type: 'boolean',
                    name: 'alarmowy',
                    label: 'Numer alarmowy',
                    description:
                      'Zaznaczone = numer jest wyróżniony na czerwono. ' +
                      'To nie ozdoba: informuje, że dzwoni się tam w innej sytuacji. ' +
                      'Zostaw wyłączone dla numerów zwykłych, np. do urzędu.',
                  },
                ],
              },
              {
                type: 'object',
                name: 'linki',
                label: 'Przydatne strony',
                list: true,
                ui: {
                  itemProps: (link) => ({ label: link?.nazwa || '(nowy link)' }),
                },
                fields: [
                  { type: 'string', name: 'nazwa', label: 'Nazwa', required: true },
                  {
                    type: 'string',
                    name: 'adres',
                    label: 'Adres',
                    required: true,
                    description: 'Pełny adres, razem z https://',
                    ui: { validate: sprawdzAdresWww },
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
});
