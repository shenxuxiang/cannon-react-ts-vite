import type { AnyAction } from 'redux';

export default function createReducer(actions: object) {
  const types = new Set(Object.keys(actions));

  return function (prevState = {}, action: AnyAction) {
    if (types.has(action.type)) {
      return { ...prevState, ...action.payload };
    } else {
      return prevState;
    }
  };
}
