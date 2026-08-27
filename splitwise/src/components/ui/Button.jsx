const variants = {
  primary: "bg-primary text-on-primary shadow-sm hover:opacity-90",
  secondary:
    "bg-white text-on-surface ring-1 ring-inset ring-outline-variant hover:bg-surface-container-low",
  danger: "bg-debt-red text-white shadow-sm hover:opacity-90",
};

function Button({
  as: Component = "button",
  variant = "primary",
  className = "",
  type = "button",
  ...props
}) {
  const buttonProps = Component === "button" ? { type } : {};

  return (
    <Component
      className={`inline-flex items-center justify-center rounded-2xl px-4 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant] || variants.primary} ${className}`}
      {...buttonProps}
      {...props}
    />
  );
}

export default Button;
