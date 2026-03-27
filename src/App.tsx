import { unstable_HistoryRouter as Router } from 'react-router-dom';
import { memo, useEffect } from 'react';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { history } from '@/utils';
import Routers from '@/routers';
import store from '@/redux';

// 公共路径
const BASE_URL = import.meta.env.BASE_URL;
// 主题色
const THEME_COLOR = import.meta.env.VITE_THEME_COLOR;
// Antd 主题色设置
const ANTD_THEME = {
  token: { colorLink: THEME_COLOR, colorPrimary: THEME_COLOR },
};

function App() {
  useEffect(() => {
    return () => window.stopWorkServer?.();
  }, []);

  return (
    <ConfigProvider locale={zhCN} theme={ANTD_THEME}>
      <Provider store={store}>
        <Router history={history as any} basename={BASE_URL}>
          <Routers />
        </Router>
      </Provider>
    </ConfigProvider>
  );
}
export default memo(App);
