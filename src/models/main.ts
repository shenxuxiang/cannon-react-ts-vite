import * as api from '@/api/main';
import { getLocalStorage } from '@/utils';
import type { Dispatch } from '@reduxjs/toolkit';
import createReducer from '@/redux/createReducer';

const effects = {
  queryRegionList: (query: any) => {
    return (dispatch: Dispatch) => {
      return api.queryRegionList(query).then((response: any) => {
        dispatch({ type: 'main/queryRegionList', payload: { regionList: response?.data ?? [] } });
        return response;
      });
    };
  },
  queryUserInfo: () => {
    return (dispatch: Dispatch) => {
      return api.queryUserInfo().then((response: any) => {
        // 如果你不希望更新 model，请将 payload 设置为 null。
        dispatch({ type: 'main/queryUserInfo', payload: { userInfo: response?.data ?? {} } });
        // 也可以不返回任何内容，返回的内容可以在 .then() 的回调函数中获取。
        return response;
      });
    };
  },
};

export type MainModel = {
  regionList: Array<any>;
  userInfo: { [key: string]: any };
};

const { reducer, actions } = createReducer<MainModel, typeof effects>({
  name: 'main',
  initialState: {
    regionList: [],
    userInfo: getLocalStorage('USER_INFO') || {},
  },
  effects,
});

export { reducer as default, actions };
