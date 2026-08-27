import Button from "./Button";

function Modal({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/45 p-4 backdrop-blur-[1px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-outline-variant"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <h2
            id="modal-title"
            className="text-lg font-semibold tracking-tight text-on-surface"
          >
            {title}
          </h2>
          <Button
            variant="secondary"
            aria-label="Tutup modal"
            onClick={onClose}
          >
            ×
          </Button>
        </div>
        <div className="text-sm text-on-surface-variant">{children}</div>
        {footer ? (
          <div className="mt-5 flex items-center justify-end gap-3">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Modal;
