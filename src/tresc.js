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

/* Lista rzeczy, ktore zostaly pominiete. Wypisujemy ja na koniec, zebrana
   w jednym miejscu - inaczej ostrzezenia gina w tysiacu linii logu z
   przetwarzania zdjec. */
const pominiete = [];

function opiszBledy(blad) {
  return blad.issues
    .map((problem) => {
      const gdzie = problem.path.length ? problem.path.join(' → ') : '(cały wpis)';
      return `${gdzie}: ${problem.message}`;
    })
    .join('; ');
}

/**
 * Sprawdza listę wpisów POJEDYNCZO.
 *
 * To jest najwazniejsza decyzja w tym pliku. Wczesniej caly plik szedl
 * przez jedno sprawdzenie i pierwszy zly wpis wysypywal budowanie - czyli
 * literowka w jednym ogloszeniu zatrzymywala publikacje CALEJ strony,
 * razem z wszystkim, co bylo poprawne. Przewodniczacy nie widzi logow
 * z GitHuba, wiec dowiedzialby sie o tym dopiero wtedy, gdy ktos zapyta,
 * czemu strona nie dziala.
 *
 * Teraz zepsuty wpis jest pomijany, reszta strony wychodzi normalnie,
 * a powod laduje w podsumowaniu budowania.
 *
 * Pierwsza linia obrony jest w panelu (tina/config.ts) - tam pola sa
 * sprawdzane przy wpisywaniu i przewodniczacy widzi blad od razu.
 * To tutaj jest siatka bezpieczenstwa, nie glowne zabezpieczenie.
 */
function kolekcja(nazwaPliku, klucz, schematWpisu, dane, nazwaWpisu = 'wpis') {
  const lista = dane?.[klucz];

  if (!Array.isArray(lista)) {
    // Brak calej listy to co innego niz zly wpis - pliku nie da sie
    // uratowac zgadywaniem. Zwracamy pusto i mowimy o tym glosno.
    pominiete.push(`${nazwaPliku}: brak listy „${klucz}” — sekcja będzie pusta`);
    return [];
  }

  const dobre = [];

  lista.forEach((wpis, i) => {
    const wynik = schematWpisu.safeParse(wpis);

    if (wynik.success) {
      dobre.push(wynik.data);
      return;
    }

    // Do opisu bierzemy tytul, jesli jakikolwiek da sie odczytac -
    // numer pozycji nic nie mowi komus, kto patrzy na panel.
    const etykieta =
      wpis?.title || wpis?.tytul || wpis?.imieNazwisko || `${nazwaWpisu} nr ${i + 1}`;

    pominiete.push(`${nazwaPliku}: pominięto „${etykieta}” — ${opiszBledy(wynik.error)}`);
  });

  return dobre;
}

/**
 * Sprawdza plik ustawien strony. Tu nie ma listy, z ktorej da sie cos
 * wyrzucic - kazde pole jest czescia szkieletu strony. Dlatego zamiast
 * pomijac, podstawiamy wartosc zastepcza (patrz `.catch()` w schemacie).
 */
function ustawienia(nazwaPliku, schemat, dane) {
  const wynik = schemat.safeParse(dane);

  if (!wynik.success) {
    // Tu juz naprawde nie ma co ratowac - plik ma zla budowe, a nie zla
    // wartosc w polu. Zatrzymujemy budowanie z czytelnym opisem.
    throw new Error(
      `\n\n┌─────────────────────────────────────────────────────────\n` +
        `│ BŁĄD W TREŚCI: src/content/${nazwaPliku}\n` +
        `└─────────────────────────────────────────────────────────\n` +
        `   • ${opiszBledy(wynik.error)}\n\n` +
        `Popraw plik i zapisz — strona przebuduje się sama.\n`
    );
  }

  return wynik.data;
}

/** Wypisuje podsumowanie na koniec wczytywania tresci. */
function podsumujTresc() {
  if (pominiete.length === 0) return;

  console.warn(
    `\n┌─────────────────────────────────────────────────────────\n` +
      `│ UWAGA: ${pominiete.length} rzecz(y) pominięto w treści\n` +
      `└─────────────────────────────────────────────────────────\n` +
      pominiete.map((wiersz) => `   • ${wiersz}`).join('\n') +
      `\n\n   Strona zbudowała się mimo to — te pozycje po prostu` +
      `\n   się na niej nie pojawią. Popraw je w panelu i zapisz.\n`
  );
}

