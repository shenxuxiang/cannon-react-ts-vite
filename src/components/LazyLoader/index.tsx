import { useParams, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import reducer, { actions } from '@/models';
import { bindActionCreators } from 'redux';
import classes from './index.module.less';
import { combineReducers } from 'redux';
import { getUserToken } from '@/utils';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Spin, message } from 'antd';
import type { Reducer } from 'redux';
import store from '@/redux/store';

type Loader = () => Promise<{ default: React.FunctionComponent | React.ComponentClass }>;

type Models = { [propName: string]: Reducer };

type Meta = {
  requiresAuth: boolean;
  [propName: string]: any;
};

const mapStateFromProps = (state: any) => {
  return state.main;
};

const mapDispatchFromProps = (dispatch: Dispatch) => {
  return bindActionCreators(actions, dispatch);
};

export default function LazyLoader(loader: Loader, models?: Models, meta?: Meta): React.FunctionComponent {
  return connect(
    mapStateFromProps,
    mapDispatchFromProps,
  )((props: any) => {
    const [content, setContent] = useState<React.FunctionComponent | React.ComponentClass | null>(null);
    const params = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
      // meta 表示元数据，requiresAuth 默认为 true，
      // 表示必须用户登录。可以再添加路由时手动设置为 false
      const { requiresAuth = true } = meta || {};

      if (requiresAuth && !getUserToken()) {
        message.warning('用户暂未登录！');
        navigate('/login');
        return;
      }

      loader().then((response) => {
        store.replaceReducer(combineReducers({ main: reducer, ...models }));
        setContent(() => response.default);
      });
    }, []);

    if (content) {
      let Comp = content;
      return <Comp {...props} params={params} location={location} navigate={navigate} />;
    }

    return (
      <div className={classes.loading}>
        <Spin size="large" />
      </div>
    );
  });
}
