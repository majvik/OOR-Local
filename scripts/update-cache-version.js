#!/usr/bin/env node
/**
 * Simple cache-busting helper.
 * Adds/updates ?v=<timestamp> query params for /src/css and /src/js assets
 * inside static HTML files so browsers fetch fresh bundles without manually
 * clearing caches.
 */

const { readFileSync, writeFileSync } = require('fs');
const { resolve } = require('path');

const ROOT = resolve(__dirname, '..');
const TARGET_FILES = ['index.html', 'studio.html', 'dawgs.html', 'events.html', 'talk-show.html', 'artists.html'].map((file) =>
  resolve(ROOT, file)
);

const VERSION = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
// Находит /src/css или /src/js пути с опциональным ?v= параметром
const ASSET_REGEX =
  /(href|src)=("|\')(\/src\/(?:css|js)\/[^"\']+?)(?:\?v=[^"\']*)?(\2)/g;

function updateFile(filePath) {
  let content = readFileSync(filePath, 'utf8');
  let hasChanges = false;
  
  const updated = content.replace(ASSET_REGEX, (match, attr, quote, path) => {
    hasChanges = true;
    return `${attr}=${quote}${path}?v=${VERSION}${quote}`;
  });

  if (hasChanges && content !== updated) {
    writeFileSync(filePath, updated, 'utf8');
    console.log(`Updated cache version in ${filePath}`);
    return true;
  } else if (!hasChanges) {
    console.log(`No matching assets found in ${filePath}`);
    return false;
  } else {
    console.log(`Cache version already up to date in ${filePath}`);
    return false;
  }
}

console.log(`Applying cache version ${VERSION}`);
TARGET_FILES.forEach(updateFile);


