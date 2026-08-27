import { useEffect, useRef, useCallback } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

function MobileNavDrawer({ isOpen, onOpen, onClose }) {
  const closeRef = useRef(null)
  const asideRef = useRef(null)
  const previousFocusRef = useRef(null)

  const getFocusable = useCallback(() => {
    if (!asideRef.current) return []
    return [...asideRef.current.querySelectorAll(FOCUSABLE)]
  }, [])

  // On open: focus close btn, save previous focus, lock scroll
  useEffect(() => {
    if (!isOpen) return
    previousFocusRef.current = document.activeElement
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => closeRef.current?.focus())
    return () => {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
  }, [isOpen])

  // Focus trap + Escape
  useEffect(() => {
    if (!isOpen) return
    const onKey = e => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab') {
        const els = getFocusable()
        if (!els.length) return
        const first = els[0]
        const last = els[els.length - 1]
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen, onClose, getFocusable])

  const handleNavClick = useCallback(() => onClose(), [onClose])

  return (
    <>
      {/* Trigger — hidden when open */}
      <Button
        type="button"
        variant="secondary"
        className="md:hidden"
        aria-label="Buka navigasi"
        aria-expanded={isOpen}
        aria-controls="mobile-nav-drawer"
        onClick={onOpen}
        style={isOpen ? { visibility: 'hidden', pointerEvents: 'none' } : undefined}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Backdrop + Panel */}
      <div
        id="mobile-nav-drawer"
        className="fixed inset-0 z-[60] md:hidden"
        role="dialog"
        aria-modal="true"
        aria-label="Navigasi mobile"
        aria-hidden={!isOpen}
        inert={isOpen ? false : true}
        style={{ visibility: isOpen ? 'visible' : 'hidden' }}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-slate-900/45 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}
          aria-hidden="true"
        />
        <button
          type="button"
          aria-label="Tutup navigasi"
          className={`absolute inset-0 ${isOpen ? 'cursor-pointer' : 'cursor-default'}`}
          tabIndex={isOpen ? 0 : -1}
          onClick={onClose}
          style={{ WebkitTapHighlightColor: 'transparent' }}
        />

        {/* Panel */}
        <aside
          ref={asideRef}
          className={`absolute right-0 top-0 flex h-full w-80 max-w-[85vw] flex-col bg-white p-5 shadow-2xl transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-transform ${isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}
          tabIndex={isOpen ? 0 : -1}
        >
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Navigasi</p>
              <h2 className="text-lg font-semibold text-on-surface">Menu utama</h2>
            </div>
            <Button
              ref={closeRef}
              type="button"
              variant="secondary"
              aria-label="Tutup navigasi"
              onClick={onClose}
              tabIndex={isOpen ? 0 : -1}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <nav aria-label="Navigasi utama mobile" className="flex flex-col gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 font-semibold ${isActive ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`
              }
              end
              onClick={handleNavClick}
              tabIndex={isOpen ? 0 : -1}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/history"
              className={({ isActive }) =>
                `rounded-2xl px-4 py-3 font-semibold ${isActive ? 'bg-primary text-white' : 'text-on-surface-variant hover:bg-surface-container-low'}`
              }
              onClick={handleNavClick}
              tabIndex={isOpen ? 0 : -1}
            >
              History
            </NavLink>
          </nav>
        </aside>
      </div>
    </>
  )
}

export default MobileNavDrawer
