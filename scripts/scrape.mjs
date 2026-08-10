// Pull Karin's real copy and photography so the demo is grounded in her
// actual business rather than invented filler.
// Run: node scripts/scrape.mjs
import { writeFile, mkdir } from 'node:fs/promises';
import { createWriteStream } from 'node:fs';
import { pipeline } from 'node:stream/promises';
import { Readable } from 'node:stream';

const BASE = 'https://karinweddingsevents.com';
const PAGES = [
  '/en/home/',
  '/en/about-me/',
  '/en/portfolio-2/',
  '/en/reviews/',
  '/en/contact/',
];

const strip = (s) =>
  s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&#8217;|&rsquo;|&#039;/g, '’')
    .replace(/&quot;|&#8220;|&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();

async function scrape(path) {
  const res = await fetch(BASE + path);
  const html = await res.text();

  const headings = [...html.matchAll(/<h([1-4])[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map((m) => ({ level: +m[1], text: strip(m[2]) }))
    .filter((h) => h.text.length > 1);

  const paras = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map((m) => strip(m[1]))
    .filter((t) => t.length > 40);

  // <img> sources plus CSS background-image urls — this theme puts its best
  // photography in backgrounds, which is exactly the problem we are fixing.
  const imgTags = [...html.matchAll(/<img[^>]+src="([^"]+)"/gi)].map((m) => m[1]);
  const srcsets = [...html.matchAll(/srcset="([^"]+)"/gi)]
    .flatMap((m) => m[1].split(',').map((s) => s.trim().split(' ')[0]));
  const bgs = [...html.matchAll(/background-image:\s*url\(&quot;?([^)&"']+)&quot;?\)/gi)].map((m) => m[1]);
  const bgs2 = [...html.matchAll(/url\((?:&quot;|"|')?([^)"'&]+\.(?:jpg|jpeg|png))(?:&quot;|"|')?\)/gi)].map((m) => m[1]);

  const all = [...imgTags, ...srcsets, ...bgs, ...bgs2]
    .filter((u) => /\.(jpe?g|png)$/i.test(u))
    .filter((u) => !/logo|icon|flag|avatar|placeholder/i.test(u))
    .map((u) => (u.startsWith('http') ? u : BASE + u));

  return { path, headings, paras, images: [...new Set(all)] };
}

const out = [];
for (const p of PAGES) {
  try {
    const d = await scrape(p);
    out.push(d);
    console.log(`${p.padEnd(20)} ${d.headings.length} headings, ${d.paras.length} paras, ${d.images.length} images`);
  } catch (e) {
    console.warn('  ! failed', p, e.message);
  }
}

await mkdir('scripts/out', { recursive: true });
await writeFile('scripts/out/scraped.json', JSON.stringify(out, null, 2));

// Prefer the largest variant of each distinct photograph.
const byBase = new Map();
for (const u of out.flatMap((d) => d.images)) {
  const key = u.replace(/-\d+x\d+(?=\.\w+$)/, '').replace(/-scaled/, '');
  const size = (u.match(/-(\d+)x\d+\./) || [0, 99999])[1];
  const prev = byBase.get(key);
  if (!prev || Number(size) > Number(prev.size)) byBase.set(key, { url: u, size });
}

await mkdir('src/assets/photos', { recursive: true });
let n = 0;
for (const [key, { url }] of [...byBase].slice(0, 24)) {
  const name = key.split('/').pop().replace(/\.(jpe?g|png)$/i, '').toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 48);
  const ext = url.match(/\.(jpe?g|png)$/i)[1].toLowerCase();
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error('HTTP ' + r.status);
    await pipeline(Readable.fromWeb(r.body), createWriteStream(`src/assets/photos/${name}.${ext}`));
    n++;
  } catch (e) {
    console.warn('  ! image failed', name, e.message);
  }
}
console.log(`\ndownloaded ${n} photographs to src/assets/photos/`);
