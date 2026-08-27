import FriendList from "../components/friends/FriendList";
import AddFriendModal from "../components/modals/AddFriendModal";
import SuccessModal from "../components/modals/SuccessModal";
import SplitBillForm from "../components/split-bill/SplitBillForm";
import Button from "../components/ui/Button";
import { useSplitBillStore } from "../store/useSplitBillStore";

function DashboardPage() {
  const openAddFriendModal = useSplitBillStore(
    (state) => state.openAddFriendModal,
  );
  const isSuccessModalOpen = useSplitBillStore(
    (state) => state.isSuccessModalOpen,
  );
  const closeSuccessModal = useSplitBillStore(
    (state) => state.closeSuccessModal,
  );

  return (
    <div className="grid grid-cols-1 gap-gutter items-start md:grid-cols-[360px_1fr]">
      <aside className="flex flex-col gap-stack-lg">
        <div className="flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md">Daftar Teman</h2>
          <Button onClick={openAddFriendModal} className="gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Tambah Teman
          </Button>
        </div>
        <FriendList />
      </aside>

      <div className="flex flex-col gap-stack-lg">
        <SplitBillForm />
      </div>

      <AddFriendModal />
      {isSuccessModalOpen ? <SuccessModal onClose={closeSuccessModal} /> : null}
    </div>
  );
}

export default DashboardPage;
