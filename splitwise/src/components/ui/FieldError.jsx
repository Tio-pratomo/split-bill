function FieldError({ children }) {
  if (!children) return null
  return <p className="mt-1 text-sm text-debt-red">{children}</p>
}

export default FieldError
