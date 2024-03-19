import { request } from '@/utils';

export const queryUserInfo = () => request.post('/v1.0/sysUser/info');
// 区域列表
export const queryRegionList = (query: any = {}) => request.post('/v1.0/chinaProvince/region', query);
