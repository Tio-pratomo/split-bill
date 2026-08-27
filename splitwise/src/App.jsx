import { Navigate, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import DashboardPage from './routes/DashboardPage'
import HistoryPage from './routes/HistoryPage'
import { useSplitBillStore } from './store/useSplitBillStore'
import { useEffect } from 'react'

function HydrateOnMount() {
  const hydrate = useSplitBillStore(state => state.hydrate)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  return null
}

function App() {
  return (
    <>
      <HydrateOnMount />
      <Routes>
        <Route
          path="/"
          element={
            <AppShell>
              <DashboardPage />
            </AppShell>
          }
        />
        <Route
          path="/history"
          element={
            <AppShell>
              <HistoryPage />
            </AppShell>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
