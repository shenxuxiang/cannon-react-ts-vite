import type { Action, Dispatch } from '@reduxjs/toolkit';

export type ReduxAction = { payload: Function | object | null } & Action;

export type Effect = (query?: any) => (dispatch: Dispatch, getState?: any) => Promise<any>;

export default class Model {
  reducer<S>() {
    const prefix = this.constructor.name;
    const keys = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    keys.splice(keys.indexOf('constructor'), 1);

    // prettier-ignore
    const initialState = ({ ...this}) as S;
    const finalTypes = keys.map((key) => `${prefix}/${key}`);

    return function (initState: S = initialState, action: ReduxAction) {
      // eslint-disable-next-line
      if (finalTypes.includes(`${prefix}/${action.type}`) && action.payload != null) {
        const payload = action.payload;
        return { ...(initState as any), ...(typeof payload === 'function' ? payload(initState) : payload) };
      } else {
        return initState;
      }
    };
  }

  actions<A>() {
    const prototype = Object.getPrototypeOf(this);
    const keys = Object.getOwnPropertyNames(prototype);
    keys.shift();

    const actions = {} as any;
    keys.forEach((key) => {
      actions[key] = prototype[key];
    });

    return actions as A;
  }
}
