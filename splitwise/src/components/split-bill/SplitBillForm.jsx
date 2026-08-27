import { useEffect, useMemo, useState } from "react";
import Button from "../ui/Button";
import FieldError from "../ui/FieldError";
import MoneyInput from "../ui/MoneyInput";
import { useSplitBillStore } from "../../store/useSplitBillStore";
import { validateSplitBillForm } from "../../utils/validation";
import { formatRupiah, parseMoneyInput } from "../../utils/currency";

function SplitBillForm() {
  const friends = useSplitBillStore((state) => state.friends);
  const selectedFriendId = useSplitBillStore((state) => state.selectedFriendId);
  const selectFriend = useSplitBillStore((state) => state.selectFriend);
  const saveSplitBill = useSplitBillStore((state) => state.saveSplitBill);
  const openSuccessModal = useSplitBillStore((state) => state.openSuccessModal);
  const [myName, setMyName] = useState("Saya");
  const [payer, setPayer] = useState("me");
  const [totalBill, setTotalBill] = useState("");
  const [myPaidAmount, setMyPaidAmount] = useState("");
  const [friendPaidAmount, setFriendPaidAmount] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!selectedFriendId && friends[0]) selectFriend(friends[0].id);
  }, [friends, selectFriend, selectedFriendId]);

  const selectedFriend = useMemo(
    () => friends.find((friend) => friend.id === selectedFriendId),
    [friends, selectedFriendId],
  );

  useEffect(() => {
    if (payer === "me" && totalBill) {
      setFriendPaidAmount(
        String(parseMoneyInput(totalBill) - parseMoneyInput(myPaidAmount || 0)),
      );
    }
    if (payer === "friend" && totalBill) {
      setMyPaidAmount(
        String(parseMoneyInput(totalBill) - parseMoneyInput(friendPaidAmount || 0)),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payer]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const validation = validateSplitBillForm(
      {
        myName,
        friendId: selectedFriendId,
        payer,
        totalBill: parseMoneyInput(totalBill),
        myPaidAmount: parseMoneyInput(myPaidAmount),
        friendPaidAmount: parseMoneyInput(friendPaidAmount),
      },
      friends,
    );

    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    const result = saveSplitBill({
      myName,
      friendId: selectedFriendId,
      payer,
      totalBill: parseMoneyInput(totalBill),
      myPaidAmount: parseMoneyInput(myPaidAmount),
      friendPaidAmount: parseMoneyInput(friendPaidAmount),
    });

    if (!result.ok) {
      setErrors(result.errors || {});
      return;
    }

    setErrors({});
    setMyName("Saya");
    setTotalBill("");
    setMyPaidAmount("");
    setFriendPaidAmount("");
    openSuccessModal();
  };

  return (
    <section
      aria-label="Split bill"
      className="rounded-xl border border-subtle bg-surface-card p-padding-card shadow-sm"
    >
      <div className="mb-stack-lg space-y-stack-sm">
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Form Split Bill
        </h2>
        <p className="text-sm text-on-surface-variant">
          Hitung pembagian tagihan dan simpan riwayat patungan.
        </p>
      </div>

      <form
        className="grid grid-cols-1 gap-stack-md md:grid-cols-2"
        onSubmit={handleSubmit}
      >
        <MoneyInput
          label="Nominal Bill"
          value={totalBill}
          onChange={(event) => setTotalBill(event.target.value)}
          error={errors.totalBill}
        />

        <fieldset className="block">
          <legend className="mb-1 block text-sm font-medium text-slate-700">
            Siapa yang bayar?
          </legend>

          <div
            className="flex flex-wrap gap-3"
            role="radiogroup"
            aria-label="Siapa yang bayar?"
          >
            <Button
              type="button"
              aria-pressed={payer === "me"}
              variant={payer === "me" ? "primary" : "secondary"}
              onClick={() => setPayer("me")}
            >
              Saya
            </Button>

            <Button
              type="button"
              aria-pressed={payer === "friend"}
              variant={payer === "friend" ? "primary" : "secondary"}
              onClick={() => setPayer("friend")}
            >
              Teman
            </Button>
          </div>

          <FieldError>{errors.payer}</FieldError>
        </fieldset>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Nama saya
          </span>
          <input
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            value={myName}
            onChange={(event) => setMyName(event.target.value)}
          />
          <FieldError>{errors.myName}</FieldError>
        </label>

        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">
            Pilih Teman
          </span>

          <select
            aria-invalid={Boolean(errors.friendId)}
            className="w-full rounded-xl border border-slate-300 px-4 py-3"
            value={selectedFriendId}
            onChange={(event) => selectFriend(event.target.value)}
          >
            <option value="">Pilih teman</option>

            {friends.map((friend) => (
              <option key={friend.id} value={friend.id}>
                {friend.name}
              </option>
            ))}
          </select>

          <FieldError>{errors.friendId}</FieldError>

          {selectedFriend ? (
            <p className="mt-1 text-xs text-slate-500">
              Teman terpilih: {selectedFriend.name}
            </p>
          ) : null}
        </label>

        <div
          className="
      grid grid-cols-1 gap-stack-md
      rounded-xl border border-dashed border-outline-variant
      bg-surface-container-lowest p-4
      md:col-span-2 md:grid-cols-2
    "
        >
          <MoneyInput
            label="Nominal saya bayar"
            value={myPaidAmount}
            onChange={(event) => setMyPaidAmount(event.target.value)}
            error={errors.myPaidAmount}
          />

          <MoneyInput
            label="Nominal teman bayar"
            value={friendPaidAmount}
            onChange={(event) => setFriendPaidAmount(event.target.value)}
            error={errors.friendPaidAmount}
          />
        </div>

        <div className="md:col-span-2">
          <FieldError>{errors.split}</FieldError>
          <FieldError>{errors.storage}</FieldError>
        </div>

        <div
          className="
      flex items-center justify-between
      rounded-2xl bg-surface-container-low
      px-4 py-3 text-sm text-on-surface-variant
      md:col-span-2
    "
        >
          <span>Total terisi</span>

          <span className="font-semibold text-on-surface">
            {formatRupiah(parseMoneyInput(totalBill || 0))}
          </span>
        </div>

        <div
          className="
      flex flex-col-reverse gap-3
      sm:flex-row sm:justify-end
      md:col-span-2
    "
        >
          <Button
            type="reset"
            variant="secondary"
            onClick={() => {
              setErrors({});
              setMyName("Saya");
              setTotalBill("");
              setMyPaidAmount("");
              setFriendPaidAmount("");
            }}
          >
            Reset
          </Button>

          <Button type="submit">Simpan Split Bill</Button>
        </div>
      </form>
    </section>
  );
}

export default SplitBillForm;
