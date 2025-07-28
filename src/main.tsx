import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'
import {  RouterProvider } from 'react-router-dom'
import { routes } from './routes.tsx'
import { Toaster } from './components/ui/toaster.tsx'
import AuthProvider from './contexts/Auth.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
    <RouterProvider router={routes}/>
    </AuthProvider>
    <Toaster />
  </StrictMode>,
)
