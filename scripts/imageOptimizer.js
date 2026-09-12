/**
 * Optymalizator zdjec dla public/img.
 *
 * Zdjecia prosto z aparatu maja po kilkanascie-kilkadziesiat MB, a w galerii
 * i tak wyswietlaja sie w kratce kilkuset pikseli. Ten skrypt zmniejsza je do
 * rozsadnego maksimum i przepakowuje - bez zmiany nazw, wiec sciezki
 * w src/content/galeria.json zostaja takie same.
 *
 * Uzycie:
 *   node scripts/imageOptimizer.js                  raport - co ile wazy, nic nie zmienia
 *   node scripts/imageOptimizer.js --run            zapisuje kopie do public/img-optimized/
 *   node scripts/imageOptimizer.js --run --replace  nadpisuje oryginaly w public/img/
 *
 * Zawsze zacznij od raportu, potem --run, obejrzyj wynik, dopiero --replace.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(ROOT, 'public', 'img');
const TARGET = path.join(ROOT, 'public', 'img-optimized');

// Najdluzszy bok. 1920 px wystarcza na pelny ekran i lightbox.
const MAX_SIDE = 1920;
const JPEG_QUALITY = 82;

const EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);

const args = process.argv.slice(2);
const RUN = args.includes('--run');
const REPLACE = args.includes('--replace');

const mb = (bytes) => `${(bytes / 1048576).toFixed(1)} MB`;

function collect(dir) {
  const out = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (full === TARGET) continue;
      out.push(...collect(full));
      continue;
    }

    if (EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
      out.push({ full, size: fs.statSync(full).size });
    }
  }

  return out;
}

function report(files) {
  const byFolder = new Map();

  for (const file of files) {
    const folder = path.relative(SOURCE, path.dirname(file.full)) || '.';
    const current = byFolder.get(folder) || { count: 0, size: 0, biggest: 0 };
    current.count += 1;
    current.size += file.size;
    current.biggest = Math.max(current.biggest, file.size);
    byFolder.set(folder, current);
  }

  const rows = [...byFolder.entries()].sort((a, b) => b[1].size - a[1].size);
  const total = files.reduce((sum, file) => sum + file.size, 0);

  console.log('');
  console.log('Katalog                                        plikow     razem   najwiekszy');
  console.log('-'.repeat(78));

  for (const [folder, data] of rows) {
    console.log(
      folder.padEnd(44).slice(0, 44),
      String(data.count).padStart(6),
      mb(data.size).padStart(10),
      mb(data.biggest).padStart(11)
    );
  }

  console.log('-'.repeat(78));
  console.log('RAZEM'.padEnd(44), String(files.length).padStart(6), mb(total).padStart(10));
  console.log('');

  return total;
}

async function optimize(files, totalBefore) {
  let sharp;
  try {
    sharp = (await import('sharp')).default;
  } catch (error) {
    console.error('Brak pakietu sharp. Zainstaluj: npm install --save-dev sharp');
    process.exit(1);
  }

  let totalAfter = 0;
  let skipped = 0;

  for (const [index, file] of files.entries()) {
    const relative = path.relative(SOURCE, file.full);
    const destination = REPLACE ? file.full : path.join(TARGET, relative);
    const temporary = `${destination}.tmp`;

    fs.mkdirSync(path.dirname(destination), { recursive: true });

    try {
      const image = sharp(file.full).rotate();
      const meta = await image.metadata();
      const needsResize = Math.max(meta.width || 0, meta.height || 0) > MAX_SIDE;

      let pipeline = image.resize(
        needsResize ? { width: MAX_SIDE, height: MAX_SIDE, fit: 'inside' } : undefined
      );

      // Format wyjsciowy musi zgadzac sie z rozszerzeniem pliku - inaczej
      // PNG z przezroczystoscia zamienilby sie w JPEG z czarnym tlem.
      const extension = path.extname(file.full).toLowerCase();

      if (extension === '.png') {
        pipeline = pipeline.png({ compressionLevel: 9 });
      } else if (extension === '.webp') {
        pipeline = pipeline.webp({ quality: JPEG_QUALITY });
      } else {
        pipeline = pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true });
      }

      await pipeline.toFile(temporary);

      const after = fs.statSync(temporary).size;

      // Jesli optymalizacja nic nie daje, zostawiamy oryginal.
      if (after >= file.size) {
        fs.unlinkSync(temporary);
        if (!REPLACE) fs.copyFileSync(file.full, destination);
        totalAfter += file.size;
        skipped += 1;
      } else {
        fs.renameSync(temporary, destination);
        totalAfter += after;
      }
    } catch (error) {
      console.error(`  BLAD: ${relative} - ${error.message}`);
      totalAfter += file.size;
      skipped += 1;
      continue;
    }

    if ((index + 1) % 10 === 0 || index === files.length - 1) {
      process.stdout.write(`\r  przetworzono ${index + 1}/${files.length}`);
    }
  }

  console.log('\n');
  console.log(`Przed:  ${mb(totalBefore)}`);
  console.log(`Po:     ${mb(totalAfter)}`);
  console.log(`Zysk:   ${mb(totalBefore - totalAfter)} (${((1 - totalAfter / totalBefore) * 100).toFixed(1)}%)`);
  if (skipped) console.log(`Pominietych (bez zysku lub blad): ${skipped}`);
  console.log('');

  if (!REPLACE) {
    console.log(`Wynik lezy w public/img-optimized/. Obejrzyj kilka zdjec,`);
    console.log(`a gdy jakosc jest w porzadku, uruchom: node scripts/imageOptimizer.js --run --replace`);
    console.log('');
  }
}

(async () => {
  if (!fs.existsSync(SOURCE)) {
    console.error(`Nie znaleziono katalogu ${SOURCE}`);
    process.exit(1);
  }

  const files = collect(SOURCE);

  if (!files.length) {
    console.log('Brak zdjec do przetworzenia.');
    return;
  }

  const totalBefore = report(files);

  if (!RUN) {
    console.log(`Maksymalny bok po optymalizacji: ${MAX_SIDE} px, jakosc JPEG: ${JPEG_QUALITY}.`);
    console.log('Nic nie zostalo zmienione. Aby przetworzyc: node scripts/imageOptimizer.js --run');
    console.log('');
    return;
  }

  if (REPLACE) {
    console.log('UWAGA: oryginaly w public/img/ zostana nadpisane.');
    console.log('Upewnij sie, ze masz kopie zdjec poza repozytorium.');
    console.log('');
  }

  await optimize(files, totalBefore);
})();
