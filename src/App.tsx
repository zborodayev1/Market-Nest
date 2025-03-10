import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from './components/pages/Home/HomePage'
import { Header } from './components/assets/Headers/Header'
import { NotFound } from './components/assets/errors/NotFound'
import { RegisterPage } from './components/pages/Register/RegisterPage'
import { LogInPage } from './components/pages/LogIn/LogInPage'
import { useSelector } from 'react-redux'
import { selectIsAuth, selectUserProfile } from './components/redux/slices/auth'
import { useRef, useState } from 'react'
import { FullProduct } from './components/pages/Product/FullProduct/FullProduct'
import { FavoritesPage } from './components/pages/Product/FavoritesProducts/FavoritesPage'
import { BagPage } from './components/pages/Product/Bag/BagPage'
import { CreatePage } from './components/pages/Product/CreateProduct/CreatePage'
import { PendingProducts } from './components/pages/Product/ForAdmins/PendingProducts'
import { ToastContainer } from 'react-toastify'
import { VerifyMail } from './components/pages/Register/VerifyMail'
import { EditProduct } from './components/pages/Product/EditProduct/EditProduct'

export const App = () => {
  const isAuth = useSelector(selectIsAuth)
  const toastRef = useRef<HTMLDivElement | null>(null)
  const [code, setCode] = useState<boolean>(false)
  const userData = useSelector(selectUserProfile)

  return (
    <div>
      <div ref={toastRef}>
        <ToastContainer position="bottom-center" />
      </div>
      <div>
        <Header toastRef={toastRef} />
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
            element={
              isAuth ? (
                <Navigate to="/" />
              ) : (
                <RegisterPage code={code} onSuccess={() => setCode(true)} />
              )
            }
            path="/register"
          />
          <Route
            element={!isAuth ? <Navigate to="/" /> : <CreatePage />}
            path="/create-product"
          />
          <Route
            element={!isAuth ? <Navigate to="/" /> : <EditProduct />}
            path="/edit/:id"
          />
          <Route element={<FullProduct noti={false} />} path="/product/:id" />
          <Route
            element={<FullProduct noti={true} />}
            path="/noti/product/:id"
          />
          <Route element={<BagPage />} path="/bag" />
          <Route element={<FavoritesPage />} path="/favorites" />
          <Route
            element={
              userData?.role === 'admin' ? <PendingProducts /> : <NotFound />
            }
            path="/products-pending"
          />
          <Route
            element={<VerifyMail code={code} onSuccess={() => setCode(true)} />}
            path="/verify-email"
          />
        </Routes>
      </div>
    </div>
  )
}
