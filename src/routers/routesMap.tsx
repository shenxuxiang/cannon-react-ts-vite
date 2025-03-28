import React from 'react';
import LazyLoader from '@/components/LazyLoader';
import { UserSwitchOutlined, SettingOutlined, HomeOutlined } from '@ant-design/icons';

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

const iconStyle = { fontSize: 18, marginRight: 10 };

const routesMap: RouteItem[] = [
  {
    path: '/work-info',
    label: '作业信息',
    icon: <HomeOutlined style={iconStyle} />,
    element: React.createElement(LazyLoader(() => import('../pages/workInfo'))),
  },
  {
    path: '/system',
    label: '系统管理',
    icon: <SettingOutlined style={iconStyle} />,
    children: [
      {
        label: '角色列表',
        path: '/system/role',
        icon: <UserSwitchOutlined style={iconStyle} />,
        element: React.createElement(LazyLoader(() => import('../pages/system/role'))),
      },
    ],
  },
  {
    path: '/404',
    element: React.createElement(LazyLoader(() => import('../pages/404'))),
  },
];

export default routesMap;
