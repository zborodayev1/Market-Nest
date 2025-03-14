import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { App } from './App.tsx'
import { AuthProvider } from './context/auth/AuthProvider.tsx'
import './index.css'
import { store } from './redux/store.ts'

createRoot(document.getElementById('root')!).render(
  <>
    <HelmetProvider>
      <Provider store={store}>
        <AuthProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </AuthProvider>
      </Provider>
    </HelmetProvider>
  </>
)
