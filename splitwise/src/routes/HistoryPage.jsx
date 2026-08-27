import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import EmptyState from '../components/ui/EmptyState'
import HistoryGroup from '../components/history/HistoryGroup'
import HistoryEmptyState from '../components/history/HistoryEmptyState'
import { useSplitBillStore } from '../store/useSplitBillStore'
import { groupHistoryByYearMonth } from '../utils/history'

function HistoryPage() {
  const history = useSplitBillStore(state => state.history)
  const friends = useSplitBillStore(state => state.friends)
  const deleteHistory = useSplitBillStore(state => state.deleteHistory)
  const groups = useMemo(() => groupHistoryByYearMonth(history), [history])
  const [deleteTarget, setDeleteTarget] = useState(null)

  const confirmDelete = () => {
    if (!deleteTarget) return
    deleteHistory(deleteTarget)
    setDeleteTarget(null)
  }

  return (
    <section aria-label="History" className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-outline-variant">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="space-y-2">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">History</p>
            <h2 className="text-2xl font-semibold tracking-tight text-on-surface">Riwayat Split Bill</h2>
            <p className="max-w-2xl text-on-surface-variant">Lihat transaksi terbaru dan hapus bila perlu.</p>
          </div>
          <Button as={Link} to="/" variant="secondary">Kembali ke Dashboard</Button>
        </div>
      </div>

      {groups.length === 0 ? (
        <HistoryEmptyState />
      ) : (
        <div className="space-y-6">
          {groups.map(group => (
            <HistoryGroup key={`${group.year}-${group.month}`} group={group} friends={friends} onDelete={setDeleteTarget} />
          ))}
        </div>
      )}

      {deleteTarget ? (
        <Modal
          title="Hapus history?"
          onClose={() => setDeleteTarget(null)}
          footer={<>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>Batal</Button>
            <Button variant="danger" onClick={confirmDelete}>Hapus</Button>
          </>}
        >
          <p className="text-sm text-slate-600">Tindakan ini akan menghapus transaksi dan menghitung ulang saldo teman.</p>
        </Modal>
      ) : null}
    </section>
  )
}

export default HistoryPage
