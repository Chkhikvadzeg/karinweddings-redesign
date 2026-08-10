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
| Homepage weight | **3,615 KB** | **62 KB** |
| Requests | **90** | **13** |
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

## What is here

| Template | File | Generates |
|---|---|---|
| Home | `src/pages/index.astro` | 1 |
| Service | `src/pages/services/[slug].astro` | **4** from `src/data/services.ts` |
| Case study | `src/pages/work/[slug].astro` | **3** from `src/data/work.ts` |
| Enquiry | `src/pages/enquire.astro` | 1 |

**Not built:** Reviews page, full Portfolio index, and the Slovenian and German
translations. The routing supports them; see Languages below.

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
