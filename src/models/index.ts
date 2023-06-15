/**
 * 请将 "@/models/*.ts" 目录下的所有文件按照固定的格式导入。
 * 注意，没有被用到的 reducer、actions 就不要导入进来，TreeShake 对该文件无效。
 * @param AllModelStateType 是 redux store 的数据模型类型的集合，它涵盖项目中所有的 model。
 */

import type { MainModel } from './main';
import type { WorkInfoModel } from './workInfo';
import type { SystemRoleModel } from './systemRole';

export type AllModelStateType = {
  main: MainModel;
  workInfo: WorkInfoModel;
  systemRole: SystemRoleModel;
};

export { default as mainReducer, actions as mainActions } from './main';
export { default as workInfoReducer, actions as workInfoActions } from './workInfo';
export { default as systemRoleReducer, actions as systemRoleActions } from './systemRole';
