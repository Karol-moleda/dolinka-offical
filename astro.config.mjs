// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  // Adres produkcyjny. Uzywany przy generowaniu mapy strony i adresow
  // kanonicznych - bez tego w znacznikach ladowaly relatywne sciezki.
  site: 'https://dolinka-olkusz.pl',

  // Strona ma jeden adres, wiec format nie ma tu wielkiego znaczenia,
  // ale 'file' generuje dist/index.html zamiast dist/index/index.html.
  build: {
    format: 'file',
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