/* Sciezki do plikow zapisywane byly raz z ukosnikiem, raz bez
   ("img/kino.jpg" i "/img/kino.jpg"). Sprowadzamy do jednej postaci. */
const sciezka = z
  .string()
  .trim()
  .transform((wartosc) => (wartosc && !wartosc.startsWith('/') ? `/${wartosc}` : wartosc));

const niepusty = (co) => z.string().trim().min(1, `${co} nie może być puste`);

/* Pole, ktore w razie bledu dostaje wartosc zastepcza zamiast zatrzymywac
   budowanie. Uzywane tam, gdzie brak wartosci rozwalilby uklad strony. */
const zZapasem = (schemat, zapas) => schemat.catch(zapas);

/* Adres strony internetowej. Ludzie wklejaja "www.olkusz.pl" albo
   "umig.olkusz.pl" bez "https://" - to nie jest blad, tylko sposob,
   w jaki normalnie zapisuje sie adresy. Dopisujemy brakujacy poczatek
   zamiast odrzucac wpis. */
const adresWww = z
  .string()
  .trim()
  .transform((wartosc) => {
    if (!wartosc) return wartosc;
    return /^https?:\/\//i.test(wartosc) ? wartosc : `https://${wartosc}`;
  })
  .pipe(z.string().url('To nie wygląda na adres strony'));

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
    // Puste punkty listy (ktos kliknal "dodaj" i nie wpisal nic) odsiewamy
    // tutaj, zamiast pokazywac mieszkancowi pusty punktor.
    coRobimy: zZapasem(z.array(z.string().trim().catch('')), []),
    czymSieZajmujemy: zZapasem(z.array(z.string().trim().catch('')), []),
  }),
  kontakt: z.object({
    adres: niepusty('Adres'),
    /* E-mail i Facebook: zly wpis nie moze zabrac calej sekcji Kontakt,
       w ktorej jest jeszcze adres i numery alarmowe. Puste = sekcja
       po prostu nie pokaze tego odnosnika. */
    email: zZapasem(z.string().trim().email(), ''),
    facebook: zZapasem(adresWww, ''),
    przewodniczacy: z.object({
      imieNazwisko: niepusty('Imię i nazwisko'),
      telefon: niepusty('Telefon'),
    }),
    /* Cala lista z zapasem: gdyby ktos skasowal ja w panelu, sekcja
       pokaze sie bez numerow, zamiast wywalic budowanie. Pojedyncze
       zepsute pozycje odsiewamy nizej. */
    /* `.catch(null)` stoi przy POJEDYNCZEJ pozycji, nie przy calej liscie.
       Roznica jest istotna: gdyby zapas byl na liscie, jeden zly numer
       kasowalby wszystkie pozostale, razem z numerami alarmowymi.
       Tak zepsuta pozycja znika sama, a reszta zostaje. */
    telefony: zZapasem(
      z.array(
        z
          .object({
            numer: niepusty('Numer'),
            opis: niepusty('Opis'),
            // Numery alarmowe sa wyroznione na stronie - to nie jest ozdoba,
            // tylko informacja, ze tego numeru uzywa sie w innej sytuacji.
            alarmowy: zZapasem(z.boolean(), false),
          })
          .catch(null)
      ),
      []
    ),
    linki: zZapasem(
      z.array(
        z
          .object({
            nazwa: niepusty('Nazwa'),
            adres: adresWww,
          })
          .catch(null)
      ),
      []
    ),
  }),
});

/* Od tego miejsca schematy opisuja POJEDYNCZY wpis, nie caly plik.
   Sprawdzanie idzie wpis po wpisie (patrz `kolekcja`), zeby jedna
   literowka nie zabierala calej sekcji. */

