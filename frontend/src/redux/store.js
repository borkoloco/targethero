import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import missionsReducer from "./slices/missionsSlice";
import evidenceReducer from "./slices/evidenceSlice";
import badgesReducer from "./slices/badgesSlice";
import marketItemsReducer from "./slices/marketItemsSlice";
import purchasesReducer from "./slices/purchasesSlice";
import clientsReducer from "./slices/clientsSlice";
import revenueReducer from "./slices/revenueSlice";
import vacationReducer from "./slices/vacationSlice";
import roomReservationReducer from "./slices/roomReservationSlice"
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth"],
};

const rootReducer = combineReducers({
  auth: authReducer,
  users: usersReducer,
  missions: missionsReducer,
  evidence: evidenceReducer,
  badges: badgesReducer,
  marketItems: marketItemsReducer,
  purchases: purchasesReducer,
  clients: clientsReducer,
  revenue: revenueReducer,
  vacations: vacationReducer,
  roomReservation: roomReservationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
