import { unstable_HistoryRouter as Router } from 'react-router-dom';
import ReactDOM from 'react-dom/client';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import history from '@/utils/history';
import Routers from '@/routers';
import React from 'react';
import './index.less';
import '@/mock/mock';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <ConfigProvider locale={zhCN}>
    <Router history={history as any}>
      <Routers />
    </Router>
  </ConfigProvider>,
);
