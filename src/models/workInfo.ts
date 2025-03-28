import Model from '@/common/model';
import * as api from '@/api/workInfo';
import type { Dispatch } from '@reduxjs/toolkit';
export default class WorkInfoModel extends Model {
  dataSource = {};

  queryTableList() {
    return (dispatch: Dispatch) => {
      return api.queryTableList().then((response: any) => {
        dispatch({ type: 'queryTableList', payload: null });
        return response;
      });
    };
  }
}
