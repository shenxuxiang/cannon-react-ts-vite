/**
 * 请不要再这里配置业务路由和菜单，配置路由请移步 ./routesMap.tsx，
 * @variable { getMenuItems }   菜单过滤（路由守卫）
 * @variable { menuItems }        生成菜单项，在 @/components/mainLayout.tsx 中被使用，
 * @variable { Router }           路由项，根据 ./routesMap.tsx 的配置生成。
 */
import React, { memo } from 'react';
import routesMap from '@/routers/routesMap';
import MainLayout from '@/components/MainLayout';
import LazyLoader from '@/components/LazyLoader';
import { useRoutes, matchPath } from 'react-router-dom';

export type ResourceTree = {
  code: string;
  name: string;
  children?: ResourceTree;
}[];

/**
 * 获取用户权限
 * @param resourceTree
 * @returns
 */
export function getUserPermissions(resourceTree: ResourceTree) {
  const stack = [...resourceTree];
  const menuMap = new Map<string, { name: string; path: string }>();

  while (stack.length) {
    const item = stack.shift()!;
    const { code, children, name } = item;
    menuMap.set(code, { path: code, name });
    children?.length && stack.push(...children);
  }

  return menuMap;
}

export type MenuItem = {
  icon?: React.ReactNode | null;
  children?: MenuItem[];
  label: string;
  key: string;
};

/**
 * 计算菜单列表
 * @param permissions 用户权限集合
 * @param routes      路由集合
 * @returns
 */
export function getMenuItems(permissions: Map<string, object>, routes = routesMap) {
  const menuItems = [] as MenuItem[];

  for (let i = 0; i < routes.length; i++) {
    const route = routes[i];
    const { label, icon, path, children } = route;
    // 如果 path 在 permissions 中，则说明：该用户拥有访问该路由的权利。
    // label 作为菜单项的标题，如果没有 label 则不属于菜单项。
    if (!label || !permissions.has(path)) continue;
    const item: MenuItem = { label, key: path, icon };
    if (children?.length) item.children = getMenuItems(permissions, children);
    menuItems.push(item);
  }

  return menuItems;
}

/**
 * 获取网站首页 URL
 * @param menuItems 菜单列表
 * @returns
 */
export function getHomeURL(menuItems: MenuItem[]) {
  if (!menuItems?.length) return null;

  const stack = [menuItems[0]];
  let firstItem = {} as MenuItem;
  while (stack.length) {
    firstItem = stack.shift()!;
    if (firstItem?.children?.length) stack.push(firstItem.children[0]);
  }

  return firstItem?.key ?? null;
}

// 无须校验的路径集合
const pathnameListOfNotValidate = new Set(['/404', '/login', '/update-passwd']);

/**
 * 路由守卫
 * @param permissions 路由权限集合
 * @param pathname 页面路径（不含 hash、search）
 * @returns
 */
export function routerGuard(permissions: Map<string, object>, pathname: string) {
  if (pathnameListOfNotValidate.has(pathname)) return true;

  if (permissions.size <= 0 || permissions.has(pathname)) return true;

  let matched = null;
  permissions.forEach((_, k) => {
    if (matched!) return;
    matched = matchPath(k, pathname);
  });

  if (matched) return true;

  return false;
}

export default memo(() => {
  return useRoutes([
    {
      element: React.createElement(LazyLoader(() => import('../pages/login'), {}, { requiresAuth: false })),
      path: '/login',
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
    {
      path: '*',
      element: React.createElement(LazyLoader(() => import('../pages/404'), {}, { requiresAuth: false })),
    },
  ]);
});
