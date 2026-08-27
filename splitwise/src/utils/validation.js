/**
 * Validate the add friend form.
 *
 * @param {{ name: string }} input
 * @param {Array} friends — current friends list (for duplicate check)
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateFriendForm({ name }, friends) {
  const errors = {}
  const trimmedName = (name || '').trim()

  if (!trimmedName) {
    errors.name = 'Nama teman wajib diisi'
  } else {
    const isDuplicate = friends.some(
      f => f.name.toLowerCase() === trimmedName.toLowerCase()
    )
    if (isDuplicate) {
      errors.name = 'Nama teman sudah digunakan'
    }
  }

  return { valid: Object.keys(errors).length === 0, errors }
}

/**
 * Validate the split bill form.
 *
 * @param {{ myName: string, friendId: string, payer: string, totalBill: string|number, myPaidAmount: string|number, friendPaidAmount: string|number }} input
 * @param {Array} friends — current friends list
 * @returns {{ valid: boolean, errors: Record<string, string> }}
 */
export function validateSplitBillForm({ myName, friendId, payer, totalBill, myPaidAmount, friendPaidAmount }, friends) {
  const errors = {}

  if (!(myName || '').trim()) {
    errors.myName = 'Nama saya wajib diisi'
  }

  if (!friendId) {
    errors.friendId = 'Teman wajib dipilih'
  }

  if (!payer) {
    errors.payer = 'Pilih pihak yang membayar'
  }

  const total = Number(totalBill)
  if (!totalBill && totalBill !== 0) {
    errors.totalBill = 'Nominal bill wajib diisi'
  } else if (isNaN(total) || total <= 0) {
    errors.totalBill = 'Nominal bill harus lebih besar dari Rp0'
  }

  const myAmount = Number(myPaidAmount)
  const friendAmount = Number(friendPaidAmount)

  if ((myPaidAmount === '' || myPaidAmount === undefined || myPaidAmount === null) && myPaidAmount !== 0) {
    errors.myPaidAmount = 'Bagian saya wajib diisi'
  } else if (isNaN(myAmount) || myAmount < 0) {
    errors.myPaidAmount = 'Nominal tidak boleh kurang dari Rp0'
  }

  if ((friendPaidAmount === '' || friendPaidAmount === undefined || friendPaidAmount === null) && friendPaidAmount !== 0) {
    errors.friendPaidAmount = 'Bagian teman wajib diisi'
  } else if (isNaN(friendAmount) || friendAmount < 0) {
    errors.friendPaidAmount = 'Nominal tidak boleh kurang dari Rp0'
  }

  // FR-007: both amounts 0 is invalid
  if (
    !errors.totalBill &&
    !errors.myPaidAmount &&
    !errors.friendPaidAmount &&
    !isNaN(myAmount) &&
    !isNaN(friendAmount) &&
    myAmount === 0 &&
    friendAmount === 0
  ) {
    errors.split = 'Kedua nominal tidak boleh 0.'
  }

  // FR-007: myPaidAmount + friendPaidAmount must equal totalBill
  if (
    !errors.totalBill &&
    !errors.myPaidAmount &&
    !errors.friendPaidAmount &&
    !errors.split &&
    !isNaN(myAmount) &&
    !isNaN(friendAmount) &&
    !isNaN(total) &&
    (myAmount + friendAmount) !== total
  ) {
    errors.split = 'Jumlah bagian saya dan teman harus sama dengan total bill.'
  }

  return { valid: Object.keys(errors).length === 0, errors }
}
