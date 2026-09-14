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
// W tresci ta sama fotografia to '/img/event/2026/DSC_6133.JPG'.
const mapa = new Map(
  Object.entries(pliki).map(([klucz, modul]) => [
    klucz.replace(/^\.\/images/, '/img'),
    modul.default,
  ])
);

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
