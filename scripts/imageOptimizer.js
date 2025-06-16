// imageOptimizer.js
const imagemin = require('imagemin');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminPngquant = require('imagemin-pngquant');
const imageminGifsicle = require('imagemin-gifsicle');
const imageminSvgo = require('imagemin-svgo');
const imageminWebp = require('imagemin-webp');
const fs = require('fs');
const path = require('path');

// Ścieżki do folderów z obrazami
const imagePaths = [
  'public/img/**/*.{jpg,jpeg,png,gif,svg}',
  'build/img/**/*.{jpg,jpeg,png,gif,svg}'
];

// Funkcja generująca zoptymalizowane obrazy
async function optimizeImages() {
  console.log('Rozpoczęcie optymalizacji obrazów...');

  try {
    // Optymalizacja standardowych formatów
    const standardResults = await imagemin(imagePaths, {
      destination: 'build/img/',
      plugins: [
        imageminMozjpeg({ quality: 75 }),
        imageminPngquant({ quality: [0.65, 0.8] }),
        imageminGifsicle(),
        imageminSvgo()
      ]
    });

    // Konwersja do WebP
    const webpResults = await imagemin(imagePaths, {
      destination: 'build/img/',
      plugins: [
        imageminWebp({ quality: 75 })
      ]
    });

    console.log(`Zoptymalizowano ${standardResults.length + webpResults.length} obrazów!`);
  } catch (error) {
    console.error('Błąd podczas optymalizacji obrazów:', error);
  }
}

// Uruchomienie funkcji
optimizeImages();
