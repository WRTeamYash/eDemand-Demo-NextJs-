import { combineReducers, configureStore } from "@reduxjs/toolkit";
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
import storage from "redux-persist/lib/storage";
import themeReducer from "./reducers/themeSlice";
import multiCategoriesReducer from "./reducers/multiCategoriesSlice";
import cartReducer from "./reducers/cartSlice";
import locationReducer from "./reducers/locationSlice";
import settingReducer from "./reducers/settingSlice";
import userReducer from "./reducers/userDataSlice";
import helperReducer from "./reducers/helperSlice";
import translationReducer from "./reducers/translationSlice";
import reorderReducer from './reducers/reorderSlice';

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  theme: themeReducer,
  multiCategories: multiCategoriesReducer,
  cart: cartReducer,
  location: locationReducer,
  settingsData: settingReducer,
  userData: userReducer,
  helper: helperReducer,
  translation: translationReducer,
  reorder: reorderReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
