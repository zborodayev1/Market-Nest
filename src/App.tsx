import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { Header } from './components/assets/Header/Header';
import { NotFoundErr } from './components/assets/errors/NotFoundErr';
import { HomePage } from './components/pages/Home/HomePage';
import { LogInPage } from './components/pages/LogIn/LogInPage';
import { BagPage } from './components/pages/Product/Bag/BagPage';
import { CreatePage } from './components/pages/Product/CreateProduct/CreatePage';
import { EditProduct } from './components/pages/Product/EditProduct/EditProduct';
import { PendingProducts } from './components/pages/Product/ForAdmins/PendingProducts';
import { FullProduct } from './components/pages/Product/FullProduct/FullProduct';
import { ProductsByTags } from './components/pages/Product/ProductsByTags/ProductsByTags';
import { SavedProducts } from './components/pages/Product/SavedProducts/SavedProducts';
import { RegisterPage } from './components/pages/Register/RegisterPage';
import { VerifyMail } from './components/pages/Register/VerifyMail';
import { WalletPage } from './components/pages/Wallet/Wallet';
import { selectIsAuth, selectUserProfile } from './redux/slices/authSlice';

export const App = () => {
  const isAuth = useSelector(selectIsAuth);
  const toastRef = useRef<HTMLDivElement | null>(null);
  const [code, setCode] = useState<boolean>(false);
  const userData = useSelector(selectUserProfile);

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
          <Route element={<NotFoundErr />} path="*" />
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
          <Route element={<SavedProducts />} path="/saved-items" />
          <Route
            element={
              userData?.role === 'admin' ? <PendingProducts /> : <NotFoundErr />
            }
            path="/products-pending"
          />
          <Route
            element={<VerifyMail code={code} onSuccess={() => setCode(true)} />}
            path="/verify-email"
          />
          <Route element={<ProductsByTags />} path="/products/:selectedTag" />
          <Route
            element={!isAuth ? <Navigate to="/" /> : <WalletPage />}
            path="/wallet"
          />
        </Routes>
      </div>
    </div>
  );
};
