import React, { useState, useLayoutEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Spin } from 'antd';
import classes from './index.module.less';

type Loader = () => Promise<{
  default: React.FunctionComponent | React.ComponentClass;
}>;

export default function LazyLoader(loader: Loader): React.FunctionComponent {
  return function (props: any) {
    const [content, setContent] = useState<React.FunctionComponent | React.ComponentClass | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const params = useParams();

    useLayoutEffect(() => {
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
