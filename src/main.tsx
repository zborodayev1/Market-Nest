import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { store } from './components/redux/store.ts'
import { HelmetProvider } from 'react-helmet-async'
import { AuthProvider } from './context/auth/AuthProvider.tsx'

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
