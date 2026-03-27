/**
 * 请将 "@/models/*.ts" 目录下的所有文件按照固定的格式导入。
 * 注意，没有被用到的 reducer、actions 就不要导入进来，TreeShake 对该文件无效。
 * @param AllModelStateType 是 redux store 的数据模型类型的集合，它涵盖项目中所有的 model。
 */

import MainModel from './main';
import WorkInfoModel from './workInfo';
import SystemRoleModel from './systemRole';

export type AllModelStateType = {
  main: MainModel;
  workInfo: WorkInfoModel;
  systemRole: SystemRoleModel;
};

const mainModel = new MainModel();
export const mainReducer = mainModel.reducer<MainModel>();
export const mainActions = mainModel.actions<typeof MainModel.prototype>();

// 作业信息
const workInfoModel = new WorkInfoModel();
export const workInfoReducer = workInfoModel.reducer<WorkInfoModel>();
export const workInfoActions = workInfoModel.actions<typeof WorkInfoModel.prototype>();

// 系统管理
const systemRoleModel = new SystemRoleModel();
export const systemRoleReducer = systemRoleModel.reducer<SystemRoleModel>();
export const systemRoleActions = systemRoleModel.actions<typeof SystemRoleModel.prototype>();
