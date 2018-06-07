import axios from 'axios';

const myaxios = {};
myaxios.install = function (Vue) {
  const instance = axios.create({
    baseURL: 'http://localhost:8888/api/private/v1/',
    timeout: 1000
    // headers: {'X-Custom-Header': 'foobar'}
  });

  // 设置axios的拦截器
  // Add a request interceptor
  instance.interceptors.request.use(function (config) {
    console.log(config);
    // Do something before request is sent
    // 请求的拦截器，发送请求之前执行
    // 排除掉登录接口，请求登录接口的时候不需要加token
    if (config.url.toLowerCase() !== 'login') {
      // 如果是其它接口，要携带token
      const token = sessionStorage.getItem('token');
      config.headers.Authorization = token;
    }

    return config;
  }, function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

  // Add a response interceptor
  instance.interceptors.response.use(function (response) {
    // Do something with response data
    return response;
  }, function (error) {
    // Do something with response error
    return Promise.reject(error);
  });
  // 设置Vue实例的属性
  Vue.prototype.$axios = instance;
};
export default myaxios;