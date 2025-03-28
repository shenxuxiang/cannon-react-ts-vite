import { request } from '@/utils';

export const signIn = (query: any) => request.post('/v1.0/login/admin', query);

export const signOut = () => request.post('/v1.0/sysUser/logout');

export const updatePassword = (query: any) => request.post('/v1.0/sysUser/changePassword', query);
