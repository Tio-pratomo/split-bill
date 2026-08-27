import { create } from 'zustand'
import { createId } from '../utils/ids'
import { generateAvatarUrl, normalizeAvatarUrl } from '../utils/avatar'
import { calculateBalanceDelta, recalculateBalances } from '../utils/splitBill'
import { validateFriendForm, validateSplitBillForm } from '../utils/validation'
import { isStorageAvailable, persistSplitBillState, readJson, STORAGE_KEYS } from '../utils/storage'

const nowIso = () => new Date().toISOString()

const createInitialState = () => ({
  friends: [],
  history: [],
  selectedFriendId: '',
  isAddFriendModalOpen: false,
  isSuccessModalOpen: false,
  storageError: '',
})

const safeArray = value => (Array.isArray(value) ? value : [])

const persistState = (friends, history) => {
  if (!isStorageAvailable()) {
    return { ok: true }
  }
  return persistSplitBillState({ friends, history })
}

export const useSplitBillStore = create((set, get) => ({
  ...createInitialState(),

  hydrate: () => {
    if (!isStorageAvailable()) {
      set({ storageError: 'Local Storage tidak tersedia' })
      return
    }

    const storedFriends = safeArray(readJson(STORAGE_KEYS.friends, []))
    const storedHistory = safeArray(readJson(STORAGE_KEYS.history, []))
    const recalculatedFriends = recalculateBalances(storedFriends, storedHistory)

    set({
      friends: recalculatedFriends,
      history: storedHistory,
      selectedFriendId: storedFriends.length > 0 ? storedFriends[0].id : '',
      storageError: '',
    })
  },

  openAddFriendModal: () => set({ isAddFriendModalOpen: true }),
  closeAddFriendModal: () => set({ isAddFriendModalOpen: false }),
  openSuccessModal: () => set({ isSuccessModalOpen: true }),
  closeSuccessModal: () => set({ isSuccessModalOpen: false }),

  selectFriend: friendId => set({ selectedFriendId: friendId }),

  addFriend: ({ name }) => {
    const state = get()
    const validation = validateFriendForm({ name }, state.friends)
    if (!validation.valid) {
      return { ok: false, errors: validation.errors }
    }

    const nextFriends = [
      ...state.friends,
      {
        id: createId('friend'),
        name: name.trim(),
        avatarUrl: normalizeAvatarUrl(generateAvatarUrl(name)),
        balance: 0,
        updatedAt: nowIso(),
      },
    ]

    const persistResult = persistState(nextFriends, state.history)
    if (!persistResult.ok) {
      return { ok: false, errors: { storage: persistResult.error || 'Gagal menyimpan data' } }
    }

    set({
      friends: nextFriends,
      storageError: '',
      selectedFriendId: state.selectedFriendId || nextFriends[0]?.id || '',
    })

    return { ok: true }
  },

  saveSplitBill: input => {
    const state = get()
    const validation = validateSplitBillForm(input, state.friends)
    if (!validation.valid) {
      return { ok: false, errors: validation.errors }
    }

    const { friendId, payer, myPaidAmount, friendPaidAmount } = input
    const delta = calculateBalanceDelta({
      payer,
      totalBill: Number(input.totalBill),
      myPaidAmount: Number(myPaidAmount),
      friendPaidAmount: Number(friendPaidAmount),
    })
    const nextFriends = state.friends.map(friend =>
      friend.id === friendId
        ? { ...friend, balance: (friend.balance || 0) + delta, updatedAt: nowIso() }
        : friend
    )

    const nextHistory = [
      {
        id: createId('bill'),
        friendId,
        payer,
        totalBill: Number(input.totalBill),
        myPaidAmount: Number(myPaidAmount),
        friendPaidAmount: Number(friendPaidAmount),
        createdAt: nowIso(),
        myName: (input.myName || '').trim(),
      },
      ...state.history,
    ]

    const persistResult = persistState(nextFriends, nextHistory)
    if (!persistResult.ok) {
      return { ok: false, errors: { storage: persistResult.error || 'Gagal menyimpan data' } }
    }

    set({ friends: nextFriends, history: nextHistory, storageError: '' })
    return { ok: true, historyEntry: nextHistory[0] }
  },

  deleteHistory: historyId => {
    const state = get()
    const remainingHistory = state.history.filter(item => item.id !== historyId)
    const nextFriends = recalculateBalances(state.friends, remainingHistory)

    const persistResult = persistState(nextFriends, remainingHistory)
    if (!persistResult.ok) {
      return { ok: false, error: persistResult.error || 'Gagal menyimpan data' }
    }

    set({ friends: nextFriends, history: remainingHistory, storageError: '' })
    return { ok: true }
  },
}))

export default useSplitBillStore
