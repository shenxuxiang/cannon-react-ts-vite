import * as api from '@/api/workInfo';
import type { Dispatch } from '@reduxjs/toolkit';
import createReducer from '@/redux/createReducer';

const effects = {
  queryTableList: () => {
    return (dispatch: Dispatch) => {
      return api.queryTableList().then((response: any) => {
        dispatch({ type: 'workinfo/queryTableList', payload: null });
        return response;
      });
    };
  },
};

export type WorkInfoModel = {};

const { reducer, actions } = createReducer<WorkInfoModel, typeof effects>({
  name: 'workinfo',
  initialState: {
    dataSource: {},
  },
  effects,
});

export { reducer as default, actions };
