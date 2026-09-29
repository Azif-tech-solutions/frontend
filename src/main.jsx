import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './ds/styles.css'
import './app/layout.css'
import App from './App.jsx'
import { StoreProvider } from './app/store.jsx'
//main.jsx
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StoreProvider>
      <App />
    </StoreProvider>
  </StrictMode>,
)
