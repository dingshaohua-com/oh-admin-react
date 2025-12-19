import axios, { AxiosRequestConfig, AxiosError } from "axios";

// 统一响应格式
interface ApiResponse<T> {
  code: number;
  data: T;
  msg: string;
}

// 创建 axios 实例并配置 baseURL
const axiosInstance = axios.create({
  baseURL: '/api',
});

export const customAxiosInstance = <T>(
    config: AxiosRequestConfig,
    options?: AxiosRequestConfig,
  ): Promise<T> => {
    const promise = axiosInstance({
      ...config,
      ...options,
    })
      .then((response) => {
        const apiResponse = response.data as ApiResponse<T>;
        // 如果 code 不是 0，抛出错误
        if (apiResponse.code !== 0) {
          throw new Error(apiResponse.msg || '请求失败');
        }
        // 返回 data 字段
        return apiResponse.data;
      })
      .catch((error: AxiosError<ApiResponse<T>>) => {
        // 处理错误响应
        if (error.response?.data) {
          const apiResponse = error.response.data;
          throw new Error(apiResponse.msg || error.message || '请求失败');
        }
        throw error;
      });
    return promise;
  };