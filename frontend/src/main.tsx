import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './config/AppRoutes'
import { ToastContainer } from 'react-toastify'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
        <App />
        <ToastContainer
        position="top-right"
        autoClose={3000}
        toastClassName="custom-toast"
        />
  </StrictMode>,
)
