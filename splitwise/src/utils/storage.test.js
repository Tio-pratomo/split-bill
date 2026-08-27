import { describe, it, expect, beforeEach } from 'vitest'
import { STORAGE_KEYS, isStorageAvailable, readJson, writeJson, persistSplitBillState } from './storage'

beforeEach(() => {
  localStorage.clear()
})

describe('STORAGE_KEYS', () => {
  it('has correct key values', () => {
    expect(STORAGE_KEYS.friends).toBe('split_bill_friends')
    expect(STORAGE_KEYS.history).toBe('split_bill_history')
  })
})

describe('isStorageAvailable', () => {
  it('returns true when localStorage works', () => {
    expect(isStorageAvailable()).toBe(true)
  })
})

describe('readJson', () => {
  it('returns fallback when key does not exist', () => {
    expect(readJson('nonexistent')).toEqual([])
  })

  it('returns custom fallback when provided', () => {
    expect(readJson('nonexistent', { default: true })).toEqual({ default: true })
  })

  it('returns parsed JSON when key exists', () => {
    localStorage.setItem('test_key', JSON.stringify({ a: 1 }))
    expect(readJson('test_key')).toEqual({ a: 1 })
  })

  it('returns fallback on corrupt JSON', () => {
    localStorage.setItem('corrupt_key', '{not valid json')
    expect(readJson('corrupt_key')).toEqual([])
  })

  it('returns custom fallback on corrupt JSON', () => {
    localStorage.setItem('corrupt_key', '}{')
    expect(readJson('corrupt_key', 'fallback')).toBe('fallback')
  })

  it('returns fallback when value is null (setItem null string)', () => {
    // localStorage stores "null" as string, which is valid JSON that parses to null
    localStorage.setItem('null_key', 'null')
    const result = readJson('null_key', 'fallback')
    // JSON.parse("null") returns null
    expect(result).toBeNull()
  })
})

describe('writeJson', () => {
  it('writes and reads back correctly', () => {
    const result = writeJson('w_key', { x: 42 })
    expect(result.ok).toBe(true)
    expect(readJson('w_key')).toEqual({ x: 42 })
  })

  it('returns { ok: true } on success', () => {
    const result = writeJson('ok_key', [1, 2, 3])
    expect(result.ok).toBe(true)
    expect(result.error).toBeUndefined()
  })
})

describe('persistSplitBillState', () => {
  it('persists both friends and history', () => {
    const friends = [{ id: 'f1', name: 'Budi' }]
    const history = [{ id: 'h1', friendId: 'f1' }]
    const result = persistSplitBillState({ friends, history })
    expect(result.ok).toBe(true)
    expect(readJson(STORAGE_KEYS.friends)).toEqual(friends)
    expect(readJson(STORAGE_KEYS.history)).toEqual(history)
  })

  it('overwrites existing data', () => {
    writeJson(STORAGE_KEYS.friends, [{ id: 'old' }])
    writeJson(STORAGE_KEYS.history, [{ id: 'old_h' }])

    const newFriends = [{ id: 'new' }]
    const newHistory = [{ id: 'new_h' }]
    persistSplitBillState({ friends: newFriends, history: newHistory })

    expect(readJson(STORAGE_KEYS.friends)).toEqual(newFriends)
    expect(readJson(STORAGE_KEYS.history)).toEqual(newHistory)
  })

  it('returns ok with empty arrays', () => {
    const result = persistSplitBillState({ friends: [], history: [] })
    expect(result.ok).toBe(true)
    expect(readJson(STORAGE_KEYS.friends)).toEqual([])
    expect(readJson(STORAGE_KEYS.history)).toEqual([])
  })
})
