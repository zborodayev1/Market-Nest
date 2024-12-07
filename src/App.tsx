import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './components/pages/Home/HomePage'
import { Header } from './components/assets/Headers/Header'
import { NotFound } from './components/assets/errors/NotFound'
import { RegisterPage } from './components/pages/Register/RegisterPage'
import { LogInPage } from './components/pages/LogIn/LogInPage'
import { CreateProduct } from './components/pages/CreateProduct'
import { useSelector } from 'react-redux'
import { selectIsAuth } from './components/redux/slices/auth'
import { useEffect, useRef, useState } from 'react'
import { FullProduct } from './components/pages/FullProduct/FullProduct'
import { FavoritesPage } from './components/assets/Product/FavoritesPage'
import { BagPage } from './components/assets/Product/BagPage'

export const App = () => {
  const isAuth = useSelector(selectIsAuth)
  const [open, setOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  return (
    <div>
      <div ref={dropdownRef}>
        {open ? (
          <button onClick={() => setOpen(false)}>
            <div>
              <Header />
            </div>
            <div>
              <Routes>
                <Route element={<NotFound />} path="*" />
                <Route element={<HomePage />} path="/" />
                <Route
                  element={isAuth ? <Navigate to="/" /> : <LogInPage />}
                  path="/signIn"
                />
                <Route
                  element={isAuth ? <Navigate to="/" /> : <RegisterPage />}
                  path="/register"
                />
                <Route
                  element={!isAuth ? <Navigate to="/" /> : <CreateProduct />}
                  path="/create-product"
                />
                <Route element={<FullProduct />} path="/product/:id" />
                <Route element={<BagPage />} path="/bag" />
                <Route element={<FavoritesPage />} path="/favorites" />
              </Routes>
            </div>
          </button>
        ) : (
          <div>
            <div>
              <Header />
            </div>
            <div>
              <Routes>
                <Route element={<NotFound />} path="*" />
                <Route element={<HomePage />} path="/" />
                <Route
                  element={isAuth ? <Navigate to="/" /> : <LogInPage />}
                  path="/signIn"
                />
                <Route
                  element={isAuth ? <Navigate to="/" /> : <RegisterPage />}
                  path="/register"
                />
                <Route
                  element={!isAuth ? <Navigate to="/" /> : <CreateProduct />}
                  path="/create-product"
                />
                <Route element={<FullProduct />} path="/product/:id" />
                <Route element={<BagPage />} path="/bag" />
                <Route element={<FavoritesPage />} path="/favorites" />
              </Routes>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
