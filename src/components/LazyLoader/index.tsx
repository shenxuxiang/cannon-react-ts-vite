import { useParams, useLocation, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import classes from './index.module.less';
import { getUserToken } from '@/utils';
import { Spin, message } from 'antd';

type Loader = () => Promise<{ default: React.FunctionComponent | React.ComponentClass }>;

type Meta = {
  requiresAuth: boolean;
  [propName: string]: any;
};

export default function LazyLoader(loader: Loader, meta?: Meta): React.FunctionComponent {
  return function (props: any) {
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
  };
}
