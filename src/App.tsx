import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './components/pages/HomePage'
import { Header } from './components/assets/Headers/Header'
import { NotFound } from './components/assets/errors/NotFound'
import { RegisterPage } from './components/pages/RegisterPage'
import { LogInPage } from './components/pages/LogInPage'
import { CreateProduct } from './components/pages/CreateProduct'
import { useSelector } from 'react-redux'
import { selectIsAuth } from './components/redux/slices/auth'
import { AboutMarket } from './components/pages/AboutMarket'
import { Profile } from './components/pages/Profile/Profile'

export const App = () => {
  const isAuth = useSelector(selectIsAuth)
  return (
    <div>
      <Header />
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
        <Route element={<AboutMarket />} path="/about" />
        <Route
          element={!isAuth ? <Navigate to="/" /> : <Profile />}
          path="/profile"
        />
        <Route
          element={!isAuth ? <Navigate to="/" /> : <Profile />}
          path="/profile/edit/password"
        />
      </Routes>
    </div>
  )
}
