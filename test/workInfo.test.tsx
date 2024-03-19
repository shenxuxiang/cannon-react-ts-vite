import React from 'react';
import NotFound from '../src/pages/404';
import { it, expect, vi } from "vitest";
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('Test Pages Of The 404 ', async () => {
  const user = userEvent.setup();
  const navigate = vi.fn();

  const { container } = render(<NotFound navigate={navigate}/>);

  const button = container.querySelector('.ant-btn.ant-btn-primary')!;

  await user.click(button);

  expect(container).toHaveTextContent('UH OH！页面丢失');
  expect(container).toHaveTextContent('您所访问的页面不存在，您可以点击下方的按钮，返回主页');
  expect(navigate).toHaveBeenCalled();
});
