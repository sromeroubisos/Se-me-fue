// Genera los PNG de la app (web y escritorio) a partir de los SVG de web/icons.
// Uso: npm run icons
import sharp from 'sharp';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = new URL('..', import.meta.url);
const at = (p) => fileURLToPath(new URL(p, root));

const rounded = await readFile(at('web/icons/icon.svg'));
const fullBleed = await readFile(at('web/icons/icon-maskable.svg'));
await mkdir(at('build/'), { recursive: true });

const outputs = [
  [rounded, 192, 'web/icons/icon-192.png'],
  [rounded, 512, 'web/icons/icon-512.png'],
  [fullBleed, 512, 'web/icons/icon-maskable-512.png'],
  [fullBleed, 180, 'web/icons/apple-touch-icon.png'],
  [rounded, 1024, 'build/icon.png']
];

for (const [svg, size, file] of outputs) {
  // Rasteriza el SVG a la densidad justa para que no quede borroso.
  await sharp(svg, { density: Math.ceil(72 * size / 512) }).resize(size, size).png().toFile(at(file));
  console.log(`✓ ${file} (${size}px)`);
}
