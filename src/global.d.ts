import { AxiosRequestConfig, AxiosResponse } from "axios";

interface Window {
  electronAPI: {
    proxyRequest: <T = any, R = AxiosResponse<T, any>, D = any>(config: AxiosRequestConfig<D>) => Promise<R>;
  }
}
