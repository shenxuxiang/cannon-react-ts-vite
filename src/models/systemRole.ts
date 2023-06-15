import * as api from '@/api/systemRole';
import type { Dispatch } from '@reduxjs/toolkit';
import createReducer from '@/redux/createReducer';

const effects = {
  queryRoleList: () => {
    return (dispatch: Dispatch) => {
      return api.queryRoleList().then((response: any) => {
        dispatch({ type: 'systemRole/queryRoleList', payload: null });
        return response;
      });
    };
  },
};

export type SystemRoleModel = {};

const { reducer, actions } = createReducer<SystemRoleModel, typeof effects>({
  name: 'systemRole',
  initialState: {},
  effects,
});

export { reducer as default, actions };
