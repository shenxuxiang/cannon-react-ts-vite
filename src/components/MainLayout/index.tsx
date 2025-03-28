import { splitPath, useReducer, isEmpty, getUserToken, getLocalStorage, setLocalStorage } from '@/utils';
import { MenuUnfoldOutlined, MenuFoldOutlined, SlackSquareOutlined } from '@ant-design/icons';
import { getMenuItems, getHomeURL, getUserPermissions, routerGuard } from '@/routers';
import { useNavigate, useLocation, Outlet, createPath } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Layout, Avatar, Menu, Breadcrumb, Dropdown } from 'antd';
import type { NavBarList } from 'qm-vnit/lib/NavigationBar';
import { useBasicContext } from '@/common/BasicContext';
import { NavigationBar } from 'qm-vnit';
import { mainActions } from '@/models';
import { signOut } from '@/api/login';
import { useActions } from '@/redux';
import cn from 'classnames';
import dayjs from 'dayjs';
import './index.less';

const { Content, Sider, Header, Footer } = Layout;

const currentYear = dayjs().format('YYYY');
const initialState = () => {
  const navBarList: NavBarList = getLocalStorage('ROUTER_HISTORY_LIST') || [];
  return {
    breadCrumbItems: [] as { title: string }[],
    navBarActiveKey: navBarList[0]?.key ?? '',
    selectedMenuKeys: ['/'],
    collapsed: false,
    openKeys: ['/'],
    navBarList,
  };
};

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { queryUserInfo } = useActions(mainActions);
  const [state, setState] = useReducer(initialState);
  const { openKeys, collapsed, selectedMenuKeys, breadCrumbItems, navBarList, navBarActiveKey } = state;

  const {
    context: { userInfo, userMenuItems, userPermissions, homeURL },
    updateContext: updateBasicContext,
  } = useBasicContext();

  const openKeysRef = useRef(openKeys);
  const navBarListRef = useRef<NavBarList>(navBarList);
  useEffect(() => {
    // 如果用户登录凭证不存在，则直接跳转至登录页
    if (!getUserToken()) {
      navigate('/login');
    } else if (isEmpty(userInfo)) {
      // 获取用户信息
      queryUserInfo().then((resp: any) => {
        const userInfo = resp.data;
        // resourceTree 为用户路由权限
        const { resourceTree } = userInfo;
        // 用户访问页面权限
        const userPermissions = getUserPermissions(resourceTree || []);
        // 用户菜单列表
        const userMenuItems = getMenuItems(userPermissions);
        // 网站首页 URL
        const homeURL = getHomeURL(userMenuItems);

        updateBasicContext({ userInfo, userPermissions, userMenuItems, homeURL });
      });
    } else {
      // 路由守卫
      if (location.pathname === '/') {
        if (homeURL) {
          navigate(homeURL);
        } else {
          navigate('/login');
        }
      } else if (!routerGuard(userPermissions, location.pathname)) {
        navigate('/404', { replace: true });
      } else {
        /* 更新导航面包屑、菜单、以及菜单展开项 */
        const breadCrumbItems: { title: string }[] = [];
        const pathnames = location.pathname.split('/').filter(Boolean);

        pathnames.reduce((path, name) => {
          path = path + '/' + name;
          const route = userPermissions.get(path);
          if (route) breadCrumbItems.push({ title: route.name });
          return path;
        }, '');

        setState((prevState) => {
          const data = {
            breadCrumbItems,
            selectedMenuKeys: [location.pathname],
            openKeys: splitPath(location.pathname),
          };

          if (prevState.collapsed) {
            openKeysRef.current = data.openKeys;
            // @ts-ignore
            delete data.openKeys;
          }

          return data;
        });

        /* 更新导航栏 */
        let hasMatchedPath = false;
        for (let i = 0; i < navBarListRef.current.length; i++) {
          const { key } = navBarListRef.current[i];
          if (key === location.pathname) hasMatchedPath = true;
        }

        if (!hasMatchedPath) {
          navBarListRef.current.push({
            hash: location.hash,
            key: location.pathname,
            search: location.search,
            label: userPermissions.get(location.pathname)?.name ?? '--',
          });

          setState({ navBarList: [...navBarListRef.current], navBarActiveKey: location.pathname });
          setLocalStorage('ROUTER_HISTORY_LIST', navBarListRef.current);
        } else {
          setState({ navBarActiveKey: location.pathname });
        }
      }
    }
  }, [location, homeURL, userPermissions]);

  const handleSelectMenu = useCallback((event: any) => {
    navigate(event.key);
  }, []);

  const handleChangeOpenKeys = useCallback((keys: any[]) => {
    setState({ openKeys: keys });
  }, []);

  // 收缩、展开菜单栏
  const handleTriggerSlider = useCallback(() => {
    setState({ collapsed: !collapsed, openKeys: openKeysRef.current });
  }, [collapsed]);

  const goHome = () => navigate(homeURL!);

  const renderDropdownMenu = useMemo(() => {
    // 修改密码
    const handleResetPassword = () => {
      navigate('/update-passwd');
    };

    // 退出登录
    const handleSignOut = () => {
      // 先调用退出接口。不管结果如何都清空本地数据缓存。
      signOut().finally(() => {
        window.localStorage.clear();
        navigate('/login');
      });
    };

    return {
      items: [
        {
          key: '1',
          label: <div onClick={handleSignOut}>退出登录</div>,
        },
        {
          key: '2',
          label: <div onClick={handleResetPassword}>修改密码</div>,
        },
      ],
    };
  }, []);

  const handleClickNavBar = useCallback((activeKey: string) => {
    const { search, hash, key: pathname } = navBarListRef.current.find((item) => item.key === activeKey) as any;
    navigate(createPath({ pathname, search, hash }));
  }, []);

  const handleDeleteNavBar = useCallback((navBarList: NavBarList) => {
    setState({ navBarList });
    navBarListRef.current = navBarList;
    setLocalStorage('ROUTER_HISTORY_LIST', navBarList);
  }, []);

  return (
    <Layout style={{ height: '100vh' }}>
      <Sider width={240} collapsible theme="light" trigger={null} collapsed={collapsed} className="qm-layout-left-side">
        <div className={cn(['qm-layout-logo-box', collapsed ? 'collapse' : null])} onClick={goHome}>
          <div className={cn(['qm-layout-logo', collapsed ? 'collapse' : null])}>
            <SlackSquareOutlined className="qm-layout-logo-image" />
          </div>
          <div className={cn(['qm-layout-logo-title', collapsed ? 'hide' : null])}>{import.meta.env.VITE_TITLE}</div>
        </div>
        <Menu
          theme="light"
          mode="inline"
          openKeys={openKeys}
          items={userMenuItems}
          onSelect={handleSelectMenu}
          inlineCollapsed={collapsed}
          selectedKeys={selectedMenuKeys}
          onOpenChange={handleChangeOpenKeys}
        />
      </Sider>
      <Layout className="qm-body">
        <Header className="qm-body-header">
          <div className="qm-body-header-toolbar">
            <div className="qm-body-header-toolbar-icons">
              {/* 展开 */}
              <MenuUnfoldOutlined
                onClick={handleTriggerSlider}
                className={cn(['qm-body-header-toolbar-icons-unfold', collapsed ? null : 'hide'])}
              />
              {/* 收起 */}
              <MenuFoldOutlined
                onClick={handleTriggerSlider}
                className={cn(['qm-body-header-toolbar-icons-fold', collapsed ? 'hide' : null])}
              />
            </div>

            {/* 面包屑 */}
            <Breadcrumb items={breadCrumbItems} className="qm-body-header-breadcrumb" />

            <Dropdown placement="bottomLeft" menu={renderDropdownMenu}>
              <div className="qm-body-header-admin">
                <Avatar size="small" shape="circle" style={{ backgroundColor: '#87d068', verticalAlign: 'middle' }}>
                  {userInfo?.username?.slice(0, 1)}
                </Avatar>
                <span className="qm-body-header-userName">{userInfo?.realName}</span>
              </div>
            </Dropdown>
          </div>
          <div style={{ margin: '0 -50px' }}>
            <NavigationBar
              navBarList={navBarList}
              activeKey={navBarActiveKey}
              onChange={handleClickNavBar}
              onDelete={handleDeleteNavBar}
            />
          </div>
        </Header>
        <Content className="qm-body-main">
          <SwitchTransition mode="out-in">
            <CSSTransition
              appear
              unmountOnExit
              timeout={{
                appear: 500,
                enter: 500,
                exit: 0,
              }}
              classNames="qm-router-fade"
              key={location.pathname}
            >
              <Outlet />
            </CSSTransition>
          </SwitchTransition>
        </Content>
        <Footer className="qm-body-footer">安徽阡陌网络科技有限公司 ©{currentYear} Created by Qianmo</Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
