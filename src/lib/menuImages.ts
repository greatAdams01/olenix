/** Fallback images for menu categories (paths under /public/img). */
export const DEFAULT_CATEGORY_IMAGES: Record<string, string> = {
  'spirit-vodka': '/img/img-8.jpg',
  'beer': '/img/img-11.jpg',
  'grills': '/img/img-19.jpg',
  'pasta-corner': '/img/img-10.jpg',
  'platter': '/img/img-1.jpg',
  'fish-seafood': '/img/img-19.jpg',
  'special-soup': '/img/img-23.jpg',
  'rice': '/img/img-39.jpg',
  'olenix-combo': '/img/img-4.jpg',
  'pepper-soups': '/img/img-43.jpg',
};

export function resolveImageUrl(url: string | null | undefined): string {
  const trimmed = (url ?? '').trim();
  if (!trimmed) return '';
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://') || trimmed.startsWith('/')) {
    return trimmed;
  }
  return `/${trimmed.replace(/^\/+/, '')}`;
}

export function getCategoryImageUrl(categoryId: string, imageUrl: string): string {
  const resolved = resolveImageUrl(imageUrl);
  if (resolved) return resolved;
  return DEFAULT_CATEGORY_IMAGES[categoryId] ?? '';
}
