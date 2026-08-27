import { useEffect, useState } from "react";
import { useSplitBillStore } from "../../store/useSplitBillStore";
import { validateFriendForm } from "../../utils/validation";

import Modal from "../ui/Modal";
import Button from "../ui/Button";
import FieldError from "../ui/FieldError";

function AddFriendModal() {
  const isOpen = useSplitBillStore((state) => state.isAddFriendModalOpen);
  const closeAddFriendModal = useSplitBillStore(
    (state) => state.closeAddFriendModal,
  );
  const addFriend = useSplitBillStore((state) => state.addFriend);
  const friends = useSplitBillStore((state) => state.friends);
  const [name, setName] = useState("");
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateFriendForm({ name }, friends);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }
    const result = addFriend({ name });
    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }
    setName("");
    setErrors({});
    closeAddFriendModal();
  };

  const handleClose = () => {
    setName("");
    setErrors({});
    closeAddFriendModal();
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  if (!isOpen) return null;

  return (
    <Modal
      title="Tambah Teman"
      onClose={handleClose}
      footer={
        <div className="flex items-center gap-3">
          <Button type="submit" form="add-friend-form">
            Simpan
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Batal
          </Button>
        </div>
      }
    >
      <form id="add-friend-form" className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Nama teman
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <FieldError>{errors.name}</FieldError>
        </label>

        <FieldError>{errors.storage}</FieldError>


      </form>
    </Modal>
  );
}

export default AddFriendModal;
