const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('--- Compiling Electron Main Process ---');

// Clean dist-electron directory completely to prevent any stale files
if (fs.existsSync('dist-electron')) {
  fs.rmSync('dist-electron', { recursive: true, force: true });
}
fs.mkdirSync('dist-electron', { recursive: true });

try {
  // Compile the main process TypeScript file (which generates main.js)
  execSync('tsc electron/main.ts --outDir dist-electron --module commonjs --target es6 --esModuleInterop', {
    stdio: 'inherit',
  });
  console.log('✓ Compiled electron/main.ts successfully.');
} catch (error) {
  console.error('✗ Failed to compile electron/main.ts:', error);
  process.exit(1);
}
