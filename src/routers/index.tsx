/**
 * 请不要再这里配置业务路由和菜单，配置路由请移步 ./routesMap.tsx，
 * @variable { filterMenuTree }   菜单过滤（路由守卫）
 * @variable { menuItems }        生成菜单项，在 @/components/mainLayout.tsx 中被使用，
 * @variable { Router }           路由项，根据 ./routesMap.tsx 的配置生成。
 */
import React from 'react';
import { useRoutes } from 'react-router-dom';
import routesMap from '@/routers/routesMap';
import MainLayout from '@/components/MainLayout';
import LazyLoader from '@/components/LazyLoader';

export type MenuItem = {
  icon?: React.ReactNode | null;
  children?: MenuItem[];
  label: string;
  key: string;
};

export function filterMenuTree(permissions: Map<string, object>, routes = routesMap) {
  const menuItems = [] as MenuItem[];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const { label, icon, path, children } = route;
    // 菜单项过滤，且不考虑该 Route 的子路由
    if (!label || !permissions.has(path)) continue;
    const item: MenuItem = { label, key: path, icon };
    if (children?.length) item.children = filterMenuTree(permissions, children);
    menuItems.push(item);
  }

  return menuItems;
}

export default function Router() {
  return useRoutes([
    {
      element: React.createElement(LazyLoader(() => import('../pages/login'))),
      path: '/login/:status?',
    },
    {
      path: '/',
      children: routesMap,
      element: <MainLayout />,
    },
  ]);
}
