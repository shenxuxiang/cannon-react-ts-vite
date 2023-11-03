import request from '@/utils/axios';

export const queryTableList = () => request.post('/v1.0/home-table-list');
