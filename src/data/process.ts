/**
 * The process spine — this site's signature component.
 *
 * Rationale: Karin's own copy sells reliability, not aesthetics. "Always
 * available", "flexible", "responsive", "took away a ton of stress". Her
 * reviews say the same thing over and over. Yet nowhere on the live site does
 * she show what working with her is actually like.
 *
 * Nobody hires a planner because of a photo gallery. They hire one because
 * they are frightened of the admin. This answers that directly.
 */
export type Step = {
  id: string;
  /** Spot illustration in public/icons/step-<id>.svg */
  icon: string;
  when: string;
  title: string;
  body: string;
  /** What the couple has to do at this stage — usually very little */
  yours: string;
};

export const process: Step[] = [
  {
    id: 'first-call',
    icon: 'step-first-call.png',
    when: '12–18 months out',
    title: 'The first call',
    body:
      'Free, an hour, no pitch. We talk about the day you actually want, roughly how many people, and roughly what you want to spend. I tell you honestly whether your budget matches your idea — and if it does not, where to move.',
    yours: 'Turn up. Have a rough number in mind.',
  },
  {
    id: 'design',
    icon: 'step-design.png',
    when: '10–12 months out',
    title: 'The shape of the day',
    body:
      'Before a single supplier is contacted we agree what the day feels like: the palette, the pace, where people eat, when the music changes. Everything after this is in service of that.',
    yours: 'Say yes, no, or "not quite" to what I put in front of you.',
  },
  {
    id: 'suppliers',
    icon: 'step-suppliers.png',
    when: '6–10 months out',
    title: 'The team',
    body:
      'Photographer, florist, band, catering, cake, stationery. I bring you a shortlist for each with real prices, we choose together, and I handle every contract and deposit from there.',
    yours: 'Choose your favourites. Meet them if you want to.',
  },
  {
    id: 'logistics',
    icon: 'step-logistics.png',
    when: '2–6 months out',
    title: 'The unglamorous part',
    body:
      'Guest list, dietary requirements, accommodation blocks, transport, seating, the schedule. This is the part that quietly eats couples alive, and it is the part I most want to take from you.',
    yours: 'Give me the guest list. That is genuinely it.',
  },
  {
    id: 'the-day',
    icon: 'step-the-day.png',
    when: 'The day',
    title: 'You are a guest at your own wedding',
    body:
      'I am there from the first delivery to the last dance, holding the timeline and briefing every supplier. If something goes wrong you will hear about it afterwards, as a funny story.',
    yours: 'Get married. Eat something.',
  },
  {
    id: 'after',
    icon: 'step-after.png',
    when: 'The week after',
    title: 'Closing it out',
    body:
      'Final supplier payments, hire returns, lost property, and the photographs chased so they actually arrive. The wedding is not finished when the party ends.',
    yours: 'Nothing.',
  },
];
