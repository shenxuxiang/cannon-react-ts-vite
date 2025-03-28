import Model from '@/common/model';
import * as api from '@/api/systemRole';
import type { Dispatch } from '@reduxjs/toolkit';

export default class SystemRoleModel extends Model {
  queryRoleList() {
    return (dispatch: Dispatch) => {
      return api.queryRoleList().then((response: any) => {
        dispatch({ type: 'queryRoleList', payload: null });
        return response;
      });
    };
  }
}
