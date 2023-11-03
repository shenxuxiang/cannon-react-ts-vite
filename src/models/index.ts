import request from '@/utils/axios';

export const queryUserInfo = () => request.post('/v1.0/sysUser/info');
