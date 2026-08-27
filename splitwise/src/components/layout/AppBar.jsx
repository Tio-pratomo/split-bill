import { useCallback, useState } from 'react'
import { NavLink } from 'react-router-dom'
import MobileNavDrawer from './MobileNavDrawer'

const linkBase = 'py-1 font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary'
const linkClassName = ({ isActive }) =>
  `${linkBase} ${isActive ? 'border-b-2 border-primary text-primary' : 'text-on-surface-variant hover:text-primary'}`

function AppBar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  return (
    <header className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-subtle bg-surface px-margin-page shadow-sm">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-3xl text-primary" style={{ fontVariationSettings: '"FILL" 1' }}>
          payments
        </span>
        <h1 className="font-headline-lg text-headline-lg text-primary">SplitWise Pro</h1>
      </div>

      <nav aria-label="Navigasi utama" className="hidden items-center gap-stack-lg md:flex">
        <NavLink to="/" className={linkClassName} end>
          Dashboard
        </NavLink>
        <NavLink to="/history" className={linkClassName}>
          History
        </NavLink>
      </nav>

      <MobileNavDrawer
        isOpen={isDrawerOpen}
        onOpen={openDrawer}
        onClose={closeDrawer}
      />
    </header>
  )
}

export default AppBar
