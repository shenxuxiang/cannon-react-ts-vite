import React, { useRef, useEffect, useCallback, useLayoutEffect } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  UserOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Menu, Layout, Avatar, Popover, message } from "antd";
import useReducer from "@/utils/useReducer";
import { computeMenuItems } from "@/routers";
import type { MenuItem } from "@/routers";
import { getLocalStorage } from "@/utils";
import { signOut } from "@/models/login";
import logo from "@/assets/images/logo.png";
// 默认用于头像
import avatarUrl from "@/assets/images/avatar.png";
import "./index.less";

const { Content, Sider, Header, Footer } = Layout;

const initialState = () => {
  return {
    collapsed: false,
    selectedMenuKeys: ["/"],
    openKeys: ["/"],
    userName: "",
    avatar: "",
    menuItems: [] as MenuItem[],
  };
};

const MainLayout: React.FC = () => {
  const [state, setState] = useReducer(initialState);
  const { avatar, userName, menuItems, collapsed, selectedMenuKeys } = state;

  const navigate = useNavigate();
  const location = useLocation();
  const menuItemsRef = useRef<any>(null);

  useLayoutEffect(() => {
    const userInfo = getLocalStorage("USER_INFO");
    if (!userInfo) return;

    // resourceList 为用户菜单权限
    const { avatar, username: userName, resourceList } = userInfo;
    const menuPerissions = flatTreeObject(resourceList || []);
    const menuItems = computeMenuItems(menuPerissions);
    menuItemsRef.current = menuItems;
    setState({ menuItems, avatar, userName });

    function flatTreeObject(ary: any[]): Set<string> {
      const stack = [...ary];
      const map = new Set<string>();

      while (stack.length) {
        const { path, children } = stack.shift();
        map.add(path);
        if (children?.length) stack.unshift(...children);
      }
      return map;
    }
  }, []);

  useEffect(() => {
    const { pathname } = location;

    if (!getLocalStorage("TOKEN")) {
      message.warning("请先完成用户登录");
      navigate("/login");
      return;
    }

    // 每当访问 "/" 路径时，重定向到菜单的第一项。
    if (pathname === "/" && menuItemsRef.current) {
      let firstPage = menuItemsRef.current[0];
      while (firstPage?.children?.length) {
        firstPage = firstPage.children[0];
      }
      navigate(firstPage.key);
      return;
    }

    const regexp = /^(\/[^/?#]+)(\/[^/?#]+)+/;
    let openKeys: string[] = [];
    if (regexp.exec(pathname)) openKeys = [RegExp.$1];

    setState({ selectedMenuKeys: [pathname], openKeys });
  }, [location]);

  const handleSelectMenu = useCallback((event: any) => {
    navigate(event.key);
    setState({ selectedMenuKeys: event.selectedKeys });
  }, []);

  const handleChangeOpenKeys = useCallback((keys: any[]) => {
    setState({ openKeys: keys });
  }, []);

  const handleSignOut = () => {
    // 先调用退出接口。不管结果如何都清空本地数据缓存。
    signOut().finally(() => {
      window.localStorage.clear();
      navigate("/login");
    });
  };

  const handleResetPassword = () => {
    navigate("/login/passwd");
  };

  const handleTriggerSlider = () => {
    setState((prevState) => ({ collapsed: !prevState.collapsed }));
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        collapsible
        theme="dark"
        trigger={null}
        collapsed={collapsed}
      >
        <div className="hn-picc-logo">
          <img src={logo} className="hn-picc-logo-img" />
          <div className={`hn-picc-logo-title ${collapsed ? " hide" : ""}`}>
            xxx中台系统
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          items={menuItems}
          openKeys={state.openKeys}
          onSelect={handleSelectMenu}
          selectedKeys={selectedMenuKeys}
          onOpenChange={handleChangeOpenKeys}
        />
      </Sider>
      <Layout className="hn-picc-body">
        <Header className="hn-picc-body-header">
          <span onClick={handleTriggerSlider}>
            {collapsed ? (
              <MenuUnfoldOutlined className="hn-picc-menu-slider-button" />
            ) : (
              <MenuFoldOutlined className="hn-picc-menu-slider-button" />
            )}
          </span>
          <Popover
            trigger="click"
            placement="bottomLeft"
            content={
              <>
                <a className="hn-picc-signout-button" onClick={handleSignOut}>
                  退出登录
                </a>
                <a
                  className="hn-picc-signout-button"
                  onClick={handleResetPassword}
                >
                  修改密码
                </a>
              </>
            }
          >
            <div className="hn-picc-body-header-avatar">
              <Avatar
                size={48}
                icon={<UserOutlined />}
                src={avatar || avatarUrl}
              />
              <span className="hn-picc-body-header-userName">{userName}</span>
            </div>
          </Popover>
        </Header>
        <Content>
          <Outlet />
        </Content>
        <Footer className="hn-picc-body-footer">
          安徽阡陌网络科技有限公司 ©2022 Created by Qianmo
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
