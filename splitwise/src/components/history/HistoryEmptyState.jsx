import EmptyState from '../ui/EmptyState'
import Button from '../ui/Button'
import { Link } from 'react-router-dom'

function HistoryEmptyState() {
  return (
    <EmptyState
      title="Belum ada history"
      description="Setelah split bill disimpan, riwayat transaksi akan tampil di sini."
      action={<Button as={Link} to="/">Kembali ke Dashboard</Button>}
    />
  )
}

export default HistoryEmptyState
