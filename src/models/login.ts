/**
 * 登录页面数据模型
 * 当你的页面不使用 redux 进行数据状态管理，可以参考。
 */

import request from '@/utils/axios';

export const signIn = (query: any) => request.post('/v1.0/login/admin', query);

export const signOut = () => request.post('/v1.0/logout');

export const updatePassword = (query: any) => request.post('/v1.0/sysUser/changePassword', query);
