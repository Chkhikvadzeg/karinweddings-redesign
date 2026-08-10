/**
 * Lead qualification for the enquiry form.
 *
 * The live site's contact page is a bare form with no fields that tell Karin
 * anything before she replies. These four questions — date, flexibility, guest
 * count, service — turn an enquiry into something she can triage, and give the
 * couple something useful before they hit send.
 *
 * Season logic differs from a Bled-specific site: Karin works across Slovenia
 * and inland, so the constraint is the Slovenian wedding calendar generally,
 * not one lake's boat season.
 */

export type Flexibility = 'fixed' | 'week' | 'month' | 'open';
export type Demand = 'peak' | 'busy' | 'quiet';

export type EnquiryInput = {
  name: string;
  email: string;
  date: string;
  flexibility: Flexibility;
  guests: number;
  serviceSlug: string | null;
  message: string;
};

export type QualifiedLead = {
  priority: 'urgent' | 'high' | 'standard';
  leadTimeMonths: number | null;
  demand: Demand;
  summaryForKarin: string;
  noticeForCouple: string | null;
};

export function monthsUntil(iso: string, today = new Date()): number | null {
  if (!iso) return null;
  const target = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const months =
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth());
  return months - (target.getDate() < today.getDate() ? 1 : 0);
}

/**
 * Graded, not boolean. A blunt "summer = busy" rule would mark every day of
 * August and tell the couple nothing useful.
 *
 *   peak  — a Saturday from June to September
 *   busy  — any other summer day, or a May/October Saturday
 *   quiet — the rest of the year, which is most of it
 */
export function demandFor(iso: string): Demand {
  if (!iso) return 'quiet';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return 'quiet';

  const m = d.getMonth();
  const summer = m >= 5 && m <= 8; // Jun–Sep
  const shoulder = m === 4 || m === 9; // May, Oct
  const saturday = d.getDay() === 6;

  if (summer && saturday) return 'peak';
  if (summer || (shoulder && saturday)) return 'busy';
  return 'quiet';
}

export const isHighDemand = (iso: string): boolean => demandFor(iso) === 'peak';

/**
 * ─────────────────────────────────────────────────────────────────────────
 * TODO — KARIN'S CALL. Working baseline, meant to be replaced.
 *
 * The trade-off is the same one every planner faces: an urgent flag should
 * mean "reply today". Flag too much and it stops meaning anything; flag too
 * little and the short-notice bookings — often the easiest yes — slip away.
 *
 * Worth weighing:
 *   • Short lead time on a peak Saturday → genuinely time-critical
 *   • Day-coordination enquiries arrive late by nature; that is normal, not urgent
 *   • A fixed, immovable date is either booked now or lost
 *   • No date at all → early browsing, not yet a lead
 * ─────────────────────────────────────────────────────────────────────────
 */
export function qualifyLead(input: EnquiryInput, today = new Date()): QualifiedLead {
  const leadTimeMonths = monthsUntil(input.date, today);
  const demand = demandFor(input.date);

  let priority: QualifiedLead['priority'] = 'standard';
  if (leadTimeMonths !== null && leadTimeMonths <= 6 && demand === 'peak') {
    priority = 'urgent';
  } else if (
    (leadTimeMonths !== null && leadTimeMonths <= 9 && input.flexibility === 'fixed') ||
    input.guests >= 120 ||
    input.serviceSlug === 'full-planning'
  ) {
    priority = 'high';
  }

  let noticeForCouple: string | null = null;
  if (leadTimeMonths !== null && leadTimeMonths < 0) {
    noticeForCouple = 'That date has already passed — did you mean next year?';
  } else if (priority === 'urgent' && input.flexibility === 'fixed') {
    noticeForCouple =
      'That is a summer Saturday and it is close. I will check what is actually still available and tell you honestly today.';
  } else if (demand === 'peak') {
    noticeForCouple =
      'Summer Saturdays are the first dates to go in Slovenia. Worth moving quickly — and worth having a second date in mind.';
  } else if (demand === 'quiet' && leadTimeMonths !== null && leadTimeMonths >= 6) {
    noticeForCouple =
      'Good news: that is outside the busy season, so you will have real choice of venues and suppliers — and better prices.';
  }

  const summaryForKarin = [
    input.guests === 2 ? 'Just the two' : `${input.guests} guests`,
    leadTimeMonths === null ? 'no date' : `${leadTimeMonths}mo out`,
    `${demand} date`,
    input.serviceSlug ?? 'service undecided',
  ].join(' · ');

  return { priority, leadTimeMonths, demand, summaryForKarin, noticeForCouple };
}
