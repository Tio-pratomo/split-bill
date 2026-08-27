/**
 * Generate a unique ID with a prefix.
 * Uses crypto.randomUUID() when available, otherwise fallback.
 * @param {string} prefix
 * @returns {string}
 */
export function createId(prefix = 'id') {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`
  }
  const ts = Date.now().toString(36)
  const rand = Math.random().toString(36).slice(2, 10)
  return `${prefix}-${ts}-${rand}`
}
