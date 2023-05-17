import axios from "axios";
import { message } from "antd";
import { getLocalStorage } from "@/utils";
import type {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  AxiosRequestConfig,
} from "axios";
import { useNavigate, useLocation, createPath } from "react-router-dom";
type RequestParams = { [key: string]: any };
// 请求响应参数，包含data
type ResultData<T = {}> = T;
// 接口相应成功后的 code 定义
enum ResponseCode {
  SUCCESS_CODE = 0,
  OVERDUE_CODE = 401,
}

let controller = new AbortController();
// 取消请求
export const abortRequestEffect = () => {
  controller.abort();
  controller = new AbortController();
};

const defaultConfig: AxiosRequestConfig = {
  baseURL: "",
  timeout: 200000,
  withCredentials: true,
};

class RequestHttp {
  public request: AxiosInstance;
  // public navigate: NavigateFunction;
  constructor(options?: AxiosRequestConfig) {
    const config = { ...defaultConfig, ...options };
    // 实例化 axios
    this.request = axios.create(config);

    // this.navigate = useNavigate();

    // 请求拦截器
    this.request.interceptors.request.use(
      (config: any) => {
        const token = getLocalStorage("TOKEN") || "Bearer Token";
        return {
          ...config,
          // signal 用来取消请求
          signal: controller.signal,
          // 将 JWT 通过 response header 中带给后端进行验证。
          headers: { Authorization: token },
        };
      },
      (error: AxiosError) => Promise.reject(error)
    );

    // 响应拦截器
    this.request.interceptors.response.use(
      (response: AxiosResponse) => {
        const {
          data,
          request: { responseType },
          headers,
        } = response;

        // 下载文件，blob 直接用于文件的下载
        if (responseType === "blob") {
          let fileName = headers["content-disposition"] ?? "";

          const matched = /^attachment;\s*filename\*?=(?:utf-8'')?([^,]+)/.exec(
            fileName
          );
          if (matched === null) {
            fileName = "defaultName";
          } else {
            fileName = decodeURIComponent(matched[1]);
          }

          return { data, fileName };
        }

        // 登录凭证失效/过期
        if (data.code === ResponseCode.OVERDUE_CODE) {
          message.error("登录已过期，请重新登录");
          window.localStorage.clear();
          abortRequestEffect();
          this.redirectToLogin();
          return Promise.reject(data);
        }

        // 接口异常
        if (
          typeof data.code !== "undefined" &&
          data.code !== ResponseCode.SUCCESS_CODE
        ) {
          data.message && message.error(data.message);
          return Promise.reject(data);
        }

        return data;
      },
      (error: AxiosError) => {
        const { response } = error;
        if (response) {
          this.handleCheckStatus(response.status);
        } else if (!window.navigator.onLine) {
          message.error("网络连接失败");
        }
      }
    );
  }

  // 校验状态码
  handleCheckStatus(status: number): void {
    switch (status) {
      case 401:
      case 403:
        abortRequestEffect();
        message.error("用户请登录");
        window.localStorage.clear();
        this.redirectToLogin();
        break;
      default:
        message.error("请求失败，请联系管理员");
        break;
    }
  }

  // 重定向到登录页
  redirectToLogin() {
    const navigate = useNavigate();
    const location = useLocation();
    if (location.pathname.startsWith("/login")) return;
    const href = window.encodeURIComponent(createPath(location));
    navigate(href);
  }

  get<T>(url: string, params?: RequestParams): Promise<ResultData<T>> {
    return this.request.get(url, { params });
  }

  getBlob<T>(url: string, params?: RequestParams): Promise<ResultData<T>> {
    return this.request.get(url, { params, responseType: "blob" });
  }

  delete<T>(url: string, params?: RequestParams): Promise<ResultData<T>> {
    return this.request.delete(url, { data: params });
  }

  post<T>(
    url: string,
    params?: RequestParams,
    config?: AxiosRequestConfig
  ): Promise<ResultData<T>> {
    return this.request.post(url, params, config);
  }

  put<T>(
    url: string,
    params?: RequestParams,
    config?: AxiosRequestConfig
  ): Promise<ResultData<T>> {
    return this.request.put(url, params, config);
  }
}

export default new RequestHttp();
