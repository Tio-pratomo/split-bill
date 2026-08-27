import AvatarImage from '../ui/AvatarImage'
import StatusText from '../ui/StatusText'
import { getBalanceStatus } from '../../utils/splitBill'
import { formatRupiah } from '../../utils/currency'
import { useSplitBillStore } from '../../store/useSplitBillStore'

function FriendCard({ friend }) {
  const selectFriend = useSplitBillStore(state => state.selectFriend)
  const selectedFriendId = useSplitBillStore(state => state.selectedFriendId)
  const status = friend.balance > 0 ? 'credit' : friend.balance < 0 ? 'debt' : 'neutral'
  const balanceStatus = getBalanceStatus(friend.balance)
  const isSelected = selectedFriendId === friend.id

  return (
    <button
      type="button"
      aria-pressed={isSelected}
      onClick={() => selectFriend(friend.id)}
      className={`flex w-full items-center gap-4 rounded-2xl border bg-white p-4 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${isSelected ? 'border-primary ring-1 ring-primary/20' : 'border-slate-200 hover:border-slate-300'}`}
    >
      <AvatarImage src={friend.avatarUrl} alt={friend.name} />
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-slate-900">{friend.name}</h3>
        <StatusText status={status}>{balanceStatus.label}</StatusText>
      </div>
      <div className={`text-sm font-semibold ${balanceStatus.colorClass}`}>{formatRupiah(Math.abs(friend.balance))}</div>
    </button>
  )
}

export default FriendCard
