/**
 * 该文件文件引入到 @/redux/index，避免造成循环加载。
 */
import { isEmpty } from '@/utils';
import type { AnyAction } from '@reduxjs/toolkit';

type CreateReducerOptions<T, E> = {
  effects: E;
  name: string;
  initialState: T;
};

export default function createReducer<S extends object, E extends object>(options: CreateReducerOptions<S, E>) {
  const { name, effects, initialState } = options;
  const keys = new Set(Object.keys(effects).map((key) => name + '/' + key));

  function reducer(state = initialState, action: AnyAction): S {
    if (!isEmpty(action.payload) && keys.has(action.type)) {
      return { ...state, ...action.payload };
    } else {
      return state;
    }
  }

  return { reducer, actions: effects };
}
