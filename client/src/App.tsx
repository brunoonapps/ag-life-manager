import Dashboard from './pages/Dashboard'
import { useSession } from './lib/auth-client'
import { AuthOverlay } from './components/AuthOverlay'

function App() {
  const { data: session, isPending } = useSession()

  if (isPending) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-mono text-brand text-xs">
        RETRIEVING_SESSION_DATA...
      </div>
    )
  }

  return (
    <main className="min-h-screen">
      {!session && <AuthOverlay />}
      <Dashboard />
    </main>
  )
}

export default App
