/**
 * tresc.js — jedyne wejscie do tresci strony.
 *
 * Sekcje nie czytaja plikow JSON bezposrednio. Kazdy plik przechodzi
 * najpierw przez sprawdzenie poprawnosci (ponizej), a dopiero potem
 * trafia do widoku - juz posortowany, przefiltrowany i ze sciezkami
 * doprowadzonymi do jednej postaci.
 *
 * Po co to:
 *
 * 1. Literowka w tresci przestaje byc niespodzianka na zywej stronie.
 *    Build sie zatrzymuje i mowi, KTORY wpis i KTORE pole jest nie tak.
 *    Dzis pusty tytul albo data "2026-13-45" przechodzi bez slowa
 *    i wychodzi dopiero u mieszkanca na telefonie.
 *
 * 2. Sekcje dostaja dane gotowe do wyswietlenia. Zadnego filtrowania
 *    `published !== false` i sortowania po dacie w szablonie - to sa
 *    decyzje o tresci, a nie o wygladzie.
 */

import { z } from 'astro/zod';

import stronaSurowa from './content/strona.json';
import aktualnosciSurowe from './content/aktualnosci.json';
import kalendarzSurowy from './content/kalendarz.json';
import dzialaniaSurowe from './content/dzialania.json';
import zarzadSurowy from './content/zarzad.json';
import dokumentySurowe from './content/dokumenty.json';
import galeriaSurowa from './content/galeria.json';

/* =====================================================================
   Sprawdzanie
   ===================================================================== */

function sprawdz(nazwaPliku, schemat, dane) {
  const wynik = schemat.safeParse(dane);

  if (!wynik.success) {
    const bledy = wynik.error.issues
      .map((problem) => {
        const gdzie = problem.path.length ? problem.path.join(' → ') : '(cały plik)';
        return `   • ${gdzie}: ${problem.message}`;
      })
      .join('\n');

    // Rzucamy blad z czytelnym opisem zamiast pozwolic Astro pokazac
    // "Cannot read property of undefined" gdzies w srodku szablonu.
    throw new Error(
      `\n\n┌─────────────────────────────────────────────────────────\n` +
        `│ BŁĄD W TREŚCI: src/content/${nazwaPliku}\n` +
        `└─────────────────────────────────────────────────────────\n` +
        `${bledy}\n\n` +
        `Popraw plik i zapisz — strona przebuduje się sama.\n`
    );
  }

  return wynik.data;
}

/* Sciezki do plikow zapisywane byly raz z ukosnikiem, raz bez
   ("img/kino.jpg" i "/img/kino.jpg"). Sprowadzamy do jednej postaci. */
const sciezka = z
  .string()
  .trim()
  .transform((wartosc) => (wartosc && !wartosc.startsWith('/') ? `/${wartosc}` : wartosc));

const niepusty = (co) => z.string().trim().min(1, `${co} nie może być puste`);

/* =====================================================================
   Schematy
   ===================================================================== */

const schematStrony = z.object({
  naglowek: z.object({
    tytul: niepusty('Tytuł'),
    podtytul: niepusty('Podtytuł'),
    zdjecie: sciezka,
  }),
  oNas: z.object({
    tytul: niepusty('Tytuł'),
    tresc: niepusty('Treść'),
    zdjecie: sciezka,
    opisZdjecia: niepusty('Opis zdjęcia'),
    coRobimy: z.array(niepusty('Pozycja listy')),
    czymSieZajmujemy: z.array(niepusty('Pozycja listy')),
  }),
  kontakt: z.object({
    adres: niepusty('Adres'),
    email: z.string().trim().email('To nie wygląda na adres e-mail'),
    facebook: z.string().trim().url('To nie wygląda na adres strony'),
    przewodniczacy: z.object({
      imieNazwisko: niepusty('Imię i nazwisko'),
      telefon: niepusty('Telefon'),
    }),
    telefony: z.array(
      z.object({
        numer: niepusty('Numer'),
        opis: niepusty('Opis'),
        // Numery alarmowe sa wyroznione na stronie - to nie jest ozdoba,
        // tylko informacja, ze tego numeru uzywa sie w innej sytuacji.
        alarmowy: z.boolean().default(false),
      })
    ),
    linki: z.array(
      z.object({
        nazwa: niepusty('Nazwa'),
        adres: z.string().trim().url('To nie wygląda na adres strony'),
      })
    ),
  }),
});

