import { request } from '@/utils';

export const queryRoleList = () => request.post('/v1.0/system/role-list');
