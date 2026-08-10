/**
 * Curated harvest.
 *
 * The full site holds 3,723 photographs (~0.90 GB). Shipping all of them would
 * blow past GitHub Pages' repo limit and make every build run sharp over
 * thousands of files, for images no visitor would ever reach.
 *
 * So: every logo and ornament, plus a cover and a gallery set per wedding.
 * That is enough to build a real portfolio index of all 27 weddings with
 * working galleries — the thing the live site's flat grid does not do.
 *
 *   node scripts/harvest-curated.mjs [perGallery=12]
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { createWriteStream, existsSync, statSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';
import { readFileSync } from 'node:fs';

const BASE = 'https://karinweddingsevents.com';
const PER_GALLERY = Number(process.argv[2]) || 12;
const harvest = JSON.parse(readFileSync('scripts/out/harvest.json', 'utf8'));

const slug = (k) =>
  k.split('/').pop().replace(/\.\w+$/, '').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);

const download = async (url, dest) => {
  if (existsSync(dest)) return statSync(dest).size;
  const r = await fetch(url);
  if (!r.ok) throw new Error('HTTP ' + r.status);
  await pipeline(Readable.fromWeb(r.body), createWriteStream(dest));
  return statSync(dest).size;
};

await mkdir('src/assets/brand', { recursive: true });
await mkdir('src/assets/photos', { recursive: true });

// ── brand: everything, it is tiny ───────────────────────────────────────
let bytes = 0, n = 0;
for (const item of [...harvest.logo, ...harvest.ornament]) {
  const ext = item.key.match(/\.(\w+)$/)[1].toLowerCase();
  try {
    bytes += await download(item.url, `src/assets/brand/${slug(item.key)}.${ext}`);
    n++;
  } catch (e) {
    console.warn('  ! brand', slug(item.key), e.message);
  }
}
console.log(`brand: ${n} files, ${Math.round(bytes / 1024)} KB`);

// ── galleries: group photos by the gallery page they appear on ──────────
const galleries = new Map();
for (const p of harvest.photo) {
  for (const page of p.pages) {
    const m = page.match(/^\/galerija\/([^/]+)\/?$/);
    if (!m) continue;
    if (!galleries.has(m[1])) galleries.set(m[1], []);
    galleries.get(m[1]).push(p);
  }
}
console.log(`\n${galleries.size} galleries found`);

// Titles come from the gallery page <title>; couple names are real.
const titleFor = async (gslug) => {
  try {
    const html = await fetch(`${BASE}/galerija/${gslug}/`).then((r) => r.text());
    const t = (html.match(/<title>([^<]+)<\/title>/) || [])[1] || gslug;
    return t.replace(/\s*[-|–]\s*Karin.*$/i, '').replace(/&amp;/g, '&').trim();
  } catch {
    return gslug;
  }
};

const manifest = [];
let photoBytes = 0, photoCount = 0;

for (const [gslug, photos] of galleries) {
  // Stable order, then take the first N — these read as the curated set the
  // gallery itself leads with.
  const picked = photos
    .filter((p) => /\.(jpe?g|png)$/i.test(p.key))
    .sort((a, b) => a.key.localeCompare(b.key))
    .slice(0, PER_GALLERY);

  const names = [];
  for (const p of picked) {
    const ext = p.key.match(/\.(\w+)$/)[1].toLowerCase();
    const name = `${gslug}--${slug(p.key)}`.slice(0, 70);
    try {
      photoBytes += await download(p.url, `src/assets/photos/${name}.${ext}`);
      names.push(name);
      photoCount++;
    } catch (e) {
      console.warn('  ! photo', name, e.message);
    }
  }

  manifest.push({ slug: gslug, title: await titleFor(gslug), photos: names });
  console.log(`  ${gslug.padEnd(34)} ${names.length}/${photos.length}`);
}

await writeFile('scripts/out/galleries.json', JSON.stringify(manifest, null, 2));
console.log(
  `\nphotos: ${photoCount} files, ${Math.round(photoBytes / 1024 / 1024)} MB` +
    `\nmanifest → scripts/out/galleries.json`
);
