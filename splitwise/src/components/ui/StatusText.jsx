const classes = {
  debt: 'text-debt-red',
  credit: 'text-credit-green',
  neutral: 'text-neutral-gray',
}

function StatusText({ status = 'neutral', children }) {
  return <span className={`font-medium ${classes[status] || classes.neutral}`}>{children}</span>
}

export default StatusText
