import { createPath } from 'react-router-dom';
import { getLocalStorage } from '@/utils';
import history from '@/utils/history';
import { message } from 'antd';
import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, AxiosInstance, AxiosError } from 'axios';

let abortController = new AbortController();

function abortRequest() {
  if (abortController) {
    abortController.abort();
    abortController = new AbortController();
  } else {
    abortController = new AbortController();
  }
}

const statusCode = {
  200: '200 OK',
  400: '400 Bad Request',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found',
  405: '405 Method Not Allowed',
  408: '408 Request Timeout',
  500: '500 Internal Server Error',
  501: '501 Not Implemented',
  502: '502 Bad Gateway',
  503: '503 Service Unavailable',
  504: '504 Gateway Timeout',
  505: '505 HTTP Version Not Supported',
  510: '510 Not Extended',
  511: '511 Network Authentication Required',
};

enum ResponseCode {
  successCode = 0,
  overdueCode = 401,
}

type RequestParams = {
  [key: string]: any;
};

type ResponseData = {
  data?: any;
  code?: number;
  message?: string;
};

const defaultRequestConfig: AxiosRequestConfig = {
  baseURL: '',
  timeout: 60000,
  withCredentials: true,
};

class Request<AxiosRequestConfig> {
  public instance: AxiosInstance;

  constructor(config?: AxiosRequestConfig) {
    this.instance = axios.create({ ...defaultRequestConfig, ...config });

    this.instance.interceptors.request.use(this.onFulfilledRequest, this.onRejectedRequest);
    this.instance.interceptors.response.use(this.onFulfilledResponse, this.onRejectedResponse);
  }

  onFulfilledRequest = (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    return {
      ...config,
      signal: abortController.signal,
      headers: {
        Authorization: getLocalStorage('TOKEN') || 'Bearer Token',
      } as any,
    };
  };

  onRejectedRequest = (error: any) => {
    return Promise.reject(error);
  };

  onFulfilledResponse = (response: AxiosResponse): Promise<AxiosResponse> => {
    const {
      data,
      headers,
      request: { responseType },
    } = response;

    // 下载文件，blob 直接用于文件的下载
    if (responseType === 'blob') {
      let fileName = headers['content-disposition'] ?? '';

      const matched = /^attachment;\s*filename\*?=(?:utf-8'')?([^,]+)/.exec(fileName);
      if (matched === null) {
        fileName = 'defaultName';
      } else {
        fileName = decodeURIComponent(matched[1]);
      }

      return Promise.resolve({ ...data, fileName: fileName });
    }

    if (data.code === ResponseCode.overdueCode) {
      message.error('登录已过期，请重新登录');
      window.localStorage.clear();
      abortRequest();
      this.redirectionToLogin();
      return Promise.reject(data);
    }

    if (typeof data.code !== 'undefined' && data.code !== ResponseCode.successCode) {
      data.message && message.error(data.message);
      return Promise.reject(data);
    }

    return Promise.resolve(data);
  };

  onRejectedResponse = (error: AxiosError) => {
    if (error.response) {
      this.checkStatus(error.response.status);
    } else if (!window.navigator.onLine) {
      message.error('网络连接失败');
    } else if (error.code === 'ERR_CANCELED') {
      // 请求被取消
      console.log(error.stack);
    } else {
      message.error('请求失败，请联系管理员');
    }
    return Promise.reject(null);
  };

  // 校验状态码
  checkStatus(status: number): void {
    switch (status) {
      case 401:
      case 403:
        abortRequest();
        message.error('用户请登录');
        window.localStorage.clear();
        this.redirectionToLogin();
        break;
      default:
        message.error(statusCode[status as keyof typeof statusCode]);
        break;
    }
  }

  // 重定向到登录页
  redirectionToLogin() {
    const { location, push } = history;
    if (location.pathname.startsWith('/login')) return;
    const querystring = window.encodeURIComponent(createPath(location));
    push('/login?redirection=' + querystring);
  }

  get(url: string, params?: RequestParams): Promise<ResponseData> {
    return this.instance.get(url, { params });
  }

  getBlob(url: string, params?: RequestParams): Promise<ResponseData> {
    return this.instance.get(url, { params, responseType: 'blob' });
  }

  delete(url: string, params?: RequestParams): Promise<ResponseData> {
    return this.instance.delete(url, { data: params });
  }

  post(url: string, params?: RequestParams, config?: AxiosRequestConfig): Promise<ResponseData> {
    return this.instance.post(url, params, config!);
  }

  put(url: string, params?: RequestParams, config?: AxiosRequestConfig): Promise<ResponseData> {
    return this.instance.put(url, params, config!);
  }
}

export default new Request();
