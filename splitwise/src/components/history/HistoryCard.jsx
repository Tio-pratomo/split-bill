import Button from "../ui/Button";
import StatusText from "../ui/StatusText";
import { formatRupiah } from "../../utils/currency";
import { calculateSplitBillResult } from "../../utils/splitBill";
import { formatDateTimeId, getPayerLabel } from "../../utils/history";

function HistoryCard({ item, friendName, onDelete }) {
  const payerLabel = getPayerLabel(item.payer);
  const title = `${friendName || "Teman tidak dikenal"} · Dibayar ${payerLabel}`;
  const amount = formatRupiah(item.myPaidAmount + item.friendPaidAmount);
  const result = calculateSplitBillResult(item);
  const statusLabel =
    result.type === "friend_owes_me"
      ? "Teman berhutang"
      : result.type === "i_owe_friend"
        ? "Saya berhutang"
        : "Tidak ada hutang";
  const statusVariant =
    result.type === "friend_owes_me"
      ? "credit"
      : result.type === "i_owe_friend"
        ? "debt"
        : "neutral";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-1 text-sm text-slate-600">
            {formatDateTimeId(item.createdAt)}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            <StatusText status={statusVariant}>{statusLabel}</StatusText>{" "}
            {statusLabel === "Tidak ada hutang" ? null : `sebesar ${amount}`}
          </p>
        </div>
        <Button
          variant="danger"
          aria-label={`Hapus transaksi ${friendName || "teman tidak dikenal"}`}
          onClick={() => onDelete(item.id)}
        >
          Hapus
        </Button>
      </div>
    </article>
  );
}

export default HistoryCard;
