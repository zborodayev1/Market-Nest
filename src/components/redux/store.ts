import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { authReducer } from "./slices/auth";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { persistConfig } from "./persist";
import { DevTools } from 'redux-devtools-extension';

const rootReducer = combineReducers({
  // posts: postsReducer,
  auth: authReducer,
});

const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  
devTools: typeof window !== 'undefined' && window.REDUX_DEVTOOLS_EXTENSION && (window.REDUX_DEVTOOLS_EXTENSION as () => DevTools)()
});

declare global {
  interface Window {
    REDUX_DEVTOOLS_EXTENSION?: () => any;
  }
}

const persistor = persistStore(store);

export { store, persistor };