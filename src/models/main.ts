import * as api from '@/api/main';
import Model from '@/common/model';
import { getLocalStorage } from '@/utils';
import type { Dispatch } from '@reduxjs/toolkit';

export default class MainModel extends Model {
  regionList: Array<any> = [];

  userInfo: { [key: string]: any } = getLocalStorage('USER_INFO') || {};

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
        // 如果你不希望更新 model，请将 payload 设置为 null。
        dispatch({ type: 'queryUserInfo', payload: { userInfo: response?.data ?? {} } });
        // 也可以不返回任何内容，返回的内容可以在 .then() 的回调函数中获取。
        return response;
      });
    };
  }
}
