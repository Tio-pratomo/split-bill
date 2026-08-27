import Modal from '../ui/Modal'
import Button from '../ui/Button'

function SuccessModal({ onClose }) {
  return (
    <Modal
      title="Berhasil"
      onClose={onClose}
      footer={<Button onClick={onClose}>Tutup</Button>}
    >
      <p className="text-sm text-slate-600">Split bill berhasil disimpan dan saldo teman telah diperbarui.</p>
    </Modal>
  )
}

export default SuccessModal
