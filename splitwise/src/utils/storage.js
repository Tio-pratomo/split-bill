export const STORAGE_KEYS = {
  friends: 'split_bill_friends',
  history: 'split_bill_history',
}

/**
 * Check if Local Storage is available.
 * @returns {boolean}
 */
export function isStorageAvailable() {
  try {
    const test = '__storage_test__'
    localStorage.setItem(test, test)
    localStorage.removeItem(test)
    return true
  } catch {
    return false
  }
}

/**
 * Safely read JSON from Local Storage.
 * @param {string} key
 * @param {*} fallback
 * @returns {*}
 */
export function readJson(key, fallback = []) {
  try {
    const raw = localStorage.getItem(key)
    if (raw === null) return fallback
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

/**
 * Write JSON to Local Storage.
 * @param {string} key
 * @param {*} value
 * @returns {{ ok: boolean, error?: string }}
 */
export function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return { ok: true }
  } catch (err) {
    return { ok: false, error: err.message || 'Gagal menyimpan ke Local Storage' }
  }
}

/**
 * Persist both friends and history atomically.
 * If either write fails, the state should not be committed.
 * @param {{ friends: Array, history: Array }} data
 * @returns {{ ok: boolean, error?: string }}
 */
export function persistSplitBillState({ friends, history }) {
  const r1 = writeJson(STORAGE_KEYS.friends, friends)
  if (!r1.ok) return r1

  const r2 = writeJson(STORAGE_KEYS.history, history)
  if (!r2.ok) return r2

  return { ok: true }
}
