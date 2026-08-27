import { formatRupiah } from './currency'

/**
 * Calculate balance delta from a split bill transaction.
 *
 * Rules (from PRD BR-DEBT-001 / BR-DEBT-002):
 * - payer "me"  → delta = +friendPaidAmount (friend owes me)
 * - payer "friend" → delta = -myPaidAmount (I owe friend)
 *
 * @param {{ payer: "me"|"friend", myPaidAmount: number, friendPaidAmount: number }} input
 * @returns {number}
 */
export function calculateBalanceDelta({ payer, myPaidAmount, friendPaidAmount, totalBill = 0 }) {
  // FR-007: both paid > 0 means no new debt
  if (myPaidAmount > 0 && friendPaidAmount > 0) return 0

  // FR-007: myPaidAmount === 0, friendPaidAmount > 0 → I owe friend
  if (myPaidAmount === 0 && friendPaidAmount > 0) return -friendPaidAmount

  // FR-007: friendPaidAmount === 0, myPaidAmount > 0 → friend owes me
  if (friendPaidAmount === 0 && myPaidAmount > 0) return myPaidAmount

  // both 0 — validation should reject, but handle gracefully with totalBill fallback
  if (payer === 'me') return totalBill
  if (payer === 'friend') return -totalBill
  return 0
}

/**
 * Calculate split bill result from transaction fields.
 *
 * @param {{ payer: "me"|"friend", myPaidAmount: number, friendPaidAmount: number }} input
 * @returns {{ type: "friend_owes_me"|"i_owe_friend"|"settled", amount: number }}
 */
export function calculateSplitBillResult({ payer, totalBill = 0, myPaidAmount, friendPaidAmount }) {
  const delta = calculateBalanceDelta({ payer, totalBill, myPaidAmount, friendPaidAmount })
  if (delta > 0) return { type: 'friend_owes_me', amount: delta }
  if (delta < 0) return { type: 'i_owe_friend', amount: Math.abs(delta) }
  return { type: 'settled', amount: 0 }
}

/**
 * Get display status for a friend's balance.
 *
 * @param {number} balance — positive = friend owes me, negative = I owe friend
 * @returns {{ label: string, colorClass: string }}
 */
export function getBalanceStatus(balance) {
  if (balance > 0) {
    return { label: `Teman hutang ${formatRupiah(Math.abs(balance))}`, colorClass: 'text-credit-green' }
  }
  if (balance < 0) {
    return { label: `Saya hutang ${formatRupiah(Math.abs(balance))}`, colorClass: 'text-debt-red' }
  }
  return { label: 'Tidak ada hutang', colorClass: 'text-neutral-gray' }
}

/**
 * Recalculate all friend balances from remaining history records.
 *
 * @param {Array} friends — current friends array
 * @param {Array} history — remaining history array
 * @returns {Array} updated friends with recalculated balances
 */
export function recalculateBalances(friends, history) {
  const balanceMap = {}
  for (const f of friends) {
    balanceMap[f.id] = 0
  }

  for (const tx of history) {
    if (balanceMap[tx.friendId] === undefined) continue
    const delta = calculateBalanceDelta({
      payer: tx.payer,
      totalBill: tx.totalBill,
      myPaidAmount: tx.myPaidAmount,
      friendPaidAmount: tx.friendPaidAmount,
    })
    balanceMap[tx.friendId] += delta
  }

  const now = new Date().toISOString()
  return friends.map(f => ({
    ...f,
    balance: balanceMap[f.id] || 0,
    updatedAt: now,
  }))
}
