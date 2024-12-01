import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RandomNumberVisualizer from './RandomNumberVisualizer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RandomNumberVisualizer />
  </StrictMode>,
)
