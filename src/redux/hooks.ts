import { useMemo } from 'react';
import type { AllModelStateType } from '@/models';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import type { ActionCreatorsMapObject } from '@reduxjs/toolkit';

type ParamType<T> = T extends (param: infer P) => any ? P : never;

export function useActions<T extends ActionCreatorsMapObject>(actions: T) {
  type Actions = {
    [K in keyof T]: undefined extends ParamType<T[K]>
      ? unknown extends ParamType<T[K]>
        ? () => ReturnType<ReturnType<T[K]>>
        : (query?: ParamType<T[K]>) => ReturnType<ReturnType<T[K]>>
      : (query: ParamType<T[K]>) => ReturnType<ReturnType<T[K]>>;
  };

  const dispatch = useDispatch();
  return useMemo(() => {
    return bindActionCreators(actions, dispatch);
  }, [dispatch, actions]) as Actions;
}

export function useModel<T extends keyof AllModelStateType>(name: T) {
  return useSelector<AllModelStateType>((state) => state[name]) as AllModelStateType[T];
}
