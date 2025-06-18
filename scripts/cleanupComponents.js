// Cleanup script for removing unused accessibility components
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create backup directory
const backupDir = path.join(__dirname, '../src/components/legacy-backup');
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// List of components to move to backup
const filesToBackup = [
  'AccessibilityControls.jsx',
  'themeToggle.jsx',
  'FontSizeToggle.jsx'
];

// Copy files to backup and then remove originals
filesToBackup.forEach(file => {
  const srcPath = path.join(__dirname, '../src/components', file);
  const destPath = path.join(backupDir, file);
  
  if (fs.existsSync(srcPath)) {
    // Copy file to backup
    fs.copyFileSync(srcPath, destPath);
    console.log(`Backed up ${file} to ${backupDir}`);
    
    // Delete original file
    fs.unlinkSync(srcPath);
    console.log(`Deleted original ${file}`);
  } else {
    console.log(`File not found: ${srcPath}`);
  }
});

console.log('Cleanup completed successfully!');
