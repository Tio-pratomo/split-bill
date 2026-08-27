import { beforeEach, describe, expect, it } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import App from '../App'
import { useSplitBillStore } from '../store/useSplitBillStore'
import { STORAGE_KEYS } from '../utils/storage'

function seedStorage({ friends = [], history = [] } = {}) {
  localStorage.setItem(STORAGE_KEYS.friends, JSON.stringify(friends))
  localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(history))
}

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

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <App />
    </MemoryRouter>
  )
}

describe('Dashboard integration', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })

  it('renders dashboard and empty friend state', () => {
    renderApp()

    expect(screen.getByText('Daftar Teman')).toBeInTheDocument()
    expect(screen.getByText('Belum ada teman')).toBeInTheDocument()
  })

  it('adds friend with validation and can select friend', async () => {
    const user = userEvent.setup()
    renderApp()

    await user.click(screen.getAllByRole('button', { name: 'Tambah Teman' })[0])
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    expect(screen.getByText('Nama teman wajib diisi')).toBeInTheDocument()

    const textboxes = screen.getAllByRole('textbox')
    await user.type(textboxes[textboxes.length - 1], 'Budi')
    await user.click(screen.getByRole('button', { name: 'Simpan' }))

    expect(await screen.findAllByText('Budi')).not.toHaveLength(0)
    expect(screen.queryByText('Belum ada teman')).not.toBeInTheDocument()
  })

  it('submits split bill, shows success modal, and resets form', async () => {
    const user = userEvent.setup()
    seedStorage({
      friends: [{ id: 'friend-1', name: 'Budi', avatarUrl: 'https://i.pravatar.cc/150?u=Budi', balance: 0, updatedAt: '2026-01-01T00:00:00.000Z' }],
    })

    renderApp()

    await user.type(screen.getByLabelText('Nama saya'), 'Andi')
    await user.type(screen.getAllByRole('spinbutton')[0], '30000')
    await user.click(screen.getByRole('button', { name: 'Teman' }))
    await user.click(screen.getByRole('button', { name: 'Simpan Split Bill' }))

    expect(await screen.findByRole('heading', { name: 'Berhasil' })).toBeInTheDocument()
    await waitFor(() => expect(screen.getByLabelText('Nama saya')).toHaveValue('Saya'))
  })

  it('rejects invalid split bill and keeps state unchanged', async () => {
    const user = userEvent.setup()
    seedStorage({
      friends: [{ id: 'friend-1', name: 'Budi', avatarUrl: 'https://i.pravatar.cc/150?u=Budi', balance: 0, updatedAt: '2026-01-01T00:00:00.000Z' }],
    })

    renderApp()

    await user.clear(screen.getByLabelText('Nama saya'))
    await user.click(screen.getByRole('button', { name: 'Simpan Split Bill' }))

    expect(screen.getByText('Nama saya wajib diisi')).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: 'Berhasil' })).not.toBeInTheDocument()
  })
})
