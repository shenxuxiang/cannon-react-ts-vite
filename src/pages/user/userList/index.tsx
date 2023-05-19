import React, { memo } from 'react';
import classes from './index.module.less';
import { useReducer } from '@/utils';
import { Input, Button, Space, Alert } from 'antd';

function initialState() {
  return {
    count: 0,
    loading: false,
    inputValue: 'hello world',
  };
}

function Page(props: any) {
  const [state, setState] = useReducer(initialState);

  return (
    <div className={classes.page}>
      <Alert type="success" message="hello world" />

      <h2>user list page</h2>
      <h3>{state.inputValue}</h3>
      <Space>
        <Button type="primary" onClick={() => setState((prevState) => ({ count: prevState.count + 1 }))}>
          plus {state.count}
        </Button>

        <Button onClick={() => setState((prevState) => ({ count: 0 }))}>reset</Button>
      </Space>

      <div style={{ height: 20 }} />

      <Input
        maxLength={20}
        value={state.inputValue}
        onChange={(event: any) => setState({ inputValue: event.target.value })}
      />
    </div>
  );
}

export default memo(Page);
