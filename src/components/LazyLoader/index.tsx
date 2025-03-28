import { useParams, useNavigate, useLocation } from 'react-router-dom';
import React, { useState, useEffect, memo } from 'react';
import { mainActions, mainReducer } from '@/models';
import type { Reducer } from '@reduxjs/toolkit';
import { useModel, useActions } from '@/redux';
import { ReduxAction } from '@/common/model';
import { replaceReducer } from '@/redux';
import { Spin } from 'antd';

type Models = { [propName: string]: Reducer<any, ReduxAction> };

type ChildrenType = React.ReactElement | React.MemoExoticComponent<any>;

type Loader = () => Promise<{ default: ChildrenType }>;

export default function LazyLoader(loader: Loader, models?: Models): React.FunctionComponent {
  return memo(() => {
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const mainModel = useModel('main');
    const actions = useActions(mainActions);
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
        {children
          ? React.createElement(children.type, {
              ...mainModel,
              ...actions,
              location,
              navigate,
              params,
            })
          : null}
      </Spin>
    );
  });
}
