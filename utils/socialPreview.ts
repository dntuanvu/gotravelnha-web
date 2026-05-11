/**
 * Open Graph / social preview helpers (WhatsApp, Zalo, Telegram, Facebook, LinkedIn, etc.).
 * Prefer absolute https URLs to raster images (JPEG/PNG/WebP); avoid SVG for og:image.
 */

export const DEFAULT_SOCIAL_PREVIEW_IMAGE =
  'https://storage.googleapis.com/travella_assets_images/app_icon.png'

/**
 * Return an absolute https URL safe for og:image / twitter:image.
 * Relative paths and protocol-relative URLs are resolved against `siteOrigin`.
 * SVG URLs fall back to the default PNG (many scrapers skip SVG previews).
 */
export function resolveAbsoluteOgImage(
  image: string | undefined | null,
  siteOrigin: string
): string {
  const raw = (image || '').trim()
  if (!raw) return DEFAULT_SOCIAL_PREVIEW_IMAGE

  const origin = siteOrigin.replace(/\/$/, '')

  let url: string
  if (raw.startsWith('https://')) {
    url = raw
  } else if (raw.startsWith('http://')) {
    url = raw
  } else if (raw.startsWith('//')) {
    url = `https:${raw}`
  } else if (raw.startsWith('/')) {
    url = `${origin}${raw}`
  } else {
    url = raw
  }

  if (/\.svg(\?|#|$)/i.test(url)) {
    return DEFAULT_SOCIAL_PREVIEW_IMAGE
  }

  return url
}

/** Best-effort MIME for og:image:type (scrapers are not strict). */
export function inferOgImageMime(url: string): string {
  const path = url.split('?')[0].toLowerCase()
  if (path.endsWith('.png')) return 'image/png'
  if (path.endsWith('.webp')) return 'image/webp'
  if (path.endsWith('.jpg') || path.endsWith('.jpeg')) return 'image/jpeg'
  if (path.includes('images.unsplash.com')) return 'image/jpeg'
  return 'image/png'
}