const wpisAktualnosci = z.object({
      title: niepusty('Tytuł'),
      text: niepusty('Treść'),
      // Zle wpisana sciezka do zdjecia nie moze skasowac ogloszenia -
      // tresc jest wazniejsza niz plakat. Brak zdjecia = wpis bez zdjecia.
      img: zZapasem(sciezka.optional(), undefined),
      // Adres wlasnej podstrony wpisu. Puste = wyliczamy z tytulu.
      slug: zZapasem(z.string().trim().optional(), undefined),
      // Data publikacji. Nieobowiazkowa, bo starsze wpisy jej nie maja.
      // Zle wpisana data odpada sama - ogloszenie pokaze sie bez daty,
      // zamiast zniknac ze strony.
      data: zZapasem(
        z
          .string()
          .trim()
          .regex(/^\d{4}-\d{2}-\d{2}$/)
          .optional(),
        undefined
      ),
      published: zZapasem(z.boolean(), true),
});

const wydarzenieKalendarza = z.object({
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
      dateText: zZapasem(z.string().trim().optional(), undefined),
      text: zZapasem(z.string().trim(), '').default(''),
      published: zZapasem(z.boolean(), true),
});

const dzialanie = z.object({
  tytul: niepusty('Tytuł'),
  opis: niepusty('Opis'),
  // Brak zdjecia nie usuwa dzialania - sekcja pokaze sama karte z opisem.
  zdjecie: zZapasem(sciezka.optional(), undefined),
  opublikowane: zZapasem(z.boolean(), true),
});

const czlonekZarzadu = z.object({
  imieNazwisko: niepusty('Imię i nazwisko'),
  funkcja: niepusty('Funkcja'),
  zdjecie: zZapasem(sciezka.optional(), undefined),
  opublikowane: zZapasem(z.boolean(), true),
});

const kategoriaDokumentow = z.object({
  /* Identyfikator laczy zakladke z dokumentami. Ludzie wpisuja tu
     "Koszykówka" albo "turniej 2026" - sprowadzamy do dozwolonej postaci
     zamiast odrzucac, bo odrzucenie zabiera cala zakladke razem z plikami. */
  id: z
    .string()
    .trim()
    .toLowerCase()
    .transform((wartosc) =>
      wartosc
        .replace(/ą/g, 'a').replace(/ć/g, 'c').replace(/ę/g, 'e')
        .replace(/ł/g, 'l').replace(/ń/g, 'n').replace(/ó/g, 'o')
        .replace(/ś/g, 's').replace(/ż/g, 'z').replace(/ź/g, 'z')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
    )
    .pipe(z.string().min(1, 'Identyfikator nie może być pusty')),
  label: niepusty('Nazwa zakładki'),
  icon: zZapasem(z.string().trim().optional(), undefined),
});

const dokument = z.object({
  title: niepusty('Nazwa'),
  description: zZapasem(z.string().trim(), '').default(''),
  file: sciezka,
  downloadName: zZapasem(z.string().trim().optional(), undefined),
  kategoria: niepusty('Zakładka'),
  published: zZapasem(z.boolean(), true),
});

const albumGalerii = z.object({
  title: niepusty('Nazwa albumu'),
  // .trim() PRZED sprawdzeniem: spacja doklejona w panelu ("2018 ")
  // zatrzymywala budowanie strony. Zbedna spacja to nie jest blad
  // w tresci - to jest cos, co program ma po cichu posprzatac.
  year: z
    .string()
    .trim()
    .regex(/^(19|20)\d{2}$/, 'Rok to cztery cyfry, np. 2026'),
  // Pojedyncze zdjecie ze zla sciezka nie moze skasowac albumu z pięćdziesięcioma
  // innymi. Zle wpisy odpadaja, album zostaje.
  photos: zZapasem(z.array(zZapasem(sciezka, '')), []),
  published: zZapasem(z.boolean(), true),
});

/* =====================================================================
   Dane gotowe do wyswietlenia
   ===================================================================== */

const stronaSprawdzona = ustawienia('strona.json', schematStrony, stronaSurowa);

