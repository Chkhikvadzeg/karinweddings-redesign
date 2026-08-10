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
  gallery: string[];
  story: { heading: string; body: string }[];
  quote?: { text: string; author: string };
};

export const work: CaseStudy[] = [
  {
    slug: 'kelly-and-ervin',
    couple: 'Kelly & Ervin',
    title: 'A destination wedding planned across two time zones',
    venue: 'Ljubljana',
    season: 'Summer',
    guests: 90,
    service: 'Full Planning',
    challenge: 'Neither of them had stood in the venue before the week of the wedding.',
    photo: 'hero-kelly-ervin',
    gallery: ['hero-kelly-ervin', 'karin-portrait', 'organizacija-porok'],
    story: [
      {
        heading: 'The problem',
        body:
          'Kelly and Ervin were planning a Slovenian wedding from abroad, with a guest list split between two countries. Every venue visit, tasting and supplier meeting that a local couple treats as an afternoon out was, for them, a flight. They had a date, a rough budget and almost no way to verify anything themselves.',
      },
      {
        heading: 'What I did',
        body:
          'I became their eyes. Venue visits were filmed rather than described, so they could see the light in the room at the hour they would actually be in it. Tastings were photographed and written up. Every supplier call happened on their schedule, not Slovenian office hours, and every contract came to them already read and flagged.',
      },
      {
        heading: 'The day',
        body:
          'They arrived five days before the wedding. By then the timeline was written, every supplier was briefed, and the only decisions left were the ones they wanted to make. The first time they saw the room set was the morning of.',
      },
    ],
    quote: {
      text:
        'Thank you for the calm energy that completely relaxed us in key moments and gave us the strength to believe that everything would happen as it should. And so it was.',
      author: 'Kelly & Ervin',
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
    photo: 'wedding-lucka-domen',
    gallery: ['wedding-lucka-domen', 'organizator-dogodkov', 'organizacija-porok'],
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
    couple: 'A winter proposal',
    title: 'An engagement staged on a frozen lake',
    venue: 'Slovenia',
    season: 'Winter',
    guests: 2,
    service: 'Engagements & Celebrations',
    challenge: 'One attempt, sub-zero, and a photographer who had to be invisible.',
    photo: 'winter-engagement',
    gallery: ['winter-engagement', 'wedding-rimske-terme'],
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
