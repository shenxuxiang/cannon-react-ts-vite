import Mock from 'mockjs';

// 登录
Mock.mock('/v1.0/login/admin', 'post', {
  code: 0,
  message: '操作成功',
  data: {
    id: '6396cddf1a4afe167885797f',
    username: 'jasmine',
    password: '',
    regionCode: '4100',
    regionName: '湖南省',
    organizationId: 0,
    realName: 'jasmine',
    phone: '',
    avatar: '',
    clientId: 'end',
    status: 1,
    superAdmin: false,
    createdTime: null,
    updateTime: '2022-12-12 14:44:46',
    token: '990ce234-8ba2-4da5-931e-cce302962be9',
    loginType: 'end',
    roleIdList: ['1', '2'],
    resourceList: [
      {
        id: 'user',
        path: '/user',
        children: [
          {
            id: 'user-1',
            path: '/user/user-list',
          },
          {
            id: 'user-2',
            path: '/user/role-list',
          },
        ],
      },
      {
        id: 'home',
        path: '/home',
      },
    ],
  },
});

Mock.mock('/v1.0/logout', 'post', {
  code: 0,
  message: '操作成功',
  data: null,
});

Mock.mock('/v1.0/sysUser/changePassword', 'post', {
  code: 0,
  message: '操作成功',
  data: null,
});

Mock.mock('/v1.0/menuSource', 'post', {
  code: 0,
  message: '操作成功',
  data: [
    {
      path: '/home',
    },
    {
      path: '/user',
      children: [
        {
          path: '/user/user-list',
        },
        {
          path: '/user/role-list',
        },
      ],
    },
  ],
});
