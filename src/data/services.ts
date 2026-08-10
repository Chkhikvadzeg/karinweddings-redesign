/**
 * Replaces the live site's vague "Quote ▾" dropdown with four named,
 * priced things a couple can actually choose between.
 *
 * ⚠ Every `priceFrom` is a PLACEHOLDER — the live site publishes no pricing.
 * They exist so the layout can be judged. See README.
 */
export type Service = {
  slug: string;
  name: string;
  tagline: string;
  priceFrom: number;
  priceNote: string;
  bestFor: string;
  /** Which of the process steps this service covers */
  covers: string[];
  includes: string[];
  body: string[];
  photo: string;
  featured?: boolean;
};

export const services: Service[] = [
  {
    slug: 'full-planning',
    name: 'Full Planning',
    tagline: 'You choose. I do everything else.',
    priceFrom: 3800,
    priceNote: 'planning fee, excluding supplier costs',
    bestFor: '60–200 guests',
    featured: true,
    covers: ['first-call', 'design', 'suppliers', 'logistics', 'the-day', 'after'],
    includes: [
      'Unlimited contact from the day you book to the day after',
      'Venue search, visits and contract negotiation',
      'A complete supplier team, sourced and managed',
      'Full design: palette, florals, stationery, styling',
      'Budget built with you, tracked, and kept to',
      'Guest logistics — accommodation, transport, dietary requirements',
      'A written timeline every supplier works from',
      'On-the-day coordination from setup to the last dance',
    ],
    body: [
      'This is the one most couples choose, and it is the one I would choose. From the day you book, there is no wedding admin in your life. You make the decisions that are genuinely yours — what it feels like, who is there, what you eat — and I carry everything else.',
      'One review on my site puts it better than I can: without a planner, they would probably have got married on a Wednesday at the city hall.',
    ],
    photo: 'wedding-nina-premk',
  },
  {
    slug: 'partial-planning',
    name: 'Partial Planning',
    tagline: 'You have started. I make sure it lands.',
    priceFrom: 2200,
    priceNote: 'planning fee, excluding supplier costs',
    bestFor: '40–150 guests',
    covers: ['design', 'suppliers', 'logistics', 'the-day'],
    includes: [
      'A full review of everything you have booked so far',
      'Supplier recommendations for the gaps',
      'Design direction and a styling plan',
      'Contract and budget review',
      'Monthly planning calls',
      'Full on-the-day coordination',
    ],
    body: [
      'You have the venue and a date and a folder of screenshots, and somewhere around month four it stopped being fun. This is where I pick it up.',
      'We start with an honest audit of what you have, what is missing and what is going to cause a problem later. Then I fill the gaps and run the day.',
    ],
    photo: 'wedding-rimske-terme',
  },
  {
    slug: 'day-coordination',
    name: 'Day Coordination',
    tagline: 'You planned it. I run it.',
    priceFrom: 1200,
    priceNote: 'excluding supplier costs',
    bestFor: 'Couples who planned it themselves',
    covers: ['the-day'],
    includes: [
      'A handover meeting six weeks out',
      'Every supplier contacted, briefed and confirmed',
      'A minute-by-minute timeline written and circulated',
      'Setup supervised from first delivery',
      'I hold the schedule, the payments and the problems all day',
      'Pack-down and supplier settlement',
    ],
    body: [
      'You have planned your own wedding and you have done it well. The one thing you cannot do is also run it — because on the day you are getting married.',
      'Six weeks out I take the whole thing off you. From then on, suppliers call me.',
    ],
    photo: 'event-manager-karin',
  },
  {
    slug: 'celebrations',
    name: 'Engagements & Celebrations',
    tagline: 'Proposals, bachelorettes, showers, birthdays.',
    priceFrom: 650,
    priceNote: 'depending on scale',
    bestFor: 'Four of the five things I do',
    covers: ['first-call', 'design', 'suppliers', 'the-day'],
    includes: [
      'Engagements — location scouted for light and privacy, photographer hidden, dinner booked',
      'Bachelorette parties — a whole weekend, accommodation and activities included',
      'Baby showers — small, warm, and run by somebody who is not the mother',
      'Birthdays and anniversaries — the milestone ones worth doing properly',
      'Styling, suppliers and someone present on the day',
      'The same planning and coordination as a wedding, at the scale you need',
    ],
    body: [
      'Four of the five things on my list are not weddings. A proposal on a frozen lake, a bachelorette weekend people actually enjoy, a baby shower the mother gets to sit down at, a fortieth that is not a function room with balloons in it.',
      'These are often how couples meet me before anyone mentions a wedding — and just as often how people come back afterwards.',
    ],
    photo: 'winter-engagement',
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
