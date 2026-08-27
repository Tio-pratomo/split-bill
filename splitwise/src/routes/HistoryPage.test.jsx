import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { STORAGE_KEYS } from '../utils/storage'

function seedStorage({ friends = [], history = [] } = {}) {
  localStorage.setItem(STORAGE_KEYS.friends, JSON.stringify(friends))
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history))
}

function renderApp(route = '/history') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

describe('History integration', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders empty history state', () => {
    renderApp()

    expect(screen.getByText('Belum ada history')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Kembali ke Dashboard' }).length).toBeGreaterThan(0)
  })

  it('renders grouped history and deletes item with recalculation', async () => {
    const user = userEvent.setup()
    seedStorage({
      friends: [{ id: 'friend-1', name: 'Budi', avatarUrl: 'https://example.com/avatar.png', balance: 20000, updatedAt: '2026-01-03T00:00:00.000Z' }],
      history: [
        { id: 'bill-1', friendId: 'friend-1', payer: 'me', myPaidAmount: 2500, friendPaidAmount: 7500, createdAt: '2026-01-03T00:00:00.000Z' },
      ],
    })

    renderApp()

    expect(screen.getByText('Budi · Dibayar Saya')).toBeInTheDocument()
    expect(screen.getByText(/Tidak ada hutang/)).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hapus transaksi Budi' }))
    expect(screen.getByRole('heading', { name: 'Hapus history?' })).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Hapus', exact: true }))
    expect(await screen.findByText('Belum ada history')).toBeInTheDocument()
  })
})
