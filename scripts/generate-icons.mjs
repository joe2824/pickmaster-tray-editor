/**
 * Generates all required PWA and favicon PNG icons from the SVG source.
 * Run: node scripts/generate-icons.mjs
 * Requires: npm install --no-save sharp
 */
import sharp from 'sharp';
import { readFileSync } from 'fs';
import { mkdir, writeFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgSrc = readFileSync(resolve(root, 'static/icons/icon.svg'));

// Maskable version: replace rounded-rect bg with full-bleed rect
const svgMaskable = Buffer.from(
  svgSrc.toString().replace('rx="88"', 'rx="0"')
);

await mkdir(resolve(root, 'static/icons'), { recursive: true });

const icons = [
  { file: 'static/icons/icon-192.png',          size: 192, src: svgSrc },
  { file: 'static/icons/icon-512.png',          size: 512, src: svgSrc },
  { file: 'static/icons/icon-192-maskable.png', size: 192, src: svgMaskable },
  { file: 'static/icons/icon-512-maskable.png', size: 512, src: svgMaskable },
  { file: 'static/icons/apple-touch-icon.png',  size: 180, src: svgSrc },
  { file: 'static/favicon-64.png',              size: 64,  src: svgSrc },
];

for (const { file, size, src } of icons) {
  await sharp(src).resize(size, size).png().toFile(resolve(root, file));
  console.log(`✓  ${file}`);
}

console.log('\nAll icons generated.');
