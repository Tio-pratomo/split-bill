import { describe, it, expect } from 'vitest'
import { formatRupiah, parseMoneyInput, isNonNegativeInteger } from './currency'

describe('formatRupiah', () => {
  it('formats zero', () => {
    expect(formatRupiah(0)).toMatch(/Rp\s?0/)
  })

  it('formats positive integer', () => {
    const result = formatRupiah(50000)
    expect(result).toContain('50.000')
    expect(result).toContain('Rp')
  })

  it('formats large numbers with dot separators', () => {
    const result = formatRupiah(1250000)
    expect(result).toContain('1.250.000')
  })

  it('does not show decimals', () => {
    const result = formatRupiah(10000)
    expect(result).not.toMatch(/,00/)
  })
})

describe('parseMoneyInput', () => {
  it('parses numeric string', () => {
    expect(parseMoneyInput('50000')).toBe(50000)
  })

  it('parses number directly', () => {
    expect(parseMoneyInput(1000)).toBe(1000)
  })

  it('returns NaN for invalid input', () => {
    expect(parseMoneyInput('abc')).toBeNaN()
  })
})

describe('isNonNegativeInteger', () => {
  it('returns true for zero', () => {
    expect(isNonNegativeInteger(0)).toBe(true)
  })

  it('returns true for positive integers', () => {
    expect(isNonNegativeInteger(100)).toBe(true)
  })

  it('returns false for negative', () => {
    expect(isNonNegativeInteger(-5)).toBe(false)
  })

  it('returns false for decimals', () => {
    expect(isNonNegativeInteger(1.5)).toBe(false)
  })

  it('returns false for NaN', () => {
    expect(isNonNegativeInteger(NaN)).toBe(false)
  })
})
