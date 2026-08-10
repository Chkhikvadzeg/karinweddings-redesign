/**
 * Case studies — the biggest gap on the live site.
 *
 * She currently has a Portfolio page that is a grid of ~14 galleries titled
 * only with couple names. A gallery says "here are some photos". A case study
 * says "here is a problem like yours, and here is what I did about it" — which
 * is what someone deciding whether to spend thousands on a planner needs.
 *
 * Couple names, venues and the broad situations are real, taken from her
 * portfolio and reviews. ⚠ Guest counts, budgets and specific details are
 * PLACEHOLDERS reconstructed to demonstrate the template. Karin replaces them
 * with the true story. See README.
 */
export type CaseStudy = {
  slug: string;
  couple: string;
  title: string;
  venue: string;
  season: string;
  guests: number;
  service: string;
  /** The one-line reason this wedding was difficult */
  challenge: string;
  photo: string;
  /** Links to the real gallery in src/data/galleries.ts */
  gallerySlug: string;
  gallery: string[];
  story: { heading: string; body: string }[];
  quote?: { text: string; author: string };
};

export const work: CaseStudy[] = [
  {
    slug: 'kelly-and-ervin',
    couple: 'Kelly & Ervin',
    title: 'Two ceremonies, two traditions, one weekend',
    venue: 'Slovenia',
    season: 'Summer',
    guests: 120,
    service: 'Full Planning',
    challenge: 'An Indian wedding and a Slovenian one, back to back, for the same guest list.',
    photo: 'kelly-ervin-indijska-poroka--kelly-ervin-day-one-11',
    gallerySlug: 'kelly-ervin-indijska-poroka',
    gallery: ["kelly-ervin-indijska-poroka--kelly-ervin-day-one-11", "kelly-ervin-indijska-poroka--kelly-ervin-day-one-119", "kelly-ervin-indijska-poroka--kelly-ervin-day-one-120", "kelly-ervin-indijska-poroka--kelly-ervin-day-one-126"],
    story: [
      {
        heading: 'The problem',
        body:
          'Kelly and Ervin have two families with two very different ideas of what a wedding is, and they refused to choose between them. That meant two celebrations across one weekend — an Indian ceremony with its own colour, music, dress and running order, and a Slovenian one — with most guests attending both.',
      },
      {
        heading: 'What I did',
        body:
          'Two weddings is not one wedding twice. Every supplier had to be briefed on both days and on which conventions applied to each. Catering had to serve two menus properly rather than one compromise. The schedule had to give guests time to change, eat and rest between them, and the venues had to be close enough that nobody spent the weekend in a car.',
      },
      {
        heading: 'The weekend',
        body:
          'Both ceremonies ran on their own terms, neither treated as the supporting act. The photographs from the Indian day are the ones people stop on — and there is a separate gallery for each, because they were genuinely separate events.',
      },
    ],
    quote: {
      text:
        'Thank you for the calm energy that completely relaxed us in key moments and gave us the strength to believe that everything would happen as it should. And so it was.',
      author: 'A couple married with Karin',
    },
  },
  {
    slug: 'lucka-and-domen',
    couple: 'Lučka & Domen',
    title: 'A city wedding that had to work for two very different families',
    venue: 'Ljubljana',
    season: 'Autumn',
    guests: 120,
    service: 'Full Planning',
    challenge: 'A guest list spanning four generations and two quite different ideas of a good time.',
    photo: 'lucka-domen--lucka-in-domen-organizator-porok-ljubljana-1',
    gallerySlug: 'lucka-domen',
    gallery: ["lucka-domen--lucka-in-domen-organizator-porok-ljubljana-1", "lucka-domen--lucka-in-domen-organizator-porok-ljubljana-10", "lucka-domen--lucka-in-domen-organizator-porok-ljubljana-100", "lucka-domen--lucka-in-domen-organizator-porok-ljubljana-101"],
    story: [
      {
        heading: 'The problem',
        body:
          'A large family wedding in the city, with grandparents who wanted a long lunch and a formal ceremony, and friends who wanted the party to go until four. Both groups were non-negotiable, and the venue had one room.',
      },
      {
        heading: 'What I did',
        body:
          'We designed the day as two events sharing a building. The ceremony and the meal were unhurried, warm and traditional, with the room set for conversation rather than spectacle. At ten the space changed completely — lighting, furniture, music — and the older guests had somewhere quiet to retreat to that was not "home".',
      },
      {
        heading: 'The day',
        body:
          'The turnaround took nineteen minutes and happened while everyone was outside. Nobody was asked to leave, and nobody felt the party had been held back for them.',
      },
    ],
  },
  {
    slug: 'winter-engagement',
    couple: 'Zimska zaroka',
    title: 'An engagement staged on a frozen lake',
    venue: 'Slovenia',
    season: 'Winter',
    guests: 2,
    service: 'Engagements & Celebrations',
    challenge: 'One attempt, sub-zero, and a photographer who had to be invisible.',
    photo: 'zimska-zaroka--zimska-zaroka-organizacija-zarok-1',
    gallerySlug: 'zimska-zaroka',
    gallery: ["zimska-zaroka--zimska-zaroka-organizacija-zarok-1", "zimska-zaroka--zimska-zaroka-organizacija-zarok-10", "zimska-zaroka--zimska-zaroka-organizacija-zarok-11", "zimska-zaroka--zimska-zaroka-organizacija-zarok-12"],
    story: [
      {
        heading: 'The problem',
        body:
          'He wanted to propose outdoors, in winter, somewhere that would mean something to both of them. The risks were obvious: weather, cold, other people, and the fact that you only get to do it once.',
      },
      {
        heading: 'What I did',
        body:
          'We scouted three locations and picked by light and footfall rather than by view alone — the best view had a coach party at four every afternoon. Timing was set for the twenty minutes when the sun drops behind the ridge. A photographer was positioned before they arrived, at a distance, with a long lens.',
      },
      {
        heading: 'The moment',
        body:
          'She had no idea. The photographs exist because someone was already standing in the right place, in the cold, forty minutes early.',
      },
    ],
  },
];

export const caseBySlug = (slug: string) => work.find((w) => w.slug === slug);
