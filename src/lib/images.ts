import type { ImageMetadata } from 'astro';

/**
 * Karin's photography, keyed by filename stem.
 *
 * These live in src/assets/ rather than public/ so sharp actually processes
 * them. On the live site the best five photographs are CSS background-images,
 * which cannot carry a srcset at all — that alone accounts for ~1.8 MB of the
 * homepage.
 */
const files = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/photos/*.{jpg,jpeg,png}',
  { eager: true }
);

const byName = new Map<string, ImageMetadata>(
  Object.entries(files).map(([path, mod]) => [
    path.split('/').pop()!.replace(/\.(jpe?g|png)$/i, ''),
    mod.default,
  ])
);

export function photo(name: string): ImageMetadata {
  const img = byName.get(name);
  if (!img) {
    throw new Error(
      `No photo "${name}". Available: ${[...byName.keys()].slice(0, 12).join(', ')}…`
    );
  }
  return img;
}

export const hasPhoto = (name: string) => byName.has(name);
export const allPhotos = () => [...byName.keys()];
