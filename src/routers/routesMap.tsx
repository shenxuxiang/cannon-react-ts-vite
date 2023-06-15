import React from 'react';
import LazyLoader from '@/components/LazyLoader';
import { UserSwitchOutlined, SolutionOutlined, HomeOutlined, TeamOutlined } from '@ant-design/icons';

export type RouteItem = {
  // 组件
  element?: React.ReactElement;
  // 菜单图标
  icon?: React.ReactElement;
  // 子路由
  children?: RouteItem[];
  // 菜单名称
  label?: string;
  // 路由路径
  path: string;
};

const iconStyle = { fontSize: 18, marginRight: 10, color: '#fff' };

const routesMap: RouteItem[] = [
  {
    path: '/home',
    label: '首页',
    icon: <HomeOutlined style={iconStyle} />,
    element: React.createElement(LazyLoader(() => import('../pages/home'))),
  },
  {
    path: '/user',
    label: '用户管理',
    icon: <SolutionOutlined style={iconStyle} />,
    children: [
      {
        label: '用户列表',
        path: '/user/user-list',
        icon: <TeamOutlined style={iconStyle} />,
        element: React.createElement(LazyLoader(() => import('../pages/user/userList'))),
      },
      {
        path: '/user/role-list',
        label: '角色列表',
        icon: <UserSwitchOutlined style={iconStyle} />,
        element: React.createElement(LazyLoader(() => import('../pages/user/roleList'))),
      },
    ],
  },
  {
    path: '/404',
    element: React.createElement(LazyLoader(() => import('../pages/404'))),
  },
];

export default routesMap;
