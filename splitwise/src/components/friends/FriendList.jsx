import Button from "../ui/Button";
import EmptyState from "../ui/EmptyState";
import FriendCard from "./FriendCard";
import { useSplitBillStore } from "../../store/useSplitBillStore";

function FriendList() {
  const friends = useSplitBillStore((state) => state.friends);
  const openAddFriendModal = useSplitBillStore(
    (state) => state.openAddFriendModal,
  );

  return (
    <section aria-label="Daftar teman" className="space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight text-on-surface">
            Teman
          </h2>
          <p className="text-sm text-on-surface-variant">
            Pantau saldo dan pilih teman untuk split bill.
          </p>
        </div>
      </div>

      {friends.length === 0 ? (
        <EmptyState
          title="Belum ada teman"
          description="Tambahkan teman dulu untuk mulai mencatat patungan."
          action={<Button onClick={openAddFriendModal}>Tambah Teman</Button>}
        />
      ) : (
        <div className="space-y-3">
          {friends.map((friend) => (
            <FriendCard key={friend.id} friend={friend} />
          ))}
        </div>
      )}
    </section>
  );
}

export default FriendList;
