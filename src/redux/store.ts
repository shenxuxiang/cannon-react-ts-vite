import reducer from '@/models/main';
import type { AllModelStateType } from '@/models';
import type { ReducersMapObject } from '@reduxjs/toolkit';
import { configureStore, combineReducers } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: {
    main: reducer,
  } as ReducersMapObject<AllModelStateType>,
});

export default store;

export function replaceReducer(reducers: ReducersMapObject<Partial<AllModelStateType>>) {
  store.replaceReducer(combineReducers(reducers as ReducersMapObject<AllModelStateType>));
}
