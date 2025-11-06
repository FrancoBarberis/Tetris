import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LanguageProvider } from './contexts/LanguageContext.jsx'
import { PokeballProvider } from './contexts/PokeballContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LanguageProvider>
      <PokeballProvider>
        <App />
      </PokeballProvider>
    </LanguageProvider>
  </StrictMode>,
)
