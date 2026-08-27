import { describe, it, expect } from 'vitest'
import { validateFriendForm, validateSplitBillForm } from './validation'

describe('validateFriendForm', () => {
  const existingFriends = [{ id: '1', name: 'Budi', avatarUrl: 'a.png' }]

  it('rejects empty name', () => {
    const result = validateFriendForm({ name: '' }, existingFriends)
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('Nama teman wajib diisi')
  })


  it('rejects duplicate name (case-insensitive)', () => {
    const result = validateFriendForm({ name: 'budi' }, existingFriends)
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('Nama teman sudah digunakan')
  })

  it('rejects duplicate name after trim', () => {
    const result = validateFriendForm({ name: '  Budi  ' }, existingFriends)
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('Nama teman sudah digunakan')
  })

  it('accepts valid unique name', () => {
    const result = validateFriendForm({ name: 'Andi' }, existingFriends)
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('rejects whitespace-only name', () => {
    const result = validateFriendForm({ name: '   ' }, existingFriends)
    expect(result.valid).toBe(false)
    expect(result.errors.name).toBe('Nama teman wajib diisi')
  })
})

describe('validateSplitBillForm', () => {
  const friends = [
    { id: 'f1', name: 'Budi' },
    { id: 'f2', name: 'Sari' },
  ]

  const validInput = {
    myName: 'Andi',
    friendId: 'f1',
    payer: 'me',
    totalBill: 100000,
    myPaidAmount: 30000,
    friendPaidAmount: 70000,
  }

  it('accepts valid input', () => {
    const result = validateSplitBillForm(validInput, friends)
    expect(result.valid).toBe(true)
    expect(Object.keys(result.errors)).toHaveLength(0)
  })

  it('accepts equal split (50/50)', () => {
    const result = validateSplitBillForm({ ...validInput, myPaidAmount: 50000, friendPaidAmount: 50000 }, friends)
    expect(result.valid).toBe(true)
  })

  it('accepts one side paying everything', () => {
    const result = validateSplitBillForm({ ...validInput, myPaidAmount: 100000, friendPaidAmount: 0 }, friends)
    expect(result.valid).toBe(true)
  })

  it('accepts the other side paying everything', () => {
    const result = validateSplitBillForm({ ...validInput, myPaidAmount: 0, friendPaidAmount: 100000 }, friends)
    expect(result.valid).toBe(true)
  })

  it('rejects empty myName', () => {
    const result = validateSplitBillForm({ ...validInput, myName: '' }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.myName).toBe('Nama saya wajib diisi')
  })

  it('rejects empty friendId', () => {
    const result = validateSplitBillForm({ ...validInput, friendId: '' }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.friendId).toBe('Teman wajib dipilih')
  })

  it('rejects empty payer', () => {
    const result = validateSplitBillForm({ ...validInput, payer: '' }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.payer).toBe('Pilih pihak yang membayar')
  })

  it('rejects totalBill <= 0', () => {
    const result = validateSplitBillForm({ ...validInput, totalBill: 0 }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.totalBill).toBe('Nominal bill harus lebih besar dari Rp0')
  })

  it('rejects negative totalBill', () => {
    const result = validateSplitBillForm({ ...validInput, totalBill: -50000 }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.totalBill).toBe('Nominal bill harus lebih besar dari Rp0')
  })

  it('rejects empty totalBill', () => {
    const result = validateSplitBillForm({ ...validInput, totalBill: '' }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.totalBill).toBe('Nominal bill wajib diisi')
  })

  it('rejects negative myPaidAmount', () => {
    const result = validateSplitBillForm({ ...validInput, myPaidAmount: -10000 }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.myPaidAmount).toBe('Nominal tidak boleh kurang dari Rp0')
  })

  it('rejects negative friendPaidAmount', () => {
    const result = validateSplitBillForm({ ...validInput, friendPaidAmount: -5000 }, friends)
    expect(result.valid).toBe(false)
    expect(result.errors.friendPaidAmount).toBe('Nominal tidak boleh kurang dari Rp0')
  })

  it('rejects both amounts as 0', () => {
    const result = validateSplitBillForm(
      { ...validInput, myPaidAmount: 0, friendPaidAmount: 0 },
      friends
    )
    expect(result.valid).toBe(false)
    expect(result.errors.split).toBe('Kedua nominal tidak boleh 0.')
  })

  it('rejects when sum does not equal totalBill', () => {
    const result = validateSplitBillForm(
      { ...validInput, totalBill: 100000, myPaidAmount: 50000, friendPaidAmount: 30000 },
      friends
    )
    expect(result.valid).toBe(false)
    expect(result.errors.split).toBe('Jumlah bagian saya dan teman harus sama dengan total bill.')
  })

  it('accepts both amounts as 0 when total is also 0 — but total must be > 0', () => {
    const result = validateSplitBillForm(
      { ...validInput, totalBill: 0, myPaidAmount: 0, friendPaidAmount: 0 },
      friends
    )
    expect(result.valid).toBe(false)
    expect(result.errors.totalBill).toBeDefined()
  })

  it('rejects empty myPaidAmount', () => {
    const result = validateSplitBillForm(
      { ...validInput, myPaidAmount: '', friendPaidAmount: 70000 },
      friends
    )
    expect(result.valid).toBe(false)
    expect(result.errors.myPaidAmount).toBe('Bagian saya wajib diisi')
  })

  it('rejects empty friendPaidAmount', () => {
    const result = validateSplitBillForm(
      { ...validInput, myPaidAmount: 30000, friendPaidAmount: '' },
      friends
    )
    expect(result.valid).toBe(false)
    expect(result.errors.friendPaidAmount).toBe('Bagian teman wajib diisi')
  })
})
