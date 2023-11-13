import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';
import { getMenuItems, getHomePagePath, getPermissions, routerGuard } from '@/routers';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import React, { useCallback, useEffect, memo } from 'react';
import { Popover, Layout, Avatar, Menu, Spin } from 'antd';
import { useBasicContext } from '@/common/BasicContext';
import avatarURL from '@/assets/images/avatar.png';
import useReducer from '@/utils/useReducer';
import logo from '@/assets/images/logo.png';
import { signOut } from '@/models/login';
import { effects } from '@/models';
import { isEmpty } from '@/utils';
import './index.less';

const { Content, Sider, Header, Footer } = Layout;

const initialState = () => {
  return {
    selectedMenuKeys: ['/'],
    collapsed: false,
    openKeys: ['/'],
  };
};

const MainLayout: React.FC = () => {
  const [state, setState] = useReducer(initialState);
  const { openKeys, collapsed, selectedMenuKeys } = state;
  const {
    basic: { userInfo, userMenuItems, userPermissions },
    update: updateBasicContext,
  } = useBasicContext();

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (isEmpty(userInfo)) {
      // 获取用户信息
      effects.queryUserInfo().then((response: any) => {
        const userInfo = response.data || {};
        // resourceTree 为用户路由权限
        const { resourceTree } = userInfo;
        const userPermissions = getPermissions(resourceTree || []);
        const userMenuItems = getMenuItems(userPermissions);

        updateBasicContext(() => ({ userInfo, userPermissions, userMenuItems }));
      });
      return;
    }

    const { pathname } = location;
    // 每当访问 '/' 路径时，重定向到菜单的第一项。
    if (pathname === '/') {
      const homePage = getHomePagePath(userMenuItems);
      homePage && navigate(homePage);
      return;
    }

    if (!routerGuard(userPermissions, pathname)) {
      navigate('/404');
      return;
    }

    setState({ selectedMenuKeys: [pathname], openKeys: getExpandKeys(pathname) });
  }, [location, userInfo, userMenuItems, userPermissions]);

  const handleSelectMenu = useCallback((event: any) => {
    navigate(event.key);
    setState({ selectedMenuKeys: event.selectedKeys });
  }, []);

  const handleChangeOpenKeys = useCallback((keys: any[]) => {
    setState({ openKeys: keys });
  }, []);

  // 退出登录
  const handleSignOut = () => {
    // 先调用退出接口。不管结果如何都清空本地数据缓存。
    signOut().finally(() => {
      window.localStorage.clear();
      navigate('/login');
    });
  };

  // 修改密码
  const handleResetPassword = () => {
    navigate('/update-passwd');
  };

  const handleTriggerSlider = () => {
    setState((prevState) => ({ collapsed: !prevState.collapsed }));
  };

  if (isEmpty(userInfo))
    return (
      <Spin delay={2000} spinning size="large">
        <div style={{ height: '100vh' }} />
      </Spin>
    );

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} collapsible theme="light" trigger={null} collapsed={collapsed}>
        <div className="qm-logo">
          <img src={logo} className="qm-logo-img" />
          <div className={`qm-logo-title ${collapsed ? ' hide' : ''}`}>xxx后台管理系统</div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          openKeys={openKeys}
          items={userMenuItems}
          onSelect={handleSelectMenu}
          selectedKeys={selectedMenuKeys}
          onOpenChange={handleChangeOpenKeys}
        />
      </Sider>
      <Layout className="qm-body">
        <Header className="qm-body-header">
          <span onClick={handleTriggerSlider}>
            {collapsed ? (
              <MenuUnfoldOutlined className="qm-menu-slider-button" />
            ) : (
              <MenuFoldOutlined className="qm-menu-slider-button" />
            )}
          </span>
          <Popover
            trigger="click"
            placement="bottomLeft"
            content={
              <>
                <a className="qm-signout-button" onClick={handleSignOut}>
                  退出登录
                </a>
                <a className="qm-signout-button" onClick={handleResetPassword}>
                  修改密码
                </a>
              </>
            }
          >
            <div className="qm-body-header-avatar">
              <Avatar size={48} icon={<UserOutlined />} src={userInfo.avatar || avatarURL} />
              <span className="qm-body-header-userName">{userInfo.username}</span>
            </div>
          </Popover>
        </Header>
        <Content>
          <Outlet />
        </Content>
        <Footer className="qm-body-footer">安徽阡陌网络科技有限公司 ©2022 Created by Qianmo</Footer>
      </Layout>
    </Layout>
  );
};

export default memo(MainLayout);

function getExpandKeys(pathname: string) {
  const regexp = /(\/[^/?#]+)/g;
  const expandKeys: string[] = [];
  let i = 0;
  while (regexp.test(pathname)) {
    const previousValue = expandKeys[i - 1] || '';
    expandKeys.push(previousValue + RegExp.$1);
    i++;
  }

  return expandKeys;
}
