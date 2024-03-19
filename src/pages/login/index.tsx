import { setUserToken, getUserToken, setCookie, getCookie, encrypto, useReducer } from '@/utils';
import { Button, message, Checkbox, ConfigProvider, Spin } from 'antd';
import React, { memo, useCallback, useEffect, useMemo } from 'react';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useBasicContext } from '@/common/BasicContext';
import type { Rule } from '@/components/LoginInput';
import Input from '@/components/LoginInput';
import classes from './index.module.less';
import { signIn } from '@/api/login';

type Rules = { [propName: string]: Array<Rule> };

function initialState() {
  return {
    userName: '',
    password: '',
    loading: false,
    spinning: true,
    memorizeUser: false,
  };
}

function Login(props: any) {
  const [state, setState] = useReducer(initialState);
  const { location, navigate, queryUserInfo } = props;
  const { updateContext: updateBasicContext } = useBasicContext();
  const { loading, userName, password, memorizeUser, spinning } = state;

  useEffect(() => {
    // 如果 Token 存在，则直接获取用户信息并跳转到网站首页。否则需要用户手动登录。
    if (getUserToken()) {
      // 菜单和用户访问权限都在用户信息中。
      queryUserInfo()
        .then(async (res: any) => {
          updateBasicContext({ userInfo: res.data });
          // 回到首页，在 <App /> 中进行路由重定向
          navigate('/');
        })
        .catch(() => {
          // 用户信息获取失败时，必须手动完成登录。
          const userName = getCookie('USER_NAME_RECORD');
          userName && setState({ userName });
        })
        .finally(() => setState({ spinning: false }));
    } else {
      setState({ spinning: false });
      const userName = getCookie('USER_NAME_RECORD');
      userName && setState({ userName });
    }
  }, []);

  const changeUserName = useCallback((event: any) => {
    setState({ userName: event.target.value });
  }, []);

  const changePassword = useCallback((event: any) => {
    setState({ password: event.target.value });
  }, []);

  const changeMemorizeUser = useCallback((event: any) => {
    setState({ memorizeUser: event.target.checked });
  }, []);

  const validator = useCallback((values: object, rules: Rules) => {
    const ruleKeys = Object.keys(rules);
    for (let i = 0; i < ruleKeys.length; i++) {
      const key = ruleKeys[i] as keyof typeof values;
      const rule = rules[key];
      const value = values[key];
      for (let j = 0; j < rule.length; j++) {
        const { message: msg, pattern, validator } = rule[j];
        if (typeof validator === 'function') {
          const result = validator(value);
          if (result === true) {
            continue;
          } else {
            message.warning(result);
            return false;
          }
        } else if (pattern) {
          if (pattern.test(value)) {
            continue;
          } else {
            message.warning(msg);
            return false;
          }
        }
      }
    }
    return true;
  }, []);

  const handleNavigateBack = useCallback(() => {
    // 先查看 location.search 上是否有重定向的需要。
    const matched = /\??redirection=([^&#]+)/.exec(location.search);
    if (matched) {
      // 需要先解码，然后在进行重定向（回到原先的那个页面）。
      navigate(`${decodeURIComponent(matched[1])}`);
    } else {
      // 回到首页，在 <App /> 中进行路由重定向
      navigate('/');
    }
  }, [location, navigate]);

  // 用户登录
  const handleLogin = useCallback(() => {
    if (validator({ password, userName }, rules1)) {
      setState({ loading: true });
      const params = { username: userName, password: encrypto(password) };

      signIn(params)
        .then(async (response: any) => {
          message.success('登录成功');
          const { token } = response?.data ?? {};
          // 存储 Token 到本地缓存
          setUserToken(token);
          // 有效期 31 天
          memorizeUser && setCookie('USER_NAME_RECORD', userName, 2678400);

          try {
            // 获取用户信息
            const res = await queryUserInfo();
            updateBasicContext({ userInfo: res.data });

            handleNavigateBack();
          } catch (error) {
            message.warning('用户信息获取失败~');
            console.log(error);
          }
        })
        .finally(() => setState({ loading: false }));
    }
  }, [password, userName, memorizeUser, handleNavigateBack]);

  useEffect(() => {
    const handle = (event: any) => {
      if (event.code === 'Enter') {
        event.stopPropagation();
        event.preventDefault();
        handleLogin();
      }
    };

    // 监听全局的 keyup 事件，当用户按下 Enter 按钮时将进行提交操作。
    window.addEventListener('keyup', handle);
    return () => {
      window.removeEventListener('keyup', handle);
    };
  }, [handleLogin]);

  const rules1: Rules = useMemo(
    () => ({
      userName: [{ message: '用户名不能为空', pattern: /^\w+$/ }],
      password: [
        {
          message: '密码必须包含字母、数字、特殊字符（~！%@#$），密码长度为8-16位',
          pattern: /^(?=.*\d+)(?=.*[~!@#$%]+)(?=.*[A-Za-z]+)[0-9a-zA-Z~!@#$%]{8,16}$/,
        },
      ],
    }),
    [],
  );

  if (spinning) {
    return (
      <Spin delay={500} spinning={spinning} size="large">
        <div style={{ height: '100vh' }} />
      </Spin>
    );
  }

  return (
    <section className={classes.login_page}>
      <div className={classes.container}>
        <div className={classes.illustration} />
        <div className={classes.content}>
          <h1 className={classes.title}>{import.meta.env.VITE_TITLE}</h1>
          <p className={classes.subtitle}>{import.meta.env.VITE_SUBTITLE}</p>
          <Input
            type="text"
            value={userName}
            rules={rules1.userName}
            placeholder="请输入用户名"
            onChange={changeUserName}
            prefixIcon={<UserOutlined />}
          />
          <Input
            type="password"
            value={password}
            rules={rules1.password}
            onChange={changePassword}
            placeholder="请输入登陆密码"
            prefixIcon={<LockOutlined />}
          />

          <div className={classes.form_item} style={{ border: 'none', marginTop: 30 }}>
            <ConfigProvider theme={{ token: { colorPrimary: '#1A72FE' } }}>
              <Checkbox
                checked={memorizeUser}
                style={{ marginLeft: 6 }}
                onChange={changeMemorizeUser}
                className={classes.input_prefix_icon}
              />
            </ConfigProvider>
            <p className={classes.memorize_user_name}>记住用户名</p>
          </div>

          <ConfigProvider theme={{ token: { colorPrimary: '#1A72FE' } }}>
            <Button
              htmlType="submit"
              type="primary"
              className={classes.submit_button}
              onClick={handleLogin}
              loading={loading}
            >
              登录
            </Button>
          </ConfigProvider>
        </div>
      </div>
      <div className={classes.login_footer}>安徽阡陌网络科技有限公司 ©2022 Created by Qianmo</div>
    </section>
  );
}

export default memo(Login);
