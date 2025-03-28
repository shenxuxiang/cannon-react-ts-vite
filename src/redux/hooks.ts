import { useMemo } from 'react';
import type { AllModelStateType } from '@/models';
import { bindActionCreators } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';

type PT<T> = T extends (param: infer P) => any ? P : never;

type RT<T> = T extends (...args: any) => infer R ? R : never;

type RT2<T> = RT<RT<T>>;

export function useActions<T>(actions: T) {
  type Actions = {
    [K in keyof T]: undefined extends PT<T[K]>
      ? unknown extends PT<T[K]>
        ? () => RT2<T[K]>
        : (query?: PT<T[K]>) => RT2<T[K]>
      : (query: PT<T[K]>) => RT2<T[K]>;
  };

  const dispatch = useDispatch();
  return useMemo(() => {
    return bindActionCreators(actions as any, dispatch);
  }, [dispatch, actions]) as Actions;
}

export function useModel<T extends keyof AllModelStateType>(name: T) {
  return useSelector<AllModelStateType>((state) => state[name]) as AllModelStateType[T];
}
