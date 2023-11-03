/**
 * userInfo 这样的基础数据已经注入到 BasicContext 中，所以在这里就不用再次注入到 model 层了。
 * actions 中的属性默认将会注入到页面 props 中，如果不想将其注入到页面，就不要在 actions 中添加，建议直接使用 effects 中定义的方法。
 */
import request from '@/utils/axios';
import type { Dispatch } from 'redux';
import createReducer from '@/redux/createReducer';

const INITIAL_DATA = {
  workTypeList: [],
};

export const effects = {
  queryUserInfo: () => request.post('/v1.0/sysUser/info'),
  queryWorkTypeList: () => request.post('/v1.0/sysDict/type/list'),
};

export const actions = {
  queryWorkTypeList: () => {
    return (dispatch: Dispatch) => {
      return effects.queryWorkTypeList().then((response: any) => {
        dispatch({
          type: 'queryWorkTypeList',
          payload: {
            workTypeList: response.data?.map((item: any) => ({ value: item.dictId, label: item.dictName })) ?? [],
          },
        });
        return response;
      });
    };
  },
};

export default createReducer(actions, INITIAL_DATA);
