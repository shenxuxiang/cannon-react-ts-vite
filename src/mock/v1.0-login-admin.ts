import { HttpResponse, http } from 'msw';

export default function loginAdmin() {
  return http.post('/v1.0/login/admin', () => {
    return HttpResponse.json({
      code: 0,
      message: '操作成功',
      data: {
        createTime: '2023-08-16T05:56:55.158602',
        updateTime: '2023-08-28T13:38:29.342',
        deleted: false,
        userId: '3',
        username: 'sxx',
        password: '',
        realName: '沈旭祥',
        dictIdType: '6',
        idNumber: '514245785411213200',
        phone: '13216176372',
        regionCode: '34',
        regionName: '安徽省',
        clientType: 'end,app,front',
        status: 1,
        avatar: '',
        description: '系统创建',
        token: '1b0944d2-d676-4f94-a0fa-328d72f6732b',
        loginClientType: 'end',
        authorities: [],
        roleList: [
          {
            createTime: '2023-08-23T13:54:27.98029',
            updateTime: '2023-08-23T13:54:27.98029',
            deleted: false,
            roleId: '7871620175240372533',
            roleName: '管理员',
            remark: '',
            status: 1,
            sort: 0,
            systemDefault: false,
            resourceIdList: [],
          },
        ],
      },
    });
  });
}
