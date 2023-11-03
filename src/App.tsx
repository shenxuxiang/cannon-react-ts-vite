import { unstable_HistoryRouter as Router } from 'react-router-dom';
import React, { memo, useState, useMemo } from 'react';
import BasicContext from '@/common/BasicContext';
import zhCN from 'antd/es/locale/zh_CN';
import { ConfigProvider } from 'antd';
import history from '@/utils/history';
import Routers from '@/routers';

function App() {
  const [state, setState] = useState({ userInfo: {}, menuItems: [], permissions: new Map() });

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
        <Router history={history as any}>
          <Routers />
        </Router>
      </BasicContext.Provider>
    </ConfigProvider>
  );
}

export default memo(App);
