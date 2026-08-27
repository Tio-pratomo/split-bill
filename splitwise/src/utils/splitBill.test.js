import { describe, it, expect } from 'vitest'
import {
  calculateBalanceDelta,
  calculateSplitBillResult,
  getBalanceStatus,
  recalculateBalances,
} from './splitBill'

describe('calculateBalanceDelta', () => {
  it('returns 0 when both parts are filled', () => {
    expect(
      calculateBalanceDelta({ payer: 'me', myPaidAmount: 60000, friendPaidAmount: 40000 })
    ).toBe(0)
    expect(
      calculateBalanceDelta({ payer: 'friend', myPaidAmount: 60000, friendPaidAmount: 40000 })
    ).toBe(0)
  })

  it('returns 0 for unknown payer', () => {
    expect(
      calculateBalanceDelta({ payer: 'unknown', myPaidAmount: 10000, friendPaidAmount: 10000 })
    ).toBe(0)
  })

  it('returns totalBill when both amounts are 0 and payer is me', () => {
    expect(
      calculateBalanceDelta({ payer: 'me', totalBill: 100000, myPaidAmount: 0, friendPaidAmount: 0 })
    ).toBe(100000)
  })

  it('returns negative totalBill when both amounts are 0 and payer is friend', () => {
    expect(
      calculateBalanceDelta({ payer: 'friend', totalBill: 100000, myPaidAmount: 0, friendPaidAmount: 0 })
    ).toBe(-100000)
  })

})

describe('calculateSplitBillResult', () => {
  it('returns friend_owes_me for positive delta', () => {
    expect(
      calculateSplitBillResult({ payer: 'me', totalBill: 100000, myPaidAmount: 0, friendPaidAmount: 0 })
    ).toEqual({ type: 'friend_owes_me', amount: 100000 })
  })

  it('returns i_owe_friend for negative delta', () => {
    expect(
      calculateSplitBillResult({ payer: 'friend', totalBill: 100000, myPaidAmount: 0, friendPaidAmount: 0 })
    ).toEqual({ type: 'i_owe_friend', amount: 100000 })
  })

  it('returns settled for zero delta', () => {
    expect(
      calculateSplitBillResult({ payer: 'me', myPaidAmount: 0, friendPaidAmount: 0 })
    ).toEqual({ type: 'settled', amount: 0 })
  })
})

describe('getBalanceStatus', () => {
  it('returns credit status for positive balance', () => {
    const result = getBalanceStatus(50000)
    expect(result.colorClass).toBe('text-credit-green')
    expect(result.label).toContain('Teman hutang')
  })

  it('returns debt status for negative balance', () => {
    const result = getBalanceStatus(-30000)
    expect(result.colorClass).toBe('text-debt-red')
    expect(result.label).toContain('Saya hutang')
  })

  it('returns neutral status for zero balance', () => {
    const result = getBalanceStatus(0)
    expect(result.colorClass).toBe('text-neutral-gray')
    expect(result.label).toBe('Tidak ada hutang')
  })
})

describe('recalculateBalances', () => {
  const friends = [
    { id: 'f1', name: 'Budi', balance: 999, updatedAt: 'old' },
    { id: 'f2', name: 'Sari', balance: 999, updatedAt: 'old' },
  ]

  it('resets all balances to 0 when history is empty', () => {
    const result = recalculateBalances(friends, [])
    expect(result[0].balance).toBe(0)
    expect(result[1].balance).toBe(0)
  })

  it('accumulates multiple transactions per friend', () => {
    const history = [
      { friendId: 'f1', payer: 'me', totalBill: 60000, myPaidAmount: 0, friendPaidAmount: 0 },
      { friendId: 'f1', payer: 'friend', totalBill: 20000, myPaidAmount: 0, friendPaidAmount: 0 },
    ]
    const result = recalculateBalances(friends, history)
    // f1: +60000 + (-20000) = +40000
    expect(result[0].balance).toBe(40000)
    expect(result[1].balance).toBe(0)
  })

  it('preserves friend metadata (name, id)', () => {
    const result = recalculateBalances(friends, [])
    expect(result[0].name).toBe('Budi')
    expect(result[0].id).toBe('f1')
    expect(result[1].name).toBe('Sari')
    expect(result[1].id).toBe('f2')
  })

  it('ignores history entries for unknown friend ids', () => {
    const history = [
      { friendId: 'unknown', payer: 'me', myPaidAmount: 0, friendPaidAmount: 50000 },
    ]
    const result = recalculateBalances(friends, history)
    expect(result[0].balance).toBe(0)
    expect(result[1].balance).toBe(0)
  })

  it('updates updatedAt to a fresh ISO string', () => {
    const before = new Date().toISOString()
    const result = recalculateBalances(friends, [])
    const after = new Date().toISOString()
    expect(result[0].updatedAt >= before).toBe(true)
    expect(result[0].updatedAt <= after).toBe(true)
  })

  it('netting: delete one history then recalculate matches', () => {
    // Simulate: two transactions then delete one, recalculate from remaining
    const allHistory = [
      { friendId: 'f1', payer: 'me', totalBill: 60000, myPaidAmount: 0, friendPaidAmount: 0 },
      { friendId: 'f1', payer: 'friend', totalBill: 20000, myPaidAmount: 0, friendPaidAmount: 0 },
    ]
    const remaining = [allHistory[0]] // deleted the second one
    const result = recalculateBalances(friends, remaining)
    // Only +60000 from the first tx
    expect(result[0].balance).toBe(60000)
  })
})
