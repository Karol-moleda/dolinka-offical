// tina/config.ts
import { defineConfig } from "tinacms";
var galaz = process.env.GITHUB_BRANCH || process.env.HEAD || "main";
var poleOpublikowane = (nazwa) => ({
  type: "boolean",
  name: nazwa,
  label: "Pokazuj na stronie",
  description: "Wylaczone = wpis zostaje zapisany, ale mieszkancy go nie widza. Uzywaj tego zamiast kasowania - nic nie ginie bezpowrotnie."
});
var config_default = defineConfig({
  branch: galaz,
  clientId: process.env.TINA_CLIENT_ID ?? process.env.PUBLIC_TINA_CLIENT_ID ?? "",
  token: process.env.TINA_TOKEN ?? "",
  build: {
    // Panel jest zwykla statyczna strona. Astro kopiuje `public/` do `dist/`,
    // wiec panel wyladuje pod adresem dolinka-olkusz.pl/admin/ bez zadnego
    // serwera Node na hostingu - a vh.pl zadnego Node nie ma.
    outputFolder: "admin",
    publicFolder: "public"
  },
  media: {
    tina: {
      // Zdjecia wgrane w panelu MUSZA trafic do `src/`, nie do `public/`.
      // Tylko wtedy Astro zrobi z nich miniatury i lzejsze warianty.
      // Zdjecie 5 MB wrzucone do `public/` poszloby na telefon mieszkanca
      // w calosci - dokladnie ten problem usuwalismy w poprzednim etapie.
      publicFolder: "src",
      mediaRoot: "images"
    }
  },
  schema: {
    collections: [
      /* =================================================================
         AKTUALNOSCI - to, co przewodniczacy zmienia najczesciej,
         wiec stoi pierwsze na liscie.
         ================================================================= */
      {
        name: "aktualnosci",
        label: "Aktualno\u015Bci",
        path: "src/content",
        format: "json",
        match: { include: "aktualnosci" },
        ui: {
          // Plik jest jeden i ma zostac jeden. Bez tego panel pokazuje
          // przycisk "utworz nowy", ktory zrobilby plik, ktorego strona
          // nigdzie nie czyta.
          allowedActions: { create: false, delete: false }
        },
        fields: [
          {
            type: "object",
            name: "wpisy",
            label: "Og\u0142oszenia",
            list: true,
            ui: {
              itemProps: (wpis) => ({ label: wpis?.title || "(bez tytu\u0142u)" }),
              description: "Na stronie widoczne jest jedno og\u0142oszenie naraz; starsze mieszkaniec wybiera z listy rozwijanej. Pierwsze z g\xF3ry jest tym pokazywanym po wej\u015Bciu na stron\u0119 \u2014 nowe og\u0142oszenie przeci\u0105gnij na sam\u0105 g\xF3r\u0119."
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Tytu\u0142",
                required: true,
                isTitle: true
              },
              {
                type: "string",
                name: "text",
                label: "Tre\u015B\u0107",
                required: true,
                ui: { component: "textarea" },
                description: "Enter robi nowy akapit. Na stronie pokazuje si\u0119 pi\u0119\u0107 pierwszych linijek, reszta po klikni\u0119ciu \u201ECzytaj wi\u0119cej\u201D."
              },
              {
                type: "image",
                name: "img",
                label: "Plakat (opcjonalnie)",
                description: "Pokazywany obok tre\u015Bci, zawsze w ca\u0142o\u015Bci \u2014 nic nie zostanie uci\u0119te."
              },
              poleOpublikowane("published")
            ]
          }
        ]
      },
      /* =================================================================
         KALENDARZ
         ================================================================= */
      {
        name: "kalendarz",
        label: "Kalendarz wydarze\u0144",
        path: "src/content",
        format: "json",
        match: { include: "kalendarz" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "wydarzenia",
            label: "Wydarzenia",
            list: true,
            ui: {
              itemProps: (wydarzenie) => ({
                label: [wydarzenie?.date, wydarzenie?.title].filter(Boolean).join(" \u2014 ") || "(nowe wydarzenie)"
              }),
              description: "Kolejno\u015B\u0107 na stronie wynika z daty, nie z kolejno\u015Bci na tej li\u015Bcie \u2014 nowe wydarzenie dopisz gdziekolwiek, samo trafi na swoje miejsce. Minione wydarzenia wyszarzaj\u0105 si\u0119 automatycznie."
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Nazwa wydarzenia",
                required: true,
                isTitle: true
              },
              {
                type: "string",
                name: "date",
                label: "Data",
                required: true,
                description: "Posta\u0107 RRRR-MM-DD, np. 2026-09-25. Data, kt\xF3rej nie ma w kalendarzu (np. 2026-02-31), zatrzyma budowanie strony z czytelnym komunikatem."
              },
              {
                type: "string",
                name: "dateText",
                label: "Termin przybli\u017Cony (opcjonalnie)",
                description: "Wpisz, gdy dok\u0142adny dzie\u0144 nie jest jeszcze znany \u2014 np. \u201Ewrzesie\u0144 2026\u201D. Wtedy to poka\u017Ce si\u0119 mieszka\u0144cowi zamiast daty, ale pole \u201EData\u201D i tak wype\u0142nij (decyduje o kolejno\u015Bci)."
              },
              {
                type: "string",
                name: "text",
                label: "Opis (opcjonalnie)",
                ui: { component: "textarea" }
              },
              poleOpublikowane("published")
            ]
          }
        ]
      },
      /* =================================================================
         GALERIA
         ================================================================= */
      {
        name: "galeria",
        label: "Galeria zdj\u0119\u0107",
        path: "src/content",
        format: "json",
        match: { include: "galeria" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "albumy",
            label: "Albumy",
            list: true,
            ui: {
              itemProps: (album) => ({
                label: [album?.year, album?.title].filter(Boolean).join(" \xB7 ") || "(nowy album)"
              }),
              description: "Album bez zdj\u0119\u0107 nie poka\u017Ce si\u0119 na stronie. Zak\u0142adki z latami tworz\u0105 si\u0119 same na podstawie pola \u201ERok\u201D."
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Nazwa albumu",
                required: true,
                isTitle: true,
                description: "Ta nazwa jest te\u017C czytana przez czytniki ekranu osobom niewidomym przy ka\u017Cdym zdj\u0119ciu z albumu \u2014 dlatego niech opisuje wydarzenie, np. \u201EFestyn rodzinny 2026\u201D, a nie \u201EAlbum 3\u201D."
              },
              {
                type: "string",
                name: "year",
                label: "Rok",
                required: true,
                description: "Cztery cyfry, np. 2026. Decyduje o zak\u0142adce nad galeri\u0105."
              },
              {
                type: "image",
                name: "photos",
                label: "Zdj\u0119cia",
                list: true,
                description: "Mo\u017Cna wgra\u0107 wiele naraz. Miniatury i l\u017Cejsze wersje na telefon robi\u0105 si\u0119 same przy budowaniu strony \u2014 wgrywaj orygina\u0142y, nic nie zmniejszaj."
              },
              poleOpublikowane("published")
            ]
          }
        ]
      },
      /* =================================================================
         DOKUMENTY
         ================================================================= */
      {
        name: "dokumenty",
        label: "Dokumenty do pobrania",
        path: "src/content",
        format: "json",
        match: { include: "dokumenty" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "kategorie",
            label: "Zak\u0142adki",
            list: true,
            ui: {
              itemProps: (kategoria) => ({ label: kategoria?.label || "(nowa zak\u0142adka)" }),
              description: "Zak\u0142adka pojawi si\u0119 na stronie dopiero wtedy, gdy ma cho\u0107 jeden widoczny dokument. Pusta zak\u0142adka to \u015Blepy zau\u0142ek dla mieszka\u0144ca."
            },
            fields: [
              {
                type: "string",
                name: "id",
                label: "Identyfikator",
                required: true,
                description: "Tylko ma\u0142e litery, cyfry i my\u015Blniki \u2014 np. \u201Ekoszykowka\u201D. To po nim dokument wie, do kt\xF3rej zak\u0142adki nale\u017Cy, wi\u0119c po utworzeniu lepiej go ju\u017C nie zmienia\u0107."
              },
              {
                type: "string",
                name: "label",
                label: "Nazwa zak\u0142adki",
                required: true,
                isTitle: true
              },
              {
                type: "string",
                name: "icon",
                label: "Ikona (opcjonalnie)"
              }
            ]
          },
          {
            type: "object",
            name: "dokumenty",
            label: "Pliki",
            list: true,
            ui: {
              itemProps: (dokument) => ({ label: dokument?.title || "(nowy dokument)" })
            },
            fields: [
              {
                type: "string",
                name: "title",
                label: "Nazwa",
                required: true,
                isTitle: true
              },
              {
                type: "string",
                name: "description",
                label: "Kr\xF3tki opis (opcjonalnie)",
                ui: { component: "textarea" }
              },
              {
                type: "image",
                name: "file",
                label: "Plik PDF",
                required: true
              },
              {
                type: "string",
                name: "downloadName",
                label: "Nazwa przy zapisie (opcjonalnie)",
                description: "Pod tak\u0105 nazw\u0105 plik zapisze si\u0119 mieszka\u0144cowi na dysku. Warto wpisa\u0107 po polsku, np. \u201ERegulamin Turnieju 2026.pdf\u201D."
              },
              {
                type: "string",
                name: "kategoria",
                label: "Zak\u0142adka",
                required: true,
                description: "Identyfikator zak\u0142adki z listy powy\u017Cej \u2014 np. \u201Ekoszykowka\u201D."
              },
              poleOpublikowane("published")
            ]
          }
        ]
      },
      /* =================================================================
         ZARZAD
         ================================================================= */
      {
        name: "zarzad",
        label: "Zarz\u0105d",
        path: "src/content",
        format: "json",
        match: { include: "zarzad" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "osoby",
            label: "Cz\u0142onkowie Zarz\u0105du",
            list: true,
            ui: {
              itemProps: (osoba) => ({ label: osoba?.imieNazwisko || "(nowa osoba)" }),
              description: "Kolejno\u015B\u0107 na tej li\u015Bcie to kolejno\u015B\u0107 na stronie."
            },
            fields: [
              {
                type: "string",
                name: "imieNazwisko",
                label: "Imi\u0119 i nazwisko",
                required: true,
                isTitle: true
              },
              {
                type: "string",
                name: "funkcja",
                label: "Funkcja",
                required: true,
                description: "Np. \u201EPrzewodnicz\u0105cy Zarz\u0105du\u201D, \u201ECz\u0142onek Zarz\u0105du\u201D."
              },
              {
                type: "image",
                name: "zdjecie",
                label: "Zdj\u0119cie",
                required: true,
                description: "Najlepiej portret, twarz mniej wi\u0119cej na \u015Brodku \u2014 strona przycina zdj\u0119cie do kwadratu."
              },
              poleOpublikowane("opublikowane")
            ]
          }
        ]
      },
      /* =================================================================
         NASZE DZIALANIA
         ================================================================= */
      {
        name: "dzialania",
        label: "Nasze dzia\u0142ania",
        path: "src/content",
        format: "json",
        match: { include: "dzialania" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "pozycje",
            label: "Dzia\u0142ania",
            list: true,
            ui: {
              itemProps: (pozycja) => ({ label: pozycja?.tytul || "(nowe dzia\u0142anie)" })
            },
            fields: [
              {
                type: "string",
                name: "tytul",
                label: "Tytu\u0142",
                required: true,
                isTitle: true
              },
              {
                type: "string",
                name: "opis",
                label: "Opis",
                required: true,
                ui: { component: "textarea" }
              },
              {
                type: "image",
                name: "zdjecie",
                label: "Zdj\u0119cie",
                required: true
              },
              poleOpublikowane("opublikowane")
            ]
          }
        ]
      },
      /* =================================================================
         STRONA GLOWNA - rzeczy zmieniane raz na rok, wiec na koncu listy.
         ================================================================= */
      {
        name: "strona",
        label: "Ustawienia strony",
        path: "src/content",
        format: "json",
        match: { include: "strona" },
        ui: { allowedActions: { create: false, delete: false } },
        fields: [
          {
            type: "object",
            name: "naglowek",
            label: "Nag\u0142\xF3wek (pierwszy ekran)",
            fields: [
              { type: "string", name: "tytul", label: "Tytu\u0142", required: true },
              { type: "string", name: "podtytul", label: "Podtytu\u0142", required: true },
              {
                type: "image",
                name: "zdjecie",
                label: "Zdj\u0119cie w tle",
                required: true,
                description: "Zdj\u0119cie poziome, najlepiej bez wa\u017Cnych szczeg\xF3\u0142\xF3w na \u015Brodku \u2014 tam jest napis \u201EDolinka\u201D."
              }
            ]
          },
          {
            type: "object",
            name: "oNas",
            label: "Sekcja \u201EO nas\u201D",
            fields: [
              { type: "string", name: "tytul", label: "Tytu\u0142", required: true },
              {
                type: "string",
                name: "tresc",
                label: "Tre\u015B\u0107",
                required: true,
                ui: { component: "textarea" }
              },
              { type: "image", name: "zdjecie", label: "Zdj\u0119cie", required: true },
              {
                type: "string",
                name: "opisZdjecia",
                label: "Opis zdj\u0119cia",
                required: true,
                description: "To czyta na g\u0142os czytnik ekranu osobie niewidomej. Napisz, co wida\u0107 \u2014 np. \u201ECz\u0142onkowie Zarz\u0105du Osiedla M\u0142odych\u201D."
              },
              {
                type: "string",
                name: "coRobimy",
                label: "Co robimy",
                list: true,
                description: "Lista punkt\xF3w po lewej stronie."
              },
              {
                type: "string",
                name: "czymSieZajmujemy",
                label: "Czym si\u0119 zajmujemy",
                list: true
              }
            ]
          },
          {
            type: "object",
            name: "kontakt",
            label: "Kontakt",
            fields: [
              { type: "string", name: "adres", label: "Adres", required: true },
              {
                type: "string",
                name: "email",
                label: "E-mail",
                required: true,
                description: "Widoczny publicznie na stronie."
              },
              {
                type: "string",
                name: "facebook",
                label: "Adres profilu na Facebooku",
                required: true,
                description: "Pe\u0142ny adres, razem z https://"
              },
              {
                type: "object",
                name: "przewodniczacy",
                label: "Przewodnicz\u0105cy",
                fields: [
                  {
                    type: "string",
                    name: "imieNazwisko",
                    label: "Imi\u0119 i nazwisko",
                    required: true
                  },
                  { type: "string", name: "telefon", label: "Telefon", required: true }
                ]
              },
              {
                type: "object",
                name: "telefony",
                label: "Wa\u017Cne telefony",
                list: true,
                ui: {
                  itemProps: (telefon) => ({
                    label: [telefon?.numer, telefon?.opis].filter(Boolean).join(" \u2014 ") || "(nowy numer)"
                  })
                },
                fields: [
                  { type: "string", name: "numer", label: "Numer", required: true },
                  { type: "string", name: "opis", label: "Opis", required: true },
                  {
                    type: "boolean",
                    name: "alarmowy",
                    label: "Numer alarmowy",
                    description: "Zaznaczone = numer jest wyr\xF3\u017Cniony na czerwono. To nie ozdoba: informuje, \u017Ce dzwoni si\u0119 tam w innej sytuacji. Zostaw wy\u0142\u0105czone dla numer\xF3w zwyk\u0142ych, np. do urz\u0119du."
                  }
                ]
              },
              {
                type: "object",
                name: "linki",
                label: "Przydatne strony",
                list: true,
                ui: {
                  itemProps: (link) => ({ label: link?.nazwa || "(nowy link)" })
                },
                fields: [
                  { type: "string", name: "nazwa", label: "Nazwa", required: true },
                  {
                    type: "string",
                    name: "adres",
                    label: "Adres",
                    required: true,
                    description: "Pe\u0142ny adres, razem z https://"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
});
export {
  config_default as default
};
