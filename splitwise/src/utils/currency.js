const rupiahFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
})

/**
 * Format number as Indonesian Rupiah without decimals.
 * @param {number} value
 * @returns {string} e.g. "Rp50.000"
 */
export function formatRupiah(value) {
  return rupiahFormatter.format(value)
}

/**
 * Parse a string or number input into a non-negative integer.
 * Returns NaN if not parseable.
 * @param {string|number} value
 * @returns {number}
 */
export function parseMoneyInput(value) {
  const parsed = Number(value)
  return parsed
}

/**
 * Check if value is a non-negative integer.
 * @param {number} value
 * @returns {boolean}
 */
export function isNonNegativeInteger(value) {
  return Number.isInteger(value) && value >= 0
}
