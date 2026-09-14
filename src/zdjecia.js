/**
 * zdjecia.js — most miedzy sciezkami w tresci a plikami, ktore Astro
 * potrafi przetworzyc.
 *
 * Dlaczego to w ogole istnieje:
 *
 * Astro generuje miniatury i lzejsze warianty tylko dla zdjec lezacych
 * w `src/`. Pliki z `public/` idą na serwer jak leza - telefon o szerokosci
 * 390px pobiera ten sam plik 1920px co monitor. Przy galerii z 53 zdjeciami
 * w jednym albumie to dziesiatki megabajtow na komorke w parku.
 *
 * Dlatego zdjecia przenosimy do `src/images/`, ALE sciezki w plikach JSON
 * zostaja bez zmian (`/img/event/...`). Powod jest praktyczny: tych sciezek
 * jest 227, wpisuje je panel, i kazda zmiana formatu to okazja do pomylki.
 * Ten plik tlumaczy jedno na drugie.
 *
 * import.meta.glob z eager: true wczytuje metadane WSZYSTKICH zdjec przy
 * budowaniu (wymiary, format) - bez tego nie da sie z nich zrobic wariantow.
 * Same pliki trafiaja do wyniku tylko wtedy, gdy ktos ich faktycznie uzyje.
 */

const pliki = import.meta.glob('./images/**/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,WEBP,avif,AVIF}', {
  eager: true,
});

// Klucze z globa wygladaja jak './images/event/2026/DSC_6133.JPG'.
// Ta sama fotografia moze byc zapisana w tresci na dwa sposoby:
//
//   '/img/event/2026/DSC_6133.JPG'     - tak sa zapisane wpisy sprzed panelu
//   '/images/event/2026/DSC_6133.JPG'  - tak zapisuje panel (Tina)
//
// Panel liczy sciezke wzgledem `publicFolder: 'src'`, wiec dostaje
// '/images/...'. Przepisywanie 227 istniejacych sciezek przy wlaczaniu
// panelu byloby 227 okazjami do literowki, wiec obie postaci prowadza
// do tego samego pliku.
const mapa = new Map();

for (const [klucz, modul] of Object.entries(pliki)) {
  const zImages = klucz.replace(/^\./, ''); // '/images/...'
  mapa.set(zImages, modul.default);
  mapa.set(zImages.replace(/^\/images/, '/img'), modul.default);
}

/* ---- Pliki do pobrania (PDF) ----------------------------------------
   Panel wgrywa KAZDY plik do `src/images/`, takze regulaminy. Astro nie
   serwuje `src/` samo z siebie - trzeba plik zaimportowac, zeby dostal
   adres w zbudowanej stronie. Stad drugi glob, tym razem po adres (?url),
   a nie po metadane obrazu.

   Regulaminy wgrane wczesniej leza w `public/document/` i dzialaja bez
   tego - `plik()` zwraca dla nich null, a sekcja uzywa sciezki wprost. */
const dokumentyZrodlowe = import.meta.glob('./images/**/*.{pdf,PDF}', {
  eager: true,
  query: '?url',
  import: 'default',
});

const mapaDokumentow = new Map();

for (const [klucz, adres] of Object.entries(dokumentyZrodlowe)) {
  const zImages = klucz.replace(/^\./, '');
  mapaDokumentow.set(zImages, adres);
  mapaDokumentow.set(zImages.replace(/^\/images/, '/img'), adres);
}

/**
 * Adres pliku do pobrania. Zwraca null dla plikow lezacych w `public/` -
 * te maja juz gotowy adres i uzywa sie ich bez zmian.
 */
export function plik(sciezka) {
  if (!sciezka) return null;

  const czysta = String(sciezka).trim();
  return mapaDokumentow.get(czysta) ?? mapaDokumentow.get(safeDecode(czysta)) ?? null;
}

/**
 * Zamienia sciezke z pliku tresci na obiekt zdjecia, ktory Astro umie
 * przetworzyc. Zwraca null, gdy pliku nie ma - wtedy sekcja pomija
 * zdjecie zamiast wysypywac cala strone.
 */
export function obraz(sciezka) {
  if (!sciezka) return null;

  const czysta = String(sciezka).trim();

  // Sciezki wpisane przez panel bywaja zakodowane (%20 zamiast spacji),
  // a klucze globa nigdy nie sa. Probujemy obu postaci.
  return (
    mapa.get(czysta) ??
    mapa.get(safeDecode(czysta)) ??
    null
  );
}

function safeDecode(wartosc) {
  try {
    return decodeURI(wartosc);
  } catch (blad) {
    return wartosc;
  }
}

/** Ile zdjec faktycznie znaleziono - uzywane przy sprawdzaniu kompletu. */
export const liczbaZnalezionych = mapa.size;
