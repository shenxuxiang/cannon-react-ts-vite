import { unstable_HistoryRouter as Router } from 'react-router-dom';
import type { BasicContextType } from '@/common/BasicContext';
import React, { memo, useEffect, useMemo } from 'react';
import BasicContext from '@/common/BasicContext';
import { useReducer, history } from '@/utils';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
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

function initialState() {
  return {} as BasicContextType['context'];
}

export default memo(() => {
  const [state, setState] = useReducer(initialState);

  useEffect(() => {
    return () => (window as any).stopWorkServer?.();
  }, []);

  const context = useMemo(() => {
    return {
      context: state,
      updateContext: (newState: Partial<BasicContextType['context']>) => {
        setState(newState);
      },
    };
  }, [state]);

  return (
    <ConfigProvider locale={zhCN} theme={ANTD_THEME}>
      <Provider store={store}>
        <BasicContext.Provider value={context}>
          <Router history={history as any} basename={BASE_URL}>
            <Routers />
          </Router>
        </BasicContext.Provider>
      </Provider>
    </ConfigProvider>
  );
});
