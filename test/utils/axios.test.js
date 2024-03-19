import { setupServer } from 'msw/node';
import { HttpResponse, http } from 'msw';
import _axios from '../../src/utils/axios';
import { it, describe, vi, beforeAll, afterAll, expect } from 'vitest';

// 重新构造 axios 实例对象，避免影响到全局
const axios = new (Object.getPrototypeOf(_axios).constructor)();

// 将内容转换成 arrayBuffer
const toArayBuffer = (text) => {
  return new Promise((resolve) => {
    const blob = new Blob([text], { type: 'text/plain' });

    const read = new FileReader();
    read.onload = function() {
      resolve(this.result);
    };

    read.readAsArrayBuffer(blob);
  });
}

const server = setupServer(
  http.get('/test/status/401', () => {
    return HttpResponse.json({}, { status: 401 });
  }),
  http.post('/test/code/401', () => {
    return HttpResponse.json({
      code: 401,
      data: null,
      message: '',
    });
  }),
  http.post('/test/code/0', () => {
    return HttpResponse.json({
      code: 0,
      data: true,
      message: 'ok',
    });
  }),
  http.get('/test/blob', async () => {
    return HttpResponse.arrayBuffer(
      await toArayBuffer('hello world'),
      {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment; filename=default_file'
        }
      }
    );
  }),
);

// 启动 server
beforeAll(() => server.listen());
// 关闭 server
afterAll(() => server.close());

describe('Test Axios', () => {
  it('Test Http Response Status 401, Get Method', async () => {
    const checkStatusMockFn = vi.fn(axios.checkStatus);
    axios.checkStatus = checkStatusMockFn;
    try {
      await axios.get('/test/status/401');
    } catch (error) {
      expect(error).toBeNull();
    }

    expect(checkStatusMockFn).toHaveBeenCalled();
    expect(checkStatusMockFn.mock.calls[0][0]).toBe(401);
    checkStatusMockFn.mockReset();
  });

  it('Test Http Response Data Code Equal 401, Post Method', async () => {
    const errorCallbackMockFn = vi.fn();
    const redirectionToLoginMockFn = vi.fn(axios.redirectionToLogin);
    axios.redirectionToLogin = redirectionToLoginMockFn;
    try {
      await axios.post('/test/code/401');
    } catch (error) {
      errorCallbackMockFn(error);
    }

    expect(errorCallbackMockFn).toHaveBeenCalled();
    expect(errorCallbackMockFn.mock.calls[0][0]).toEqual({ code: 401, data: null, message: '' });
    expect(redirectionToLoginMockFn).toHaveBeenCalled();
    errorCallbackMockFn.mockReset();
    redirectionToLoginMockFn.mockReset();
  });

  it('Test Http Response Data Code Equal 0, Post Method', async () => {
    const errorCallbackMockFn = vi.fn();
    const checkStatusMockFn = vi.fn(axios.checkStatus);
    const redirectionToLoginMockFn = vi.fn(axios.redirectionToLogin);
    axios.checkStatus = checkStatusMockFn;
    axios.redirectionToLogin = redirectionToLoginMockFn;

    let responseData = null;
    try {
      responseData = await axios.post('/test/code/0');
    } catch (error) {
      errorCallbackMockFn(error);
    }

    expect(checkStatusMockFn).not.toHaveBeenCalled();
    expect(errorCallbackMockFn).not.toHaveBeenCalled();
    expect(redirectionToLoginMockFn).not.toHaveBeenCalled();

    checkStatusMockFn.mockReset();
    errorCallbackMockFn.mockReset();
    redirectionToLoginMockFn.mockReset();

    expect(responseData).toEqual({ code: 0, data: true, message: 'ok' });
  });


  it('Test Http Response Data Blob', async () => {
    const errorCallbackMockFn = vi.fn();
    const checkStatusMockFn = vi.fn(axios.checkStatus);
    const redirectionToLoginMockFn = vi.fn(axios.redirectionToLogin);
    axios.checkStatus = checkStatusMockFn;
    axios.redirectionToLogin = redirectionToLoginMockFn;

    let responseData = null;
    try {
      responseData = await axios.getBlob('/test/blob');
    } catch (error) {
      errorCallbackMockFn(error);
    }

    expect(checkStatusMockFn).not.toHaveBeenCalled();
    expect(errorCallbackMockFn).not.toHaveBeenCalled();
    expect(redirectionToLoginMockFn).not.toHaveBeenCalled();
    expect(responseData).not.toBe(null);
    expect(responseData.fileName).toBe('default_file');
  });
});
