import { request } from '@/utils';

export const queryTableList = () => request.post('/v1.0/home-table-list');
