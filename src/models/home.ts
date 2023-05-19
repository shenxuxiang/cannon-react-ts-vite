/**
 * 该数据模型作为一个 '@/pages/home' 页面的数据模型；
 * effects 表示请求副作用，发起 http 请求；
 * actions 表示行为动作，对 effect 进行封装，并在 http 完成时触发 dispatch 行为，并最终触发 state 的更新，
 * 你可以根据 response 的最终返回值，决定如果更新 state，
 * 最后，触发 dispatch() 函数完成 state 的更新。dispatch() 的参数中包含 type 和 payload 两个属性，
 * 你可以查看 createReducer() 函数，来了解详细的实现逻辑；
 * 最后需要导出一个 reducer 函数，在 '@/components/LazyLoader' 组件中定义了如何使用。
 */

import { request } from '@/utils';
import type { Dispatch } from 'redux';
import createReducer from '@/redux/createReducer';

export const effects = {
  getMenuSource: (query: any) => request.post('/v1.0/menuSource', query),
};

export const actions = {
  getMenuSource(query: any) {
    return async (dispatch: Dispatch) => {
      const response: any = await effects.getMenuSource(query);
      const { code, data } = response;
      if (code === 0) {
        dispatch({ type: 'getMenuSource', payload: { menuSource: data } });
      }
      // 这里返回 response。这样你也可以在 .then() 中拿到结果。
      return response;
    };
  },
};

export const reducer = createReducer(actions);