const schematAktualnosci = z.object({
  wpisy: z.array(
    z.object({
      title: niepusty('Tytuł'),
      text: niepusty('Treść'),
      img: sciezka.optional(),
      // Adres wlasnej podstrony wpisu. Puste = wyliczamy z tytulu.
      slug: z.string().trim().optional(),
      // Data publikacji. Nieobowiazkowa, bo starsze wpisy jej nie maja,
      // ale wyszukiwarki i czytelnicy jej szukaja - warto uzupelniac.
      data: z
        .union([
          z.literal(''),
          z
            .string()
            .trim()
            .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data musi mieć postać RRRR-MM-DD, np. 2026-09-25'),
        ])
        .optional(),
      published: z.boolean().default(true),
    })
  ),
});

const schematKalendarza = z.object({
  wydarzenia: z.array(
    z.object({
      title: niepusty('Nazwa wydarzenia'),
      // Sprawdzamy nie tylko format, ale czy to naprawde istniejaca data.
      //
      // UWAGA na pulapke: `new Date('2026-02-31')` NIE zwraca bledu -
      // JavaScript po cichu przewija te date na 3 marca. Samo sprawdzenie
      // "czy da sie sparsowac" przepuscilo by 31 lutego i wydarzenie
      // wyladowaloby na stronie z inna data, niz wpisal przewodniczacy.
      // Dlatego porownujemy, czy data po przeliczeniu ma te same skladowe.
      date: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, 'Data musi mieć postać RRRR-MM-DD, np. 2026-09-25')
        .refine(
          (wartosc) => {
            const [rok, miesiac, dzien] = wartosc.split('-').map(Number);
            const data = new Date(Date.UTC(rok, miesiac - 1, dzien));
            return (
              data.getUTCFullYear() === rok &&
              data.getUTCMonth() === miesiac - 1 &&
              data.getUTCDate() === dzien
            );
          },
          { message: 'Taka data nie istnieje w kalendarzu' }
        ),
      dateText: z.string().trim().optional(),
      text: z.string().trim().optional().default(''),
      published: z.boolean().default(true),
    })
  ),
});

const schematDzialan = z.object({
  pozycje: z.array(
    z.object({
      tytul: niepusty('Tytuł'),
      opis: niepusty('Opis'),
      zdjecie: sciezka,
      opublikowane: z.boolean().default(true),
    })
  ),
});

const schematZarzadu = z.object({
  osoby: z.array(
    z.object({
      imieNazwisko: niepusty('Imię i nazwisko'),
      funkcja: niepusty('Funkcja'),
      zdjecie: sciezka,
      opublikowane: z.boolean().default(true),
    })
  ),
});

const schematDokumentow = z.object({
  kategorie: z.array(
    z.object({
      id: z
        .string()
        .regex(/^[a-z0-9-]+$/, 'Identyfikator: tylko małe litery, cyfry i myślniki'),
      label: niepusty('Nazwa zakładki'),
      icon: z.string().trim().optional(),
    })
  ),
  dokumenty: z.array(
    z.object({
      title: niepusty('Nazwa'),
      description: z.string().trim().optional().default(''),
      file: sciezka,
      downloadName: z.string().trim().optional(),
      kategoria: niepusty('Zakładka'),
      published: z.boolean().default(true),
    })
  ),
});

const schematGalerii = z.object({
  albumy: z.array(
    z.object({
      title: niepusty('Nazwa albumu'),
      year: z.string().regex(/^(19|20)\d{2}$/, 'Rok to cztery cyfry, np. 2026'),
      photos: z.array(sciezka),
      published: z.boolean().default(true),
    })
  ),
});

/* =====================================================================
   Dane gotowe do wyswietlenia
   ===================================================================== */

export const strona = sprawdz('strona.json', schematStrony, stronaSurowa);

/* Jeden formatownik daty dla calej strony - "25 września 2026".
   Stoi tutaj, bo uzywaja go i aktualnosci, i kalendarz. */
