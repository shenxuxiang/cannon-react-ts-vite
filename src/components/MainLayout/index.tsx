import { MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined, SlackSquareOutlined } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useBasicContext } from '@/common/BasicContext';
import React, { useCallback, useEffect } from 'react';
import { Popover, Layout, Avatar, Menu } from 'antd';
import avatarURL from '@/assets/images/avatar.png';
import useReducer from '@/utils/useReducer';
import { signOut } from '@/api/login';
import { splitPath } from '@/utils';
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
  const navigate = useNavigate();
  const location = useLocation();
  const [state, setState] = useReducer(initialState);
  const { openKeys, collapsed, selectedMenuKeys } = state;
  const {
    context: { userInfo, userMenuItems, homeURL },
  } = useBasicContext();

  useEffect(() => {
    const { pathname } = location;

    setState({ selectedMenuKeys: [pathname], openKeys: splitPath(pathname) });
  }, [location]);

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

  // 收缩、展开菜单栏
  const handleTriggerSlider = () => {
    setState((prevState) => ({ collapsed: !prevState.collapsed }));
  };

  const goHome = () => {
    homeURL && navigate(homeURL);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={240} collapsible theme="light" trigger={null} collapsed={collapsed}>
        <div className="qm-logo" onClick={goHome}>
          <SlackSquareOutlined
            style={{
              transform: collapsed ? 'translateX(18px) scale(1.2)' : 'translateX(5px) scale(1)',
            }}
            className="qm-logo-icon"
          />
          <div className={`qm-logo-title ${collapsed ? ' hide' : ''}`}>{import.meta.env.VITE_TITLE}</div>
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

export default MainLayout;
