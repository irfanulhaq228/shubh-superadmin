import "./index.css";
import 'swiper/css';
import 'swiper/css/pagination';

import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";

import { store } from "./store/store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router-dom";

import AuthCheck from "./components/AuthCheck/AuthCheck";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <Toaster />
        <AuthCheck>
          <App />
        </AuthCheck>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
