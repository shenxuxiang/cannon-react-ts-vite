import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useBasicContext } from '@/common/BasicContext';
import React, { memo, useEffect, useMemo } from 'react';
import { createPath } from 'react-router-dom';
import { queryUserInfo } from '@/api/main';
import { routerGuard } from '@/routers';
import { getUserToken } from '@/utils';
import { isEmpty } from '@/utils';
import { message } from 'antd';

export type Meta = {
  requiresAuth?: boolean;
  [propName: string]: any;
};

type BasePageProps = {
  meta?: Meta;
  children: React.ReactElement | React.MemoExoticComponent<any> | null;
  [propName: string]: any;
};

export default memo((props: BasePageProps) => {
  const params = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { children, meta = {}, ...restProps } = props;
  const { requiresAuth = true } = meta;
  const {
    context: { userInfo, userPermissions },
    updateContext: updateBasicContext,
  } = useBasicContext();

  // 没有发现 Token 则直接跳转到登录页面。
  if (requiresAuth && location.pathname !== '/login' && !getUserToken()) {
    // 为了不影响页面的正常渲染，重定向的逻辑必须放在定时器中进行。
    setTimeout(() => {
      const querystring = window.encodeURIComponent(createPath(location));
      navigate('/login?redirection=' + querystring);
      message.warning('用户暂未登录！');
    }, 5);
    return null;
  }

  // 执行路由守卫、获取用户信息
  useEffect(() => {
    // !requiresAuth 不需要用户登录
    if (!requiresAuth) return;

    const { pathname } = location;

    // 进行路由首位
    if (!routerGuard(userPermissions, pathname)) {
      navigate('/404', { replace: true });
      return;
    }

    // 获取用户基本信息（需要登录）
    if (isEmpty(userInfo)) {
      // 获取用户信息
      queryUserInfo().then((res) => updateBasicContext({ userInfo: res.data }));
    }
  }, [userInfo, requiresAuth, location, userPermissions]);

  const child = useMemo(() => {
    if (children) {
      return React.createElement<any>(children.type);
    } else {
      return null;
    }
  }, [children]);

  return child ? React.cloneElement(child, { params, location, navigate, queryUserInfo, meta, ...restProps }) : null;
});
