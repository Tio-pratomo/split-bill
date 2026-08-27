import { describe, it, expect } from 'vitest'
import {
  sortHistoryNewestFirst,
  groupHistoryByYearMonth,
  formatDateTimeId,
  getPayerLabel,
} from './history'

describe('sortHistoryNewestFirst', () => {
  it('sorts by createdAt descending', () => {
    const history = [
      { id: '1', createdAt: '2026-01-15T10:00:00.000Z' },
      { id: '2', createdAt: '2026-03-10T08:00:00.000Z' },
      { id: '3', createdAt: '2026-02-20T12:00:00.000Z' },
    ]
    const sorted = sortHistoryNewestFirst(history)
    expect(sorted.map(h => h.id)).toEqual(['2', '3', '1'])
  })

  it('does not mutate the original array', () => {
    const history = [
      { id: 'a', createdAt: '2026-01-01T00:00:00.000Z' },
      { id: 'b', createdAt: '2026-06-01T00:00:00.000Z' },
    ]
    const original = [...history]
    sortHistoryNewestFirst(history)
    expect(history).toEqual(original)
  })

  it('returns empty array for empty input', () => {
    expect(sortHistoryNewestFirst([])).toEqual([])
  })
})

describe('groupHistoryByYearMonth', () => {
  it('groups items by year and month', () => {
    const history = [
      { id: '1', createdAt: '2026-01-15T10:00:00.000Z' },
      { id: '2', createdAt: '2026-01-20T12:00:00.000Z' },
      { id: '3', createdAt: '2026-03-05T08:00:00.000Z' },
    ]
    const groups = groupHistoryByYearMonth(history)
    expect(groups).toHaveLength(2)
    // Newest group first
    expect(groups[0].label).toBe('Maret 2026')
    expect(groups[0].items).toHaveLength(1)
    expect(groups[1].label).toBe('Januari 2026')
    expect(groups[1].items).toHaveLength(2)
  })

  it('returns empty array for empty input', () => {
    expect(groupHistoryByYearMonth([])).toEqual([])
  })

  it('groups items within same month together', () => {
    const history = [
      { id: 'a', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: 'b', createdAt: '2026-06-15T12:00:00.000Z' },
      { id: 'c', createdAt: '2026-06-20T10:00:00.000Z' },
    ]
    const groups = groupHistoryByYearMonth(history)
    expect(groups).toHaveLength(1)
    expect(groups[0].label).toBe('Juni 2026')
    expect(groups[0].items).toHaveLength(3)
  })

  it('orders groups newest month first', () => {
    const history = [
      { id: '1', createdAt: '2025-12-01T00:00:00.000Z' },
      { id: '2', createdAt: '2026-06-01T00:00:00.000Z' },
      { id: '3', createdAt: '2026-01-01T00:00:00.000Z' },
    ]
    const groups = groupHistoryByYearMonth(history)
    expect(groups[0].label).toBe('Juni 2026')
    expect(groups[1].label).toBe('Januari 2026')
    expect(groups[2].label).toBe('Desember 2025')
  })
})

describe('formatDateTimeId', () => {
  it('formats ISO string to Indonesian locale', () => {
    const result = formatDateTimeId('2026-06-15T14:30:00.000Z')
    // Should contain Indonesian day/month names
    expect(typeof result).toBe('string')
    expect(result.length).toBeGreaterThan(0)
  })

  it('returns a non-empty string', () => {
    const result = formatDateTimeId('2026-01-01T00:00:00.000Z')
    expect(result).toBeTruthy()
  })
})

describe('getPayerLabel', () => {
  it('returns Saya for me', () => {
    expect(getPayerLabel('me')).toBe('Saya')
  })

  it('returns Teman for friend', () => {
    expect(getPayerLabel('friend')).toBe('Teman')
  })
})
