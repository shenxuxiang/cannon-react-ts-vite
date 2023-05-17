import React from "react";
import LazyLoader from "@/components/LazyLoader";
import {
  HomeOutlined,
  SolutionOutlined,
  TeamOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { reducer as homeReducer } from "@/models/home";

type RouteItem = {
  // label 字段用在菜单中展示 router 的名称
  label?: string;
  // label 字段用在菜单中展示 router 的图标
  icon?: React.ReactElement;
  path: string;
  element?: React.ReactElement;
  children?: RouteItem[];
};

const iconStyle = { fontSize: 18, marginRight: 10, color: "#fff" };

const routesMap: RouteItem[] = [
  {
    path: "/home",
    label: "首页",
    icon: <HomeOutlined style={iconStyle} />,
    element: React.createElement(
      LazyLoader(() => import("../pages/home"), { home: homeReducer })
    ),
  },
  {
    path: "/user",
    label: "用户管理",
    icon: <SolutionOutlined style={iconStyle} />,
    children: [
      {
        path: "/user/user-list",
        element: React.createElement(
          LazyLoader(() => import("../pages/user/userList"))
        ),
        label: "用户列表",
        icon: <TeamOutlined style={iconStyle} />,
      },
      {
        path: "/user/role-list",
        element: React.createElement(
          LazyLoader(() => import("../pages/user/roleList"))
        ),
        label: "角色列表",
        icon: <UserSwitchOutlined style={iconStyle} />,
      },
    ],
  },
];

export default routesMap;
