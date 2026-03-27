import * as api from '@/api/main';
import Model from '@/common/model';
import type { Dispatch } from '@reduxjs/toolkit';
import type { MenuItem, UserPermissions } from '@/routers';
import { getUserPermissions, getMenuItems, getHomeURL } from '@/routers';

export default class MainModel extends Model {
  // 网站首页 URL
  homeURL = '/';

  // 省市区列表
  regionList: Array<any> = [];

  // 用户菜单列表
  userMenuItems: MenuItem[] = [];

  // 用户信息
  userInfo: { [key: string]: any } = {};

  // 用户权限
  userPermissions: UserPermissions = new Map();

  queryRegionList(query: any) {
    return (dispatch: Dispatch) => {
      return api.queryRegionList(query).then((response: any) => {
        dispatch({ type: 'queryRegionList', payload: { regionList: response?.data ?? [] } });
        return response;
      });
    };
  }

  queryUserInfo() {
    return (dispatch: Dispatch) => {
      return api.queryUserInfo().then((response: any) => {
        const userInfo = response.data;
        // resourceTree 为用户路由权限
        const { resourceTree } = userInfo;
        // 用户访问页面权限
        const userPermissions = getUserPermissions(resourceTree || []);
        // 用户菜单列表
        const userMenuItems = getMenuItems(userPermissions);
        // 网站首页 URL
        const homeURL = getHomeURL(userMenuItems);

        // 如果你不希望更新 model，请将 payload 设置为 null。
        dispatch({
          type: 'queryUserInfo',
          payload: { userInfo: response?.data ?? {}, userPermissions, userMenuItems, homeURL },
        });

        // 也可以不返回任何内容，返回的内容可以在 .then() 的回调函数中获取。
        return response;
      });
    };
  }
}
