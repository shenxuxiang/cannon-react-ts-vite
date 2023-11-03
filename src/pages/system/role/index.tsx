import React, { memo, useCallback, useMemo } from 'react';
import { Button, Popconfirm, Space, message } from 'antd';
import { actions } from '@/models/systemRole';
import { ContentFormTable } from 'qm-vnit';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import type { Dayjs } from 'dayjs';
import { isEmpty } from '@/utils';

const mapStateFromProps = (state: any) => {
  return { ...state.main, ...state.systemRoleModel };
};

const mapDispatchFromProps = (dispatch: Dispatch) => {
  return bindActionCreators(actions, dispatch);
};

function Page(props: any) {
  const { queryTableList, queryWorkTypeList, workTypeList } = props;
  console.log(workTypeList);

  if (isEmpty(workTypeList)) {
    queryWorkTypeList();
  }

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
      {
        title: '类型',
        dataIndex: 'type',
        formType: 'select',
        visibleInTable: false,
        options: workTypeList,
      },
    ];
  }, [workTypeList]);

  const handleValidateFormModels = useCallback((values: any) => {
    console.log(values);
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

export default memo(connect(mapStateFromProps, mapDispatchFromProps)(Page));
