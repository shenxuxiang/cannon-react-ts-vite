import React, { useState, useEffect, memo } from 'react';
import type { Meta } from '@/components/BasePage';
import BasePage from '@/components/BasePage';
import { Spin } from 'antd';

type ChildrenType = React.ReactElement | React.MemoExoticComponent<any>;

type Loader = () => Promise<{ default: ChildrenType }>;

export default function LazyLoader(loader: Loader, meta?: Meta): React.FunctionComponent {
  return memo((props: any) => {
    const [children, setChildren] = useState<ChildrenType | null>(null);

    useEffect(() => {
      loader().then((res) => setChildren(() => res.default));
    }, []);

    return (
      <Spin delay={500} spinning={!children} size="large">
        <div style={{ height: 'calc(100vh - 131px)', display: !children ? 'block' : 'none' }} />
        <BasePage children={children} meta={meta} {...props} />
      </Spin>
    );
  });
}
