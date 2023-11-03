import type { AnyAction } from 'redux';

export default function createReducer(actions: object, initialData = {}) {
  const types = new Set(Object.keys(actions));

  return function (prevState = initialData, action: AnyAction) {
    // 如果 payload 返回 null 则不更新 state。
    if (types.has(action.type) && action.payload) {
      return { ...prevState, ...action.payload };
    } else {
      return prevState;
    }
  };
}
