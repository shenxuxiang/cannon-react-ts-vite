import React, { memo, useCallback, useEffect, useMemo, useRef } from 'react';
import { Button, message, ConfigProvider } from 'antd';
import type { Rule } from '@/components/LoginInput';
import { LockOutlined } from '@ant-design/icons';
import { updatePassword } from '@/api/login';
import Input from '@/components/LoginInput';
import useReducer from '@/utils/useReducer';
import classes from './index.module.less';
import encrypto from '@/utils/encrypto';

type Rules = { [propName: string]: Array<Rule> };

function initialState() {
  return {
    userName: '',
    password: '',
    loading: false,
    newPassword: '',
    confirmPassword: '',
    memorizeUser: false,
    isUpdatePassword: false,
  };
}

function Login(props: any) {
  const [state, setState] = useReducer(initialState);
  const { loading, password, newPassword, confirmPassword } = state;
  const { navigate } = props;
  const newPasswordRef = useRef<any>();
  const confirmPasswordRef = useRef<any>();

  const changePassword = useCallback((event: any) => {
    setState({ password: event.target.value });
  }, []);

  const changeNewPassword = useCallback(
    (event: any) => {
      const value = event.target.value;
      setState({ newPassword: value });
      if (confirmPassword && confirmPassword === value) {
        confirmPasswordRef.current.validator();
      }
    },
    [confirmPassword],
  );

  const changeConfirmPassword = useCallback((event: any) => {
    setState({ confirmPassword: event.target.value });
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

  // 用户修改密码
  const handleUpdatePassword = useCallback(() => {
    if (validator({ password, newPassword, confirmPassword }, rules2)) {
      setState({ loading: true });
      const params = {
        oldPassword: encrypto(password),
        newPassword: encrypto(newPassword),
        confirmPassword: encrypto(confirmPassword),
      };
      updatePassword(params)
        .then(() => {
          message.success('密码修改成功！');
          navigate('/login');
        })
        .finally(() => setState({ loading: false }));
    }
  }, [password, newPassword, confirmPassword, navigate]);

  useEffect(() => {
    const handle = (event: any) => {
      if (event.code === 'Enter') {
        event.stopPropagation();
        event.preventDefault();
        handleUpdatePassword();
      }
    };

    // 监听全局的 keyup 事件，当用户按下 Enter 按钮时将进行提交操作。
    window.addEventListener('keyup', handle);
    return () => {
      window.removeEventListener('keyup', handle);
    };
  }, [handleUpdatePassword]);

  const rules2: Rules = useMemo(
    () => ({
      password: [
        {
          message: '密码必须包含字母、数字、特殊字符（~！%@#$），密码长度为8-16位',
          pattern: /^(?=.*\d+)(?=.*[~!@#$%]+)(?=.*[A-Za-z]+)[0-9a-zA-Z~!@#$%]{8,16}$/,
        },
      ],
      newPassword: [
        {
          message: '密码必须包含字母、数字、特殊字符（~！%@#$），密码长度为8-16位',
          pattern: /^(?=.*\d+)(?=.*[~!@#$%]+)(?=.*[A-Za-z]+)[0-9a-zA-Z~!@#$%]{8,16}$/,
        },
      ],
      confirmPassword: [
        {
          validator: (input: string) => {
            if (newPasswordRef.current.input.value !== input) {
              return '两次输入的密码不一致';
            } else {
              return true;
            }
          },
        },
      ],
    }),
    [],
  );

  return (
    <section className={classes.login_page}>
      <div className={classes.container}>
        <div className={classes.illustration} />
        <div className={classes.content}>
          <h1 className={classes.title}>农机作业监管平台</h1>
          <p className={classes.subtitle}>让农机监管更方便的智能化平台</p>
          <Input
            type="password"
            value={password}
            rules={rules2.password}
            placeholder="请输入旧密码"
            onChange={changePassword}
            prefixIcon={<LockOutlined />}
          />
          <Input
            type="password"
            value={newPassword}
            ref={newPasswordRef}
            placeholder="请输入新密码"
            rules={rules2.newPassword}
            onChange={changeNewPassword}
            prefixIcon={<LockOutlined />}
          />
          <Input
            type="password"
            value={confirmPassword}
            ref={confirmPasswordRef}
            placeholder="请再次确认密码"
            prefixIcon={<LockOutlined />}
            rules={rules2.confirmPassword}
            onChange={changeConfirmPassword}
          />
          <ConfigProvider theme={{ token: { colorPrimary: '#1A72FE' } }}>
            <Button
              type="primary"
              className={classes.submit_button}
              onClick={handleUpdatePassword}
              loading={loading}
              style={{ marginTop: 40 }}
            >
              确认修改
            </Button>
          </ConfigProvider>
        </div>
      </div>
      <div className={classes.login_footer}>安徽阡陌网络科技有限公司 ©2022 Created by Qianmo</div>
    </section>
  );
}

export default memo(Login);
