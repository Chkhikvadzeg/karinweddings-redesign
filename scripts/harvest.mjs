/**
 * Full asset harvest from the legacy WordPress site.
 *
 * The gallery post type (dt_gallery) holds her real portfolio — the earlier
 * scrape only touched the five main pages. This walks every sitemap, visits
 * every page, and collects images from <img src>, srcset, and CSS
 * background-image declarations.
 *
 *   node scripts/harvest.mjs --dry     enumerate only, download nothing
 *   node scripts/harvest.mjs           download everything
 */
import { writeFile, mkdir } from 'node:fs/promises';
import { createWriteStream, existsSync, statSync } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const BASE = 'https://karinweddingsevents.com';
const DRY = process.argv.includes('--dry');

const SITEMAPS = [
  '/page-sitemap.xml',
  '/dt_gallery-sitemap.xml',
  '/dt_gallery_category-sitemap.xml',
];

const get = async (u) => {
  const r = await fetch(u, { headers: { 'user-agent': 'Mozilla/5.0 (asset harvest)' } });
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.text();
};

// ── 1. every page URL ───────────────────────────────────────────────────
const pageUrls = new Set();
for (const sm of SITEMAPS) {
  try {
    const xml = await get(BASE + sm);
    for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) pageUrls.add(m[1].trim());
    console.log(`${sm.padEnd(34)} ${[...xml.matchAll(/<loc>/g)].length} urls`);
  } catch (e) {
    console.warn(`${sm} failed: ${e.message}`);
  }
}
console.log(`\n${pageUrls.size} unique pages\n`);

// ── 2. every image reference on every page ──────────────────────────────
const IMG_RE = /\.(?:jpe?g|png|webp|svg)(?:\?|$)/i;
const found = new Map(); // canonical base -> {url, width, pages:Set}

/** WordPress emits foo-1024x683.jpg / foo-scaled.jpg; collapse to one key. */
const canonical = (u) =>
  u
    .split('?')[0]
    .replace(/-\d+x\d+(?=\.\w+$)/, '')
    .replace(/-scaled(?=\.\w+$)/, '')
    .replace(/^https?:\/\/[^/]+/, '');

const widthOf = (u) => {
  const m = u.match(/-(\d+)x\d+\.\w+$/);
  if (m) return +m[1];
  return /-scaled\./.test(u) ? 2560 : 99999; // unsuffixed original wins
};

let visited = 0;
for (const page of pageUrls) {
  let html;
  try {
    html = await get(page);
  } catch (e) {
    console.warn('  ! page failed', page, e.message);
    continue;
  }
  visited++;

  const refs = [
    ...[...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]),
    ...[...html.matchAll(/data-src="([^"]+)"/gi)].map((m) => m[1]),
    ...[...html.matchAll(/srcset="([^"]+)"/gi)].flatMap((m) =>
      m[1].split(',').map((s) => s.trim().split(/\s+/)[0])
    ),
    ...[...html.matchAll(/url\((?:&quot;|["'])?([^)"'&]+?)(?:&quot;|["'])?\)/gi)].map((m) => m[1]),
  ];

  for (let u of refs) {
    if (!u || !IMG_RE.test(u)) continue;
    if (u.startsWith('//')) u = 'https:' + u;
    if (u.startsWith('/')) u = BASE + u;
    if (!u.startsWith(BASE)) continue; // skip third-party
    if (/\/plugins\/|\/themes\/.*\/(images|assets)\/|emoji|spinner|blank\.|lazy/i.test(u)) continue;

    const key = canonical(u);
    const w = widthOf(u);
    const prev = found.get(key);
    if (!prev || w > prev.width) found.set(key, { url: u, width: w, pages: prev?.pages ?? new Set() });
    found.get(key).pages.add(page.replace(BASE, ''));
  }
}

console.log(`visited ${visited} pages → ${found.size} distinct images\n`);

// ── 3. classify ─────────────────────────────────────────────────────────
const isLogo = (k) => /logo|samo-ime|primarni|sekundarni|favicon|monogram/i.test(k);
const isOrnament = (k) => /artboard|vijuga|krog|sopek|baloni|pattern|ornament|divider/i.test(k);

const groups = { logo: [], ornament: [], photo: [] };
for (const [key, v] of found) {
  const g = isLogo(key) ? 'logo' : isOrnament(key) ? 'ornament' : 'photo';
  groups[g].push({ key, ...v });
}
for (const [g, list] of Object.entries(groups)) console.log(`${g.padEnd(10)} ${list.length}`);

await mkdir('scripts/out', { recursive: true });
await writeFile(
  'scripts/out/harvest.json',
  JSON.stringify(
    Object.fromEntries(
      Object.entries(groups).map(([g, l]) => [
        g,
        l.map(({ key, url, pages }) => ({ key, url, pages: [...pages] })),
      ])
    ),
    null,
    2
  )
);

if (DRY) {
  console.log('\ndry run — nothing downloaded. See scripts/out/harvest.json');
  process.exit(0);
}

// ── 4. download ─────────────────────────────────────────────────────────
const slug = (k) =>
  k
    .split('/')
    .pop()
    .replace(/\.\w+$/, '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60);

const dirs = { logo: 'src/assets/brand', ornament: 'src/assets/brand', photo: 'src/assets/photos' };
for (const d of new Set(Object.values(dirs))) await mkdir(d, { recursive: true });

let ok = 0, skipped = 0, failed = 0, bytes = 0;
for (const [g, list] of Object.entries(groups)) {
  for (const item of list) {
    const ext = item.key.match(/\.(\w+)$/)[1].toLowerCase();
    const dest = `${dirs[g]}/${slug(item.key)}.${ext}`;
    if (existsSync(dest)) { skipped++; continue; }
    try {
      const r = await fetch(item.url);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      await pipeline(Readable.fromWeb(r.body), createWriteStream(dest));
      bytes += statSync(dest).size;
      ok++;
    } catch (e) {
      console.warn('  ! failed', slug(item.key), e.message);
      failed++;
    }
  }
}
console.log(`\ndownloaded ${ok}, already had ${skipped}, failed ${failed} — ${Math.round(bytes / 1024 / 1024)} MB`);
