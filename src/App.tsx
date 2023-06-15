import { useReducer, getLocalStorage, historyReplace, setLocalStorage, history, isEmpty } from '@/utils';
import generateUpdateBasicContext from '@/common/generateUpdateBasicContext';
import { unstable_HistoryRouter as Router } from 'react-router-dom';
import type { BasicContextType } from '@/common/BasicContext';
import React, { memo, useMemo, useRef } from 'react';
import BasicContext from '@/common/BasicContext';
import { pathToRegexp } from 'path-to-regexp';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import { store } from '@/redux';
import Routers from '@/routers';

// 公共路径
const BASE_URL = import.meta.env.BASE_URL;
// 主题色
const THEME_COLOR = import.meta.env.VITE_THEME_COLOR;
// 根路径正则
const ROOT_PATH_PATTERN = pathToRegexp(BASE_URL);
// Antd 主题色设置
const ANTD_THEME = {
  token: {
    colorLink: THEME_COLOR,
    colorPrimary: THEME_COLOR,
  },
};

function initialState() {
  let init!: BasicContextType['context'];
  const userInfo = getLocalStorage('USER_INFO');
  const params = userInfo ? { userInfo } : {};
  // 通过调用函数完成 init 数据的初始化。
  generateUpdateBasicContext((data) => (init = data as BasicContextType['context']))(params);
  return init;
}

export default memo(() => {
  const [state, setState] = useReducer(initialState);
  const updateBasicContextRef = useRef<any>();

  if (!updateBasicContextRef.current) {
    updateBasicContextRef.current = generateUpdateBasicContext((data) => {
      // 每次更新 context 时，本地缓存同步更新
      if (!isEmpty(data?.userInfo)) setLocalStorage('USER_INFO', data.userInfo);

      setState(data);
    });
  }

  if (ROOT_PATH_PATTERN.test(history.location.pathname)) {
    if (state.homeURL) {
      historyReplace(state.homeURL);
    } else {
      historyReplace('/login');
    }
  }

  const context = useMemo(() => {
    return {
      context: state,
      updateContext: updateBasicContextRef.current,
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
