import { Routes, Route, Navigate } from 'react-router-dom'
import { Layout } from './components/layout'
import { Dashboard } from './pages/Dashboard'
import { Queue } from './pages/Queue'
import { Sync } from './pages/Sync'
import { Settings } from './pages/Settings'
import { Logs } from './pages/Logs'
import { Login } from './pages/Login'
import { Toaster } from './components/ui/toaster'
import { AuthProvider, RequireAuth } from './contexts/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <RequireAuth>
            <Layout />
          </RequireAuth>
        }>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="queue" element={<Queue />} />
          <Route path="sync" element={<Sync />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
