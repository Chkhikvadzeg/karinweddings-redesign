import type { APIRoute } from 'astro';

/**
 * Generated rather than static so it follows the same INDEXABLE switch as the
 * meta tag — the two must never disagree.
 *
 * Note: on a GitHub Pages *project* site this file is served from
 * /<repo>/robots.txt, which crawlers do not read — they read the domain root.
 * The meta tag is what actually protects the demo. This matters on a real
 * domain deployment.
 */
export const GET: APIRoute = ({ site }) => {
  const indexable = process.env.INDEXABLE === 'true';
  const body = indexable
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('sitemap-index.xml', site).href}\n`
    : `# Redesign demo — deliberately excluded from all crawlers.\nUser-agent: *\nDisallow: /\n`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
