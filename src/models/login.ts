/**
 * 登录页面数据模型
 * 当你的页面不使用 redux 进行数据状态管理，可以参考。
 */

import axios from "@/utils/axios";

export const signIn = (query: any) => axios.post("/v1.0/login/admin", query);

export const signOut = () => axios.post("/v1.0/logout");

export const updatePassword = (query: any) =>
  axios.post("/v1.0/sysUser/changePassword", query);
