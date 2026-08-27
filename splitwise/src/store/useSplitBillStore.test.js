import { beforeEach, describe, expect, it } from 'vitest'
import { useSplitBillStore } from './useSplitBillStore'
import { STORAGE_KEYS } from '../utils/storage'
import { generateAvatarUrl } from '../utils/avatar'

function resetStore() {
  useSplitBillStore.setState({
    friends: [],
    history: [],
    selectedFriendId: '',
    isAddFriendModalOpen: false,
    isSuccessModalOpen: false,
    storageError: '',
  })
}

describe('useSplitBillStore', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  it('hydrates friends and history from storage', () => {
    localStorage.setItem(
      STORAGE_KEYS.friends,
      JSON.stringify([{ id: 'friend-1', name: 'Budi', avatarUrl: 'https://example.com/a.png', balance: 0, updatedAt: '2026-01-01T00:00:00.000Z' }])
    )
    localStorage.setItem(
      STORAGE_KEYS.history,
      JSON.stringify([{ id: 'bill-1', friendId: 'friend-1', payer: 'me', totalBill: 2000, myPaidAmount: 0, friendPaidAmount: 0, createdAt: '2026-01-02T00:00:00.000Z' }])
    )

    useSplitBillStore.getState().hydrate()

    expect(useSplitBillStore.getState().friends).toHaveLength(1)
    expect(useSplitBillStore.getState().history).toHaveLength(1)
    expect(useSplitBillStore.getState().friends[0].balance).toBe(2000)
  })

  it('adds friend and persists generated avatar', () => {
    const result = useSplitBillStore.getState().addFriend({ name: 'Budi' })

    expect(result.ok).toBe(true)
    expect(useSplitBillStore.getState().friends).toHaveLength(1)
    expect(useSplitBillStore.getState().friends[0].avatarUrl).toBe(generateAvatarUrl('Budi'))
    const storedFriends = JSON.parse(localStorage.getItem(STORAGE_KEYS.friends))
    expect(storedFriends).toHaveLength(1)
    expect(storedFriends[0].avatarUrl).toBe(generateAvatarUrl('Budi'))
  })

  it('saves split bill and updates balance and history', () => {
    useSplitBillStore.setState({
      friends: [{ id: 'friend-1', name: 'Budi', avatarUrl: 'https://example.com/a.png', balance: 0, updatedAt: '2026-01-01T00:00:00.000Z' }],
    })

    const result = useSplitBillStore.getState().saveSplitBill({
      myName: 'Saya',
      friendId: 'friend-1',
      payer: 'me',
      totalBill: 2000,
      myPaidAmount: 2000,
      friendPaidAmount: 0,
    })

    expect(result.ok).toBe(true)
    expect(useSplitBillStore.getState().friends[0].balance).toBe(2000)
    expect(useSplitBillStore.getState().history).toHaveLength(1)
    expect(useSplitBillStore.getState().history[0].totalBill).toBe(2000)
  })

  it('deletes history and recalculates balances', () => {
    useSplitBillStore.setState({
      friends: [{ id: 'friend-1', name: 'Budi', avatarUrl: 'https://example.com/a.png', balance: 2000, updatedAt: '2026-01-01T00:00:00.000Z' }],
      history: [
        { id: 'bill-1', friendId: 'friend-1', payer: 'me', totalBill: 2000, myPaidAmount: 0, friendPaidAmount: 0, createdAt: '2026-01-02T00:00:00.000Z' },
      ],
    })

    const result = useSplitBillStore.getState().deleteHistory('bill-1')

    expect(result.ok).toBe(true)
    expect(useSplitBillStore.getState().history).toHaveLength(0)
    expect(useSplitBillStore.getState().friends[0].balance).toBe(0)
  })

  it('rejects duplicate friend names', () => {
    useSplitBillStore.setState({
      friends: [{ id: 'friend-1', name: 'Budi', avatarUrl: 'https://example.com/a.png', balance: 0, updatedAt: '2026-01-01T00:00:00.000Z' }],
    })

    const result = useSplitBillStore.getState().addFriend({ name: ' budi ' })
    expect(result.ok).toBe(false)
    expect(result.errors.name).toBeDefined()
  })
})