const formatDaty = new Intl.DateTimeFormat('pl-PL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/* ---- Aktualnosci ----------------------------------------------------
   Kazdy wpis dostaje wlasny adres. Powod jest praktyczny, nie estetyczny:
   wyszukiwarka pokazuje w wynikach adresy, a nie fragmenty strony. Dopoki
   wszystko siedzialo pod jednym adresem, ogloszenie o zebraniu nie mialo
   jak trafic do kogos, kto szuka "zebranie Osiedle Mlodych Olkusz".
   Ten sam adres daje sie tez wyslac na Facebooka i wkleic na plakat. */

/* Tytul -> czlon adresu. Polskie znaki sprowadzamy do lacinskich:
   adres z "ę" dziala, ale po skopiowaniu zamienia sie w %C4%99 i
   przestaje byc czytelny dla czlowieka. */
function zrobSlug(tekst) {
  return String(tekst)
    .toLowerCase()
    .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
    .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
    .replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z')
    // Reszta znakow diakrytycznych (np. wklejone z Worda) - rozkladamy
    // i odrzucamy same znaki akcentow.
    .normalize('NFD')
    .replace(new RegExp('[\\u0300-\\u036f]', 'g'), '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

const wpisySurowe = sprawdz('aktualnosci.json', schematAktualnosci, aktualnosciSurowe)
  .wpisy.filter((wpis) => wpis.published);

/* Dwa wpisy o tym samym tytule dalyby ten sam adres i jeden z nich
   przykrylby drugi przy budowaniu - bez slowa ostrzezenia. Numerujemy. */
const uzyteSlugi = new Map();

export const aktualnosci = wpisySurowe.map((wpis) => {
  const podstawa = zrobSlug(wpis.slug || wpis.title) || 'aktualnosc';
  const ile = uzyteSlugi.get(podstawa) ?? 0;
  uzyteSlugi.set(podstawa, ile + 1);

  const slug = ile === 0 ? podstawa : `${podstawa}-${ile + 1}`;

  return {
    ...wpis,
    slug,
    adres: `/aktualnosci/${slug}/`,
    // Pierwsze zdanie albo pierwsza linia - opis dla wyszukiwarki
    // i podglad linku na Facebooku.
    zajawka: wpis.text.split('\n')[0].trim().slice(0, 300),
    dataCzytelna: wpis.data ? formatDaty.format(new Date(`${wpis.data}T00:00:00`)) : null,
  };
});

export const dzialania = sprawdz('dzialania.json', schematDzialan, dzialaniaSurowe)
  .pozycje.filter((pozycja) => pozycja.opublikowane);

export const zarzad = sprawdz('zarzad.json', schematZarzadu, zarzadSurowy)
  .osoby.filter((osoba) => osoba.opublikowane);

/* ---- Kalendarz ------------------------------------------------------
   Kolejnosc i wyszarzanie minionych wydarzen wynikaja z daty, a nie
   z kolejnosci wpisow w pliku. Przewodniczacy dodaje wydarzenie gdziekolwiek
   na liscie i trafia ono na wlasciwe miejsce samo. */

// Ostatni dzien miesiaca danej daty. Dla wydarzen z terminem przyblizonym
// ("wrzesien 2026") - takie nie powinno stac sie "minione" 2 wrzesnia.
const koniecMiesiaca = (data) =>
  new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59);

const dzis = new Date();

export const kalendarz = sprawdz('kalendarz.json', schematKalendarza, kalendarzSurowy)
  .wydarzenia.filter((wydarzenie) => wydarzenie.published)
  .map((wydarzenie) => {
    const data = new Date(`${wydarzenie.date}T00:00:00`);
    const przyblizony = Boolean(wydarzenie.dateText);

    return {
      ...wydarzenie,
      data,
      etykieta: przyblizony ? wydarzenie.dateText : formatDaty.format(data),
      // Data maszynowa dla atrybutu datetime - czytnik ekranu i wyszukiwarka
      // odczytaja ja poprawnie niezaleznie od tego, co widzi czlowiek.
      dataISO: wydarzenie.date,
      minione: (przyblizony ? koniecMiesiaca(data) : data) < dzis,
    };
  })
  .sort((lewe, prawe) => lewe.data - prawe.data);

export const rokKalendarza = (() => {
  const lata = [...new Set(kalendarz.map((wydarzenie) => wydarzenie.data.getFullYear()))].sort();
  if (!lata.length) return String(new Date().getFullYear());
  return lata.length > 1 ? `${lata[0]}–${lata[lata.length - 1]}` : String(lata[0]);
})();

/* ---- Dokumenty ------------------------------------------------------
   Zakladka pojawia sie na stronie tylko wtedy, gdy ma choc jeden
   opublikowany dokument. Pusta zakladka to slepy zaulek dla mieszkanca. */

const wszystkieDokumenty = sprawdz('dokumenty.json', schematDokumentow, dokumentySurowe);

export const dokumenty = wszystkieDokumenty.kategorie
  .map((kategoria) => ({
    ...kategoria,
    pozycje: wszystkieDokumenty.dokumenty.filter(
      (dokument) => dokument.published && dokument.kategoria === kategoria.id
    ),
  }))
  .filter((kategoria) => kategoria.pozycje.length > 0);

/* ---- Galeria --------------------------------------------------------
   Lata schodza od najnowszego. Album bez zdjec nie ma po co istniec. */

export const galeria = sprawdz('galeria.json', schematGalerii, galeriaSurowa)
  .albumy.filter((album) => album.published && album.photos.length > 0);

export const lataGalerii = [...new Set(galeria.map((album) => album.year))].sort((a, b) =>
  b.localeCompare(a)
);
