import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import zhCN from "antd/es/locale/zh_CN";
import { Provider } from "react-redux";
import { ConfigProvider } from "antd";

import store from "@/redux/store";
import Router from "@/routers";
import "./index.less";
import "@/mock/mock";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <HashRouter>
        <Router />
      </HashRouter>
    </Provider>
  </ConfigProvider>
);
