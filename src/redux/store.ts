import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import createSagaMiddleware from 'redux-saga';
import { persistConfig } from './persist';
import { rootSaga } from './sagas/rootSaga';
import { authReducer } from './slices/authSlice';
import { deliveryReducer } from './slices/deliverySlice';
import { notificationsReducer } from './slices/notificationSlice';
import { productReducer } from './slices/productSlice';
import { walletReducer } from './slices/walletSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationsReducer,
  delivery: deliveryReducer,
  products: productReducer,
  wallet: walletReducer,
});

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga);

const persistor = persistStore(store);

export { persistor, store };

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
