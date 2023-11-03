import { unstable_HistoryRouter as Router } from 'react-router-dom';
import BasicContext from '@/common/BasicContext';
import React, { memo, useMemo } from 'react';
import useReducer from './utils/useReducer';
import zhCN from 'antd/es/locale/zh_CN';
import { Provider } from 'react-redux';
import { ConfigProvider } from 'antd';
import history from '@/utils/history';
import store from '@/redux/store';
import Routers from '@/routers';

function initialState() {
  return {
    userInfo: {},
    userMenuItems: [],
    userPermissions: new Map(),
  };
}

function App() {
  const [state, setState] = useReducer(initialState);

  const context = useMemo(() => {
    return {
      basic: state,
      update: setState,
    };
  }, [state, setState]);

  const theme = {
    token: { colorPrimary: '#6C69FF', colorLink: '#6C69FF' },
  };

  return (
    <ConfigProvider locale={zhCN} theme={theme}>
      <BasicContext.Provider value={context}>
        <Provider store={store}>
          <Router history={history as any}>
            <Routers />
          </Router>
        </Provider>
      </BasicContext.Provider>
    </ConfigProvider>
  );
}

export default memo(App);
