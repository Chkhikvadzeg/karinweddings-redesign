/**
 * Prefixes a root-absolute path with the deployment base.
 *
 * GitHub Pages serves project sites from `username.github.io/<repo>/`, so a
 * bare `/enquire/` resolves to the wrong place — it lands at the domain root,
 * outside the site entirely. Every internal link, asset path and client-side
 * URL therefore has to go through here.
 *
 * `import.meta.env.BASE_URL` is inlined by Vite at build time, so this works
 * identically in .astro templates and in bundled client scripts. It is `/`
 * when no base is configured, which makes local dev and root deployments
 * behave exactly as before.
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  if (!path.startsWith('/')) path = `/${path}`;
  return `${base}${path}` || '/';
}
