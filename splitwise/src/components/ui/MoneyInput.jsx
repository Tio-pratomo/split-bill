import { formatRupiah } from '../../utils/currency'

function MoneyInput({ label, value, onChange, id, error, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      <input
        id={id}
        type="number"
        min="0"
        step="1"
        value={value}
        onChange={onChange}
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        {...props}
      />
      <span className="mt-1 block text-xs text-slate-500">{formatRupiah(Number(value || 0))}</span>
      {error ? <p className="mt-1 text-sm text-debt-red">{error}</p> : null}
    </label>
  )
}

export default MoneyInput
