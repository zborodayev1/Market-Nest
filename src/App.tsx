import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './components/pages/HomePage'
import { Header } from './components/assets/Headers/Header'
import { NotFound } from './components/assets/errors/NotFound'
import { RegisterPage } from './components/pages/Register/RegisterPage'
import { LogInPage } from './components/pages/LogIn/LogInPage'
import { CreateProduct } from './components/pages/CreateProduct'
import { useSelector } from 'react-redux'
import { selectIsAuth } from './components/redux/slices/auth'
import { Profile } from './components/pages/Profile/Profile'
import { FavoritesPage } from './components/assets/Product/FavoritesPage'

export const App = () => {
  const isAuth = useSelector(selectIsAuth)
  return (
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
            path="/login"
          />
          <Route
            element={isAuth ? <Navigate to="/" /> : <RegisterPage />}
            path="/register"
          />
          <Route
            element={!isAuth ? <Navigate to="/" /> : <CreateProduct />}
            path="/create-product"
          />
          <Route element={<FavoritesPage />} path="/favorites" />
          <Route
            element={!isAuth ? <Navigate to="/" /> : <Profile />}
            path="/profile"
          />
        </Routes>
      </div>
    </div>
  )
}
