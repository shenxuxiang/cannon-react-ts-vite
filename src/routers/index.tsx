/**
 * 请不要再这里配置业务路由和菜单，配置路由请移步 ./routesMap.tsx，
 * @variable { getMenuItems }   菜单过滤（路由守卫）
 * @variable { menuItems }        生成菜单项，在 @/components/mainLayout.tsx 中被使用，
 * @variable { Router }           路由项，根据 ./routesMap.tsx 的配置生成。
 */
import React from 'react';
import routesMap from '@/routers/routesMap';
import { useRoutes } from 'react-router-dom';
import MainLayout from '@/components/MainLayout';
import LazyLoader from '@/components/LazyLoader';

export type MenuItem = {
  icon?: React.ReactNode | null;
  children?: MenuItem[];
  label: string;
  key: string;
};

export function getMenuItems(permissions: Map<string, object>, routes = routesMap) {
  const menuItems = [] as MenuItem[];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const { label, icon, path, children } = route;
    // 如果 path 在 permissions 中，则说明：该用户拥有访问该路由的权利。
    // label 作为菜单项的表示，如果没有 label 则不属于菜单项。
    if (!label || !permissions.has(path)) continue;
    const item: MenuItem = { label, key: path, icon };
    if (children?.length) item.children = getMenuItems(permissions, children);
    menuItems.push(item);
  }

  return menuItems;
}

export default function Router() {
  return useRoutes([
    {
      element: React.createElement(LazyLoader(() => import('../pages/login'), {}, { requiresAuth: false })),
      path: '/login/:status?',
    },
    {
      element: React.createElement(LazyLoader(() => import('../pages/updatePassword'))),
      path: '/update-passwd',
    },
    {
      path: '/',
      children: routesMap,
      element: <MainLayout />,
    },
  ]);
}
