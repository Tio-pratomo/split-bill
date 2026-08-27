function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-3xl border border-dashed border-outline-variant bg-white p-6 text-center">
      <h3 className="text-base font-semibold tracking-tight text-on-surface">{title}</h3>
      {description ? <p className="mt-2 text-sm text-on-surface-variant">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  )
}

export default EmptyState
