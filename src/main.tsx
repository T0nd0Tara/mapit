import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/components/theme-provider.tsx'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import './index.css'

library.add(far)
ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
