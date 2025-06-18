// This script will move all unused CSS files to an archive folder
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a backup directory
const backupDir = path.join(__dirname, '../src/styles/legacy-backup');

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// List of CSS files we want to clean up
const filesToCleanup = [
  'aerial-view-fix.css',
  'background-fix.css',
  'colorful-original.css',
  'contact-contrast-fix.css',
  'contact-enhanced-contrast.css',
  'dark-mode.css',
  'enhanced-text-visibility.css',
  'event-card-fix.css',
  'final-fixes.css',
  'fix-backgrounds.css',
  'fix-bg-images.css',
  'fixes.css',
  'gallery-fix.css',
  'gallery-lightbox-fix.css',
  'header-fix.css',
  'improved-text-contrast.css',
  'mode-transitions.css',
  'nav-contrast-fix.css',
  'override-dark-mode.css',
  'restore-original-styling.css',
  'scroll-fix.css',
  'services-contrast-fix.css',
  'services-light-mode-fix.css',
];

// Copy files to backup and then remove originals
filesToCleanup.forEach(file => {
  const srcPath = path.join(__dirname, '../src', file);
  const destPath = path.join(backupDir, file);
  
  if (fs.existsSync(srcPath)) {
    // Copy file to backup
    fs.copyFileSync(srcPath, destPath);
    console.log(`Backed up ${file} to ${backupDir}`);
    
    // Delete original file
    fs.unlinkSync(srcPath);
    console.log(`Deleted original ${file}`);
  }
});

console.log('Cleanup completed successfully!');
