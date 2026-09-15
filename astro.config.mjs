// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Adres produkcyjny. Uzywany przy generowaniu mapy strony i adresow
  // kanonicznych - bez tego w znacznikach ladowaly relatywne sciezki.
  site: 'https://dolinka-olkusz.pl',

  // Bylo 'file', bo strona miala jeden adres. Odkad ogloszenia maja
  // wlasne podstrony, 'file' dawaloby adresy w rodzaju
  // /aktualnosci/zebranie.html - z rozszerzeniem, ktore widac w wynikach
  // Google i na plakacie z kodem QR. 'directory' generuje
  // /aktualnosci/zebranie/index.html, czyli adres bez rozszerzenia.
  // Apache na vh.pl sam podstawia index.html dla adresu katalogu.
  build: {
    format: 'directory',
  },

  // Zdjecia przetwarzane przy budowaniu. Domyslnie Astro uzywa sharpa;
  // podajemy to jawnie, zeby bylo widac, skad bierze sie ta zaleznosc.
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },

  // Astro i tak to robi domyslnie - zapisane wprost, zeby nikt tego
  // przypadkiem nie odkrecil przy nastepnej zmianie konfiguracji.
  compressHTML: true,
});
