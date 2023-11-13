/**
 * 请不要再这里配置业务路由和菜单，配置路由请移步 ./routesMap.tsx，
 * @variable { getMenuItems }   菜单过滤（路由守卫）
 * @variable { menuItems }      生成菜单项，在 @/components/mainLayout.tsx 中被使用，
 * @variable { Router }         路由项，根据 ./routesMap.tsx 的配置生成。
 */
import React from 'react';
import routesMap from '@/routers/routesMap';
export type { RouteItem } from './routesMap';
import MainLayout from '@/components/MainLayout';
import LazyLoader from '@/components/LazyLoader';
import { useRoutes, matchPath } from 'react-router-dom';

const noCheckupPageList = ['/login', '/404', '/update-passwd'];

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

export type MenuItem = {
  icon?: React.ReactNode | null;
  children?: MenuItem[];
  label: string;
  key: string;
};

/**
 * 将 resourceTree 转换成 Map 类型的数据结构。
 * @param resourceTree
 * @returns
 */
export function getPermissions(resourceTree: any[]) {
  const stack = [...resourceTree];
  const permissions = new Map<string, { name: string; path: string }>();

  while (stack.length) {
    const item = stack.shift();
    const { code, children, name, type, path } = item;
    let routePath = '';
    if (type === 1 || type === 2) routePath = code;
    if (type === 3) routePath = path;
    if (routePath) {
      permissions.set(routePath, { path: routePath, name });
      let length = children?.length ?? 0;

      while (length--) {
        stack.unshift(children[length]);
      }
    }
  }

  return permissions;
}

/**
 * 获取用户菜单列表
 * @param permissions 用户路由权限
 * @param routes 路由配置
 * @returns
 */
export function getMenuItems(permissions: Map<string, { name: string; path: string }>, routes = routesMap) {
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

/**
 * 路由守卫
 * @param permissions 路由权限集合
 * @param pathname 页面路径
 * @returns
 */
export function routerGuard(permissions: Map<string, object>, pathname: string) {
  if (noCheckupPageList.indexOf(pathname) >= 0) return true;

  if (permissions.has(pathname)) return true;

  let matched = null;
  permissions.forEach((_, k) => {
    if (matched!) return;
    matched = matchPath(k, pathname);
  });

  if (matched) return true;

  return false;
}

// 找出菜单的第一项。
export function getHomePagePath(menuItems: MenuItem[]) {
  if (!menuItems?.length) return null;

  const stack = [menuItems[0]];
  let firstItem = {} as MenuItem;
  while (stack.length) {
    firstItem = stack.shift()!;
    if (firstItem?.children?.length) stack.push(firstItem.children[0]);
  }

  return firstItem?.key ?? null;
}
