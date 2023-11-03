import request from '@/utils/axios';
import type { Dispatch } from 'redux';
import createReducer from '@/redux/createReducer';

export const effects = {
  queryTableList: () => request.post('/v1.0/home-table-list'),
};

export const actions = {
  queryTableList: () => {
    return (dispatch: Dispatch) => {
      return effects.queryTableList().then((response: any) => {
        dispatch({ type: 'queryTableList', payload: null });
        return response;
      });
    };
  },
};

export default createReducer(actions);
