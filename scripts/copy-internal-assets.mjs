import { cpSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const src = resolve(root, 'internal/assets');
const imgDest = resolve(root, 'public/images');
const pubDest = resolve(root, 'public');

if (!existsSync(src)) {
  console.error('ERROR: internal/ submodule is missing. Run: git submodule update --init');
  process.exit(1);
}

cpSync(resolve(src, 'logo.png'), resolve(imgDest, 'logo.png'));
cpSync(resolve(src, 'logo-alt.jpg'), resolve(imgDest, 'logo-alt.jpg'));
cpSync(resolve(src, 'favicon.ico'), resolve(pubDest, 'favicon.ico'));

console.log('Internal assets copied to public/');
