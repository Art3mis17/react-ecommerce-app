import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { AuthContextProvider } from './contexts/AuthContext.tsx'
import { CartContextProvider } from './contexts/CartContext.tsx'

/**
 * Provider tree (outermost → innermost):
 *   BrowserRouter       — enables client-side routing everywhere
 *   AuthContextProvider — login/logout state, persisted to localStorage
 *   CartContextProvider — in-memory cart via useReducer
 *
 * CartContextProvider is nested inside AuthContextProvider so it can
 * access auth state if needed in the future (e.g. clearing cart on logout).
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </StrictMode>,
)
