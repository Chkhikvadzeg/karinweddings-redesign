/**
 * The five things she organises.
 *
 * Taken directly from the "What can I organize?" menu on her live site, in her
 * order — weddings is genuinely listed last there. This site leads with
 * weddings commercially, but the other four are most of her menu and were
 * badly under-represented in the first pass of this redesign.
 *
 * Colours are sampled from her own buttons. Her site sets white text on all
 * five, which fails contrast on the three light swatches — clay is about
 * 1.5:1 and blue-grey about 2.3:1 against the 4.5:1 minimum. `ink` here marks
 * the swatches that need dark text instead.
 */
export type Celebration = {
  slug: string;
  name: string;
  blurb: string;
  /** Her own swatch */
  colour: string;
  /** true = this swatch needs dark text to pass contrast */
  ink: boolean;
  /** Gallery in src/data/galleries.ts, when she has one */
  gallerySlug?: string;
};

export const celebrations: Celebration[] = [
  {
    slug: 'weddings',
    name: 'Weddings',
    blurb: 'The whole day, or just the parts you would rather not carry.',
    colour: '#96aab3',
    ink: true,
    gallerySlug: 'lucka-domen',
  },
  {
    slug: 'engagements',
    name: 'Engagements',
    blurb: 'Proposals scouted, timed and quietly photographed.',
    colour: '#8f5437',
    ink: false,
    gallerySlug: 'zimska-zaroka',
  },
  {
    slug: 'bachelorette',
    name: 'Bachelorette parties',
    blurb: 'A weekend the bride actually enjoys, not one she survives.',
    colour: '#ded5c8',
    ink: true,
    gallerySlug: 'anina-dekliscina',
  },
  {
    slug: 'baby-showers',
    name: 'Baby showers',
    blurb: 'Warm, small and organised by somebody who is not the mother.',
    colour: '#23303c',
    ink: false,
  },
  {
    slug: 'birthdays',
    name: 'Birthdays',
    blurb: 'Milestones that are not a function room with balloons in it.',
    colour: '#96aab3',
    ink: true,
  },
];
