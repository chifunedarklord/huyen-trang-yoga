import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#2d2a26',
            borderRadius: '12px',
            border: '1px solid #c8dfc9',
            boxShadow: '0 4px 16px rgba(45,42,38,0.10)',
            fontFamily: 'Inter, sans-serif',
            fontSize: '0.9rem',
          },
          success: {
            iconTheme: { primary: '#5a9660', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#c95a5a', secondary: '#fff' },
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
