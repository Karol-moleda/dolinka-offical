/**
 * sitemap.xml — lista adresów strony dla wyszukiwarek.
 *
 * Wczesniej byl to plik wpisany recznie w `public/`, z jednym adresem.
 * Odkad kazde ogloszenie ma wlasna podstrone, taka lista rozjechalaby sie
 * z rzeczywistoscia przy pierwszym wpisie dodanym przez przewodniczacego -
 * a nikt by tego nie zauwazyl, bo mapy strony nie oglada zaden czlowiek.
 *
 * Dlatego powstaje przy budowaniu, z tej samej tresci co strona.
 */
import { aktualnosci } from '../tresc.js';

export async function GET({ site }) {
  const dzis = new Date().toISOString().slice(0, 10);

  const adresy = [
    { loc: '/', priorytet: '1.0', zmiana: 'weekly' },
    ...aktualnosci.map((wpis) => ({
      loc: wpis.adres,
      priorytet: '0.8',
      zmiana: 'monthly',
      data: wpis.data || undefined,
    })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${adresy
  .map(
    (adres) => `  <url>
    <loc>${new URL(adres.loc, site).href}</loc>
    <lastmod>${adres.data ?? dzis}</lastmod>
    <changefreq>${adres.zmiana}</changefreq>
    <priority>${adres.priorytet}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}
