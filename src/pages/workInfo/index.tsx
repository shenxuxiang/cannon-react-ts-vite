import { actions as workInfoActions } from '@/models/workInfo';
import React, { memo, useCallback, useMemo } from 'react';
import { Button, Popconfirm, Space, message } from 'antd';
import { useModel, useActions } from '@/redux';
import { ContentFormTable } from 'qm-vnit';
import type { Dayjs } from 'dayjs';

function Page() {
  const { queryTableList } = useActions(workInfoActions);
  const workInfoModel = useModel('workInfo');
  console.log(workInfoModel);

  const columns = useMemo(() => {
    return [
      {
        title: '姓名',
        dataIndex: 'userName',
        formType: 'input',
      },
      {
        title: '年龄',
        dataIndex: 'age',
        formType: 'input',
      },
      {
        title: '职业',
        dataIndex: 'profession',
        formType: 'input',
      },
      {
        title: '性别',
        dataIndex: 'sex',
        formType: 'select',
        options: [
          { label: '男', value: 'man' },
          { label: '女', value: 'woman' },
        ],
        initialValue: 'man',
      },
      {
        title: '操作',
        dataIndex: 'action',
        render: () => {
          return (
            <Space style={{ marginLeft: -16 }}>
              <Popconfirm title="你确定要删除这行内容吗？">
                <Button danger type="link">
                  删除
                </Button>
              </Popconfirm>
              <Button type="link">编辑</Button>
            </Space>
          );
        },
      },
      {
        title: '时间',
        dataIndex: 'time',
        formType: 'rangePicker',
        visibleInTable: false,
        dataFormat: (value: [Dayjs, Dayjs]) => {
          return {
            startTime: value[0].startOf('day').format('YYYY-MM-DD HH:mm:ss'),
            endTime: value[1].endOf('day').format('YYYY-MM-DD HH:mm:ss'),
          };
        },
      },
    ];
  }, []);

  const handleValidateFormModels = useCallback((values: any) => {
    if (!values.sex) {
      message.warning('性别不能为空！');
      return false;
    }
    return values;
  }, []);

  return (
    <ContentFormTable
      bordered
      rowKey="id"
      columns={columns}
      requestDataSource={queryTableList}
      beforeQueryAction={handleValidateFormModels}
    />
  );
}

export default memo(Page);
