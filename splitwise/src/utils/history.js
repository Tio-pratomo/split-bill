const MONTH_NAMES = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

/**
 * Sort history newest first.
 * @param {Array} history
 * @returns {Array}
 */
export function sortHistoryNewestFirst(history) {
  return [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

/**
 * Group history by year and month, newest first.
 * @param {Array} history
 * @returns {Array<{ year: number, month: number, label: string, items: Array }>}
 */
export function groupHistoryByYearMonth(history) {
  const sorted = sortHistoryNewestFirst(history)
  const groups = []
  const groupMap = new Map()

  for (const item of sorted) {
    const d = new Date(item.createdAt)
    const year = d.getFullYear()
    const month = d.getMonth()
    const key = `${year}-${month}`

    if (!groupMap.has(key)) {
      const label = `${MONTH_NAMES[month]} ${year}`
      const group = { year, month, label, items: [] }
      groupMap.set(key, group)
      groups.push(group)
    }
    groupMap.get(key).items.push(item)
  }

  return groups
}

/**
 * Format a date ISO string to Indonesian locale date-time.
 * @param {string} isoString
 * @returns {string}
 */
export function formatDateTimeId(isoString) {
  const d = new Date(isoString)
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Get payer label in Indonesian.
 * @param {string} payer — "me" | "friend"
 * @returns {string}
 */
export function getPayerLabel(payer) {
  return payer === 'me' ? 'Saya' : 'Teman'
}
