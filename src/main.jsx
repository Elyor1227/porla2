import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import PorlaApp from './porla-web-updated.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    {/* <PorlaApp /> */}
  </StrictMode>,
)
