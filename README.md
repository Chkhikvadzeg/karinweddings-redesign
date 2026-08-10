# Karin Weddings & Events — redesign demo

A working redesign of [karinweddingsevents.com](https://karinweddingsevents.com), built to
show Karin rather than describe to her.

**Live:** https://chkhikvadzeg.github.io/karinweddings-redesign/

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # → dist/, 9 static pages
```

Deployed by GitHub Actions on every push to `main`.

> Not the same business as the Lake Bled demo. Different Karin, different
> phone number, different city, broader remit.

---

## Measured against the live site

Both measured the same way: Playwright, 390 px viewport, scrolled to trigger
lazy loading, `encodedBodySize` summed across every resource plus the document.

| | Live site | This demo |
|---|---|---|
| Homepage weight | **3,615 KB** | **219 KB** |
| Requests | **90** | **18** |
| CSS files | **36** | 2 |
| JS files | **22** (incl. jQuery 3.7.1) | 3 |
| Photographs as CSS backgrounds | **5, totalling ~1.8 MB** | **0** |
| Images oversized for their slot | 4 | **0** |
| `<h1>` per page | **2** (duplicated markup) | 1 |
| Images missing `alt` | 2 | 0 |
| Hero call-to-action | **none** | Two |

### Why the weight collapses

The live site is WordPress + The7 + Elementor, and its five best photographs
are painted with `background-image` in stylesheets rather than `<img>` tags.
**A CSS background cannot carry a `srcset`.** There is no markup to attach
responsive variants to, so a phone downloads the identical desktop JPEG a 27"
monitor gets — a single 756 KB hero among them. No plugin fixes that; it
requires rebuilding the sections.

Here every photograph is a real `<img>` through `src/components/Pic.astro`,
which emits an AVIF `srcset` at real display widths, pins quality to 48, and
makes `alt` required unless `decorative` is passed explicitly.

### A misdiagnosis worth recording

Two sections render blank while scrolling the live site, exactly like a
scroll-reveal bug. I tested for `opacity: 0` elements and found **zero**. The
real cause is 26 lazy images with no reserved dimensions, so sections sit empty
until their images arrive. Same symptom, different fix.

---

## Asset harvest from the legacy site

`scripts/harvest.mjs` walks all three sitemaps (103 pages) and collects images
from `<img src>`, `srcset` and CSS `background-image`. It found:

| | Count |
|---|---|
| Distinct photographs | **3,723** (~0.90 GB) |
| Galleries | **24**, from 18 to 375 photos each |
| Logos | 6 |
| Ornaments | 10 |

**Not all of it is bundled.** 0.90 GB would exceed GitHub Pages' repo limit and
make every build run sharp over thousands of files nobody would reach.
`scripts/harvest-curated.mjs` takes every logo and ornament plus **12 photos per
gallery — 288 images, 60 MB**. Re-run it with a higher number to pull more:

```bash
node scripts/harvest.mjs --dry          # enumerate
node scripts/harvest-curated.mjs 24     # 24 per gallery instead of 12
```

Consequence: **the build takes ~5 minutes**, almost entirely sharp encoding
AVIF variants for 288 photographs.

### What the harvest changed

- **Her real logo** now appears in the nav and footer. It ships once as an
  ink-recoloured PNG and is inverted to white by CSS over dark heroes.
- **A real portfolio**: `/portfolio/` lists all 24 galleries with her actual
  couple names — Lučka & Domen, Ulla & Matjaž, Jasmina & Matic — each with its
  own gallery page, prev/next, and a cross-link to a case study where one
  exists. The live site's Portfolio is a flat grid of names.
- **A factual correction.** One gallery is named `kelly-ervin-indijska-poroka`
  — an Indian wedding — and there is a second `kelly-ervin` gallery. My original
  case study invented a "planned across two time zones" story. It is now written
  around two ceremonies for two traditions, which is what the evidence supports.
  The specifics still need Karin's confirmation.

## Generated assets

Four assets were generated with Higgsfield (Recraft V4.1). All are disclosed
here and none is photographic:

| Asset | What it is | Risk |
|---|---|---|
| `src/assets/gen/slovenia-map.png` | Ink-and-wash map for the "Where I work" section | None — unmistakably illustration |
| `public/icons/step-*.png` | Six line-drawn spot illustrations for the process spine | None |
| `public/og.jpg` | Share card — generated watercolour ground, her wordmark composited on with sharp | None |
| `src/assets/gen/hero-wide.png` | **Her real photograph, outpainted** | **See below** |

### The hero needs explaining

Her photographs are all portrait 2:3. A full-bleed landscape hero crops away
most of the frame, so the source photo — Karin releasing a bride's veil above
Lake Bled — was **outpainted from 1707×2560 to 2752×1536**.

**62.8% of that image is generated.** The people, the veil, the terrace and the
lake were in the original and are untouched; the extended landscape either side
is invented. It is not fabricated wedding photography — no person or event was
invented — but it *is* a materially altered photograph.

Acceptable for a demo with this disclosure. **Not acceptable to ship**: the
photographer holds copyright, and publishing a 63%-synthetic version of their
work is their call, not ours. The zero-alteration alternative is a split hero
with the original portrait beside the type, which needs no generated pixels.

No AI-generated wedding photography exists in this build, and none should. Her
real photographs are visibly, specifically hers; a synthetic one placed beside
them would look wrong even to someone who could not say why.

## What is here

| Template | File | Generates |
|---|---|---|
| Home | `src/pages/index.astro` | 1 |
| — includes the illustrated reach map (`ReachMap.astro`) | | |
| Service | `src/pages/services/[slug].astro` | **4** from `src/data/services.ts` |
| Case study | `src/pages/work/[slug].astro` | **3** from `src/data/work.ts` |
| Enquiry | `src/pages/enquire.astro` | 1 |

**Not built:** Reviews page, full Portfolio index, and the Slovenian and German
translations. The routing supports them; see Languages below.

### Not only weddings

Her live site's "What can I organize?" menu lists five categories — baby
showers, bachelorette parties, birthdays, engagements, and **weddings last**.
The first pass of this redesign compressed four of those into a single service
card, because that section renders blank in desktop screenshots (lazy images
with no reserved space) and I never saw its contents.

`WhatIOrganise.astro` now gives all five real presence in her order, using the
swatches sampled from her own buttons — navy `#23303c`, clay `#ded5c8`,
blue-grey `#96aab3`, rust `#8f5437`.

**With one correction.** Her site sets white text on all five swatches. On the
three light ones that is roughly 1.5:1 (clay) and 2.3:1 (blue-grey) against a
4.5:1 minimum. Here those three carry dark ink instead. Her blocks are also not
links — they name a service and offer nowhere to go; these each point at a
service page or a real gallery of that kind of event.

The positioning is still weddings-led, which is where the budgets and the
search demand are. If Karin wants true parity — her own site puts weddings
last — that is a further step, not a bug.

### The two structural bets

**1. A process spine, not a gallery.** Her own copy and every one of her
reviews sells the same thing — reliability. "Always available." "Took away a
ton of stress." "She even reminded us of things I hadn't thought of." Yet the
live site never shows what working with her is like. `ProcessSpine.astro` lays
out all six stages from first call to the week after, and states what the
couple has to do at each one. Usually almost nothing. That is the pitch.

**2. Case studies, not a portfolio grid.** The live Portfolio page is ~14
galleries labelled with couple names. A gallery says "here are some photos". A
case study says "here is a problem like yours and what I did about it", which
is what someone deciding whether to spend thousands actually needs.

### Remaining weight

Fonts are **115 KB of the 219 KB** — two variable families across the Latin and
Latin-Extended subsets. Latin-Extended is not optional: `Lučka`, `Čemažar` and
`Portorož` all need it. The icons were 63 KB as traced SVG and are 9 KB as 2×
PNG, which is the right trade for artwork rendered at a fixed 52 px.

### Visual direction

Deliberately unlike the Lake Bled demo — two competing Slovenian planners must
never receive the same-looking site.

| | Lake Bled demo | This |
|---|---|---|
| Display | Bodoni Moda — cold didone | **Fraunces**, `SOFT 30 / WONK 1` |
| Body | Instrument Sans | **Karla** |
| Accent | Lake green | **Terracotta `#b5603f`** |
| Secondary | — | Her own clay `#c9b4a4`, kept |
| Structure | Asymmetric grid | Full-width horizontal bands |
| Signature | Numbered venue index | Horizontal process spine |

Fonts self-host via `@fontsource-variable`.

### Languages

English only, with the structure in place. Her live site offers EN/DE/SI via
two flag icons — the nav here uses real text codes with `lang` attributes and
screen-reader labels instead, because flags are countries, not languages, and
German is read in Austria and Switzerland too. **Machine-translated Slovenian
and German would undermine a pitch to a native speaker**, so those need her
words.

---

## ⚠ Placeholder data — read before showing anyone

- **All prices** in `src/data/services.ts` are invented. The live site
  publishes none.
- **Case study details** — guest counts, and the specifics of what happened —
  are reconstructed to demonstrate the template. Couple names, venues and the
  broad situations are real, from her portfolio and reviews. **Karin must
  replace these with the true stories before this goes anywhere.**
- The footer carries a visible disclaimer driven by `site.pricesArePlaceholder`.

**Real and verbatim:** her name (Karin Čemažar s.p.), tax number, phone, email,
the About paragraphs, and every testimonial.

**Photography** is hers, downloaded for this demo. The photographers hold
copyright. Every `alt` was written after actually looking at the image — my
first pass mislabelled the hero as "Karin setting a table" when it was a
photograph of guests.

**Indexing:** every page carries `<meta name="robots" content="noindex, …">`,
which is the protection that works here. `robots.txt` does *not* apply — on a
GitHub Pages project site crawlers read it from the domain root, which this
repo does not control. A provenance banner sits at the top of every page.

---

## The open decision

`src/lib/qualify.ts` turns the enquiry form's four questions into a triage
priority for Karin and a live message for the couple. The threshold in
`qualifyLead()` is a **working baseline, meant to be replaced** — flag too much
as urgent and the flag means nothing; flag too little and short-notice
bookings slip. That is Karin's judgment, not mine. Trade-offs are written out
above the function.
