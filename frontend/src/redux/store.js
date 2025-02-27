// src/store/store.js
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import missionsReducer from "./slices/missionsSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"], // only persist the auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  missions: missionsReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  // Optionally, disable serializable check if you face warnings:
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "./slices/authSlice";
// import usersReducer from "./slices/usersSlice";
// import missionsReducer from "./slices/missionsSlice";

// export const store = configureStore({
//   reducer: {
//     auth: authReducer,
//     users: usersReducer,
//     missions: missionsReducer,
//   },
// });
