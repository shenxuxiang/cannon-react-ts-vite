import { mainReducer } from '@/models';
export { useActions, useModel } from './hooks';
import type { AllModelStateType } from '@/models';
import type { ReduxAction } from '@/common/model';
export { default as Model } from '@/common/model';
import type { ReducersMapObject } from '@reduxjs/toolkit';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

function createStore() {
  return configureStore({
    reducer: combineReducers({ main: mainReducer } as ReducersMapObject<AllModelStateType, ReduxAction>),
  });
}

const store = createStore();

export function replaceReducer(reducers: ReducersMapObject<Partial<AllModelStateType>, ReduxAction>) {
  store.replaceReducer(combineReducers(reducers as ReducersMapObject<AllModelStateType>));
}

export default store;
