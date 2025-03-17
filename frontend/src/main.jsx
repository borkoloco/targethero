import React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import App from "./App.jsx";
import "./index.css";
import { store, persistor } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import RealTimeUpdater from "./socket/RealTimeUpdater.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RealTimeUpdater />
        <App />
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
