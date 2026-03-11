import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const svg = readFileSync(join(root, 'static/favicon.svg'));

const sizes = [
  { file: 'static/apple-touch-icon.png', size: 180 },
  { file: 'static/icon-192.png', size: 192 },
  { file: 'static/icon-512.png', size: 512 },
];

for (const { file, size } of sizes) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(join(root, file));
  console.log(`Generated ${file} (${size}x${size})`);
}
