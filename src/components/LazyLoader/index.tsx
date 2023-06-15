import React, { useState, useEffect, memo } from 'react';
import type { Meta } from '@/components/BasePage';
import type { Reducer } from '@reduxjs/toolkit';
import BasePage from '@/components/BasePage';
import { replaceReducer } from '@/redux';
import { mainReducer } from '@/models';
import { Spin } from 'antd';

type Models = { [propName: string]: Reducer };

type ChildrenType = React.ReactElement | React.MemoExoticComponent<any>;

type Loader = () => Promise<{ default: ChildrenType }>;

export default function LazyLoader(loader: Loader, models?: Models, meta?: Meta): React.FunctionComponent {
  return memo(() => {
    const [children, setChildren] = useState<ChildrenType | null>(null);

    useEffect(() => {
      loader().then((res) => {
        replaceReducer({ main: mainReducer, ...models });
        setChildren(() => res.default);
      });
    }, []);

    return (
      <Spin delay={500} spinning={!children} size="large">
        <div style={{ height: 'calc(100vh - 131px)', display: !children ? 'block' : 'none' }} />
        <BasePage children={children} meta={meta} />
      </Spin>
    );
  });
}
