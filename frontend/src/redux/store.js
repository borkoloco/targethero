import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/usersSlice";
import missionsReducer from "./slices/missionsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    missions: missionsReducer,
  },
});
