/**
 * 登录页面数据模型
 */

import request from '@/utils/axios';

export const signIn = (query: any) => request.post('/v1.0/login/admin', query);

export const signOut = () => request.post('/v1.0/logout');

export const updatePassword = (query: any) => request.post('/v1.0/sysUser/changePassword', query);
