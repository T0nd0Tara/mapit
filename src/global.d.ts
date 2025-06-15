import { AxiosRequestConfig, AxiosResponse } from "axios";

declare global {
  interface Window {
    electronAPI: {
      proxyRequest: <T = any, R = AxiosResponse<T, any>, D = any>(config: AxiosRequestConfig<D>) => Promise<R>;
    }
  }
}
