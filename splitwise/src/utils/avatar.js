export const DEFAULT_AVATAR_URL = 'https://i.pravatar.cc/150'

/**
 * Get avatar fallback URL.
 * @returns {string}
 */
export function getAvatarFallback() {
  return DEFAULT_AVATAR_URL
}

/**
 * Generate a deterministic avatar URL from a seed.
 * @param {string} seed
 * @returns {string}
 */
export function generateAvatarUrl(seed) {
  const safeSeed = encodeURIComponent((seed || '').trim() || 'split-bill')
  return `https://i.pravatar.cc/150?u=${safeSeed}`
}

/**
 * Normalize avatar URL — trim and return.
 * If empty, return the default avatar URL.
 * @param {string} value
 * @returns {string}
 */
export function normalizeAvatarUrl(value) {
  const trimmed = (value || '').trim()
  if (!trimmed) return DEFAULT_AVATAR_URL
  return trimmed
}
