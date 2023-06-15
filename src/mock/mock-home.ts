import Mock from 'mockjs';

// 登录
Mock.mock('/v1.0/home-table-list', 'post', {
  code: 0,
  message: '操作成功',
  data: {
    list: [
      {
        id: '1',
        userName: '张十三',
        sex: 'man',
        age: 30,
        tel: '13333333333',
        profession: '电工',
      },
      {
        id: '2',
        userName: '王五',
        sex: 'man',
        age: 30,
        tel: '13945093333',
        profession: '演员',
      },
      {
        id: '3',
        userName: '小沈',
        sex: 'man',
        age: 30,
        tel: '18200010022',
        profession: '程序员',
      },
      {
        id: '4',
        userName: '张飞',
        sex: 'man',
        age: 33,
        tel: '17888889999',
        profession: '普通职工',
      },
      {
        id: '5',
        userName: '关于',
        sex: 'man',
        age: 34,
        tel: '18088227766',
        profession: '高级白领',
      },
    ],
    pageSize: 10,
    total: 100,
    pageNum: 1,
  },
});

Mock.mock('/v1.0/system/role-list', 'post', {
  code: 0,
  message: '操作成功',
  data: {
    list: [
      {
        id: '1',
        userName: '张十三',
        sex: 'man',
        age: 30,
        tel: '13333333333',
        profession: '电工',
      },
      {
        id: '2',
        userName: '王五',
        sex: 'man',
        age: 30,
        tel: '13945093333',
        profession: '演员',
      },
      {
        id: '3',
        userName: '小沈',
        sex: 'man',
        age: 30,
        tel: '18200010022',
        profession: '程序员',
      },
      {
        id: '4',
        userName: '张飞',
        sex: 'man',
        age: 33,
        tel: '17888889999',
        profession: '普通职工',
      },
      {
        id: '5',
        userName: '关于',
        sex: 'man',
        age: 34,
        tel: '18088227766',
        profession: '高级白领',
      },
    ],
    pageSize: 10,
    total: 100,
    pageNum: 1,
  },
});