export const strona = {
  ...stronaSprawdzona,
  oNas: {
    ...stronaSprawdzona.oNas,
    // Puste punkty listy odsiewamy tu, a nie w szablonie - szablon ma
    // rysowac, a nie decydowac, co jest tresci a co niedokonczonym wpisem.
    coRobimy: stronaSprawdzona.oNas.coRobimy.filter(Boolean),
    czymSieZajmujemy: stronaSprawdzona.oNas.czymSieZajmujemy.filter(Boolean),
  },
  kontakt: {
    ...stronaSprawdzona.kontakt,
    telefony: stronaSprawdzona.kontakt.telefony.filter(Boolean),
    linki: stronaSprawdzona.kontakt.linki.filter(Boolean),
  },
};

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

const wpisySurowe = kolekcja(
  'aktualnosci.json',
  'wpisy',
  wpisAktualnosci,
  aktualnosciSurowe,
  'ogłoszenie'
).filter((wpis) => wpis.published);

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

export const dzialania = kolekcja(
  'dzialania.json',
  'pozycje',
  dzialanie,
  dzialaniaSurowe,
  'działanie'
).filter((pozycja) => pozycja.opublikowane);

export const zarzad = kolekcja(
  'zarzad.json',
  'osoby',
  czlonekZarzadu,
  zarzadSurowy,
  'osoba'
).filter((osoba) => osoba.opublikowane);

/* ---- Kalendarz ------------------------------------------------------
   Kolejnosc i wyszarzanie minionych wydarzen wynikaja z daty, a nie
   z kolejnosci wpisow w pliku. Przewodniczacy dodaje wydarzenie gdziekolwiek
   na liscie i trafia ono na wlasciwe miejsce samo. */

// Ostatni dzien miesiaca danej daty. Dla wydarzen z terminem przyblizonym
// ("wrzesien 2026") - takie nie powinno stac sie "minione" 2 wrzesnia.
const koniecMiesiaca = (data) =>
  new Date(data.getFullYear(), data.getMonth() + 1, 0, 23, 59, 59);

const dzis = new Date();

export const kalendarz = kolekcja(
  'kalendarz.json',
  'wydarzenia',
  wydarzenieKalendarza,
  kalendarzSurowy,
  'wydarzenie'
)
  .filter((wydarzenie) => wydarzenie.published)
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

const kategorieDokumentow = kolekcja(
  'dokumenty.json',
  'kategorie',
  kategoriaDokumentow,
  dokumentySurowe,
  'zakładka'
);

const plikiDokumentow = kolekcja(
  'dokumenty.json',
  'dokumenty',
  dokument,
  dokumentySurowe,
  'dokument'
);

/* Dokument przypisany do nieistniejacej zakladki nie pokazalby sie nigdzie
   i nikt by nie wiedzial dlaczego. Mowimy o tym wprost. */
const znaneZakladki = new Set(kategorieDokumentow.map((kategoria) => kategoria.id));

plikiDokumentow
  .filter((plik) => plik.published && !znaneZakladki.has(plik.kategoria))
  .forEach((plik) => {
    pominiete.push(
      `dokumenty.json: „${plik.title}” ma zakładkę „${plik.kategoria}”, ` +
        `której nie ma na liście zakładek — dokument się nie pokaże`
    );
  });

export const dokumenty = kategorieDokumentow
  .map((kategoria) => ({
    ...kategoria,
    pozycje: plikiDokumentow.filter(
      (plik) => plik.published && plik.kategoria === kategoria.id
    ),
  }))
  .filter((kategoria) => kategoria.pozycje.length > 0);

/* ---- Galeria --------------------------------------------------------
   Lata schodza od najnowszego. Album bez zdjec nie ma po co istniec. */

export const galeria = kolekcja('galeria.json', 'albumy', albumGalerii, galeriaSurowa, 'album')
  .map((album) => ({ ...album, photos: album.photos.filter(Boolean) }))
  .filter((album) => album.published && album.photos.length > 0);

export const lataGalerii = [...new Set(galeria.map((album) => album.year))].sort((a, b) =>
  b.localeCompare(a)
);

/* Na koniec: jedno podsumowanie wszystkiego, co zostalo pominiete.
   Wywolanie stoi tutaj, a nie przy kazdym pliku, zeby lista byla w logu
   budowania w jednym kawalku. */
podsumujTresc();
