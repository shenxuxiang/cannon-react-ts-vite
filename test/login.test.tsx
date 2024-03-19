import React from 'react';
import Login from '../src/pages/login';
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import userEvent from '@testing-library/user-event';
import { it, expect, beforeAll, afterAll, vi } from "vitest";
import { render, screen, waitFor } from '@testing-library/react';

const server = setupServer(
  // 用户登录接口
  http.post('/v1.0/login/admin', () => {
    return HttpResponse.json({
      code: 0,
      data: {},
      message: '',
    });
  }),
);

beforeAll(() => server.listen());

afterAll(() => server.close());

it('Test Pages Of The Login', async () => {
  const user = userEvent.setup();
  const location = { search: '', pathname: '/login' };
  const navigate = vi.fn();

  const { container } = render(<Login location={location} navigate={navigate}/>);

  // 模拟用户输入用户名
  const input = screen.getByPlaceholderText('请输入用户名');
  await user.click(input);
  await user.keyboard('shenxuxiang');
  expect(input).toHaveValue('shenxuxiang');

  // 模拟用户输入密码
  const passwd = screen.getByPlaceholderText('请输入登陆密码');
  await user.click(passwd);
  await user.keyboard('sxx123456!');
  expect(input).toHaveValue('shenxuxiang');

  // 模拟用户登录操作
  const button = container.querySelector('.ant-btn.ant-btn-primary');
  await user.click(button!);

  // 判断用户使用登录成功
  waitFor(() => expect(navigate).toHaveBeenCalled());
  expect('success').toBe('success');
});




