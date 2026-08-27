import AppBar from './AppBar'

function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-surface-bg text-text-main">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-xl focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:shadow-lg">
        Lewati ke konten utama
      </a>
      <AppBar />
      <main id="main-content" className="mx-auto max-w-container-max px-margin-page py-stack-lg">{children}</main>
    </div>
  )
}

export default AppShell
