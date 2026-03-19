import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import { ThemeProvider } from '@/components/providers/theme-provider.tsx'
import { library } from '@fortawesome/fontawesome-svg-core'
import { far } from '@fortawesome/free-regular-svg-icons'
import './index.css'
import { ConfigProvider } from './components/providers/config-provider.tsx'
import { CurrentRouteProvider } from './components/providers/current-route-provider.tsx'

library.add(far)
ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <ThemeProvider>
      <ConfigProvider>
        <CurrentRouteProvider>
          <App />
        </CurrentRouteProvider>
      </ConfigProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
