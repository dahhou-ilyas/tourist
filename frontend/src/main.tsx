import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './config/AppRoutes'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <App />
  </StrictMode>,
)
