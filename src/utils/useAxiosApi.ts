import { useAxios } from '@vueuse/integrations/useAxios';
import axios from 'axios';
import { showToast } from 'vant';
import 'vant/es/toast/style';
import { useCookies } from '@vueuse/integrations/useCookies';
import * as process from "process";

const instance = axios.create({
  withCredentials: false,
  timeout: 5000,
  baseURL: process.env.NODE_ENV === "production" ? 'https://rpt.quchaq.com/' : '/QCApi',
});

const { VITE_TOKEN_KEY } = import.meta.env;

// request interceptor
instance.interceptors.request.use(
  (config: any) => {
    const token = useCookies().get(VITE_TOKEN_KEY as string);
    if (token) {
      config.headers = {
        ...config.headers,
        'X-TOKEN': `${token}`,
      };
    }
    return config;
  },
  (error) => {
    // do something with request error
    console.log(error); // for debug
    return Promise.reject(error);
  },
);

// response interceptor
instance.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
   */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  (response) => {
    const {
      data: res,
      config: { url = '' },
    } = response;
    const code = url.includes('common') ? 0 : '0000';
    // 下载类型的请求, 返回值为ArrayBuffer类型,做特殊处理, 请求时需要设置 responseType: 'arraybuffer',
    const isArrayBuffer = res instanceof ArrayBuffer;
    if (isArrayBuffer) {
      // 返回文件流
      return Promise.resolve(
        new Blob([res], {
          type: 'application/pdf',
        }),
      );
    }

    if (res.code !== code) {
      showToast(res.msg);
      // 412: Token expired;
      if (res.code === 412) {
        // store.dispatch('user/userLogout');
      }
      return Promise.reject(res || 'Error');
    } else {
      return Promise.resolve(res);
    }
  },
  (error) => {
    console.log('err' + error);
    showToast(error.message);
    return Promise.reject(error.message);
  },
);

/**
 * reactive useFetchApi
 */

export default function useAxiosApi(url: string, config: any) {
  return useAxios(url, config, instance);
}
