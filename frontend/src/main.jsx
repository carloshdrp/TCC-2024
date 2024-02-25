import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import theme from "./styles/theme.json";

import { store } from "./redux/store";
import { Provider } from "react-redux";

import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ConfigProvider } from "antd";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ConfigProvider theme={theme}>
      <BrowserRouter>
        <Provider store={store}>
          <Routes>
            <Route path="/*" element={<App />} />
          </Routes>
        </Provider>
      </BrowserRouter>
    </ConfigProvider>
  </React.StrictMode>
);
