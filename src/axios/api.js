import axios from 'axios';
import Vue from 'vue';
import router from '../router';
import { MessageBox } from 'mint-ui';

axios.defaults.baseURL = router.options.dev.targetUrl; // 配置你的接口请求地址
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN //配置token,看情况使用
axios.defaults.headers.post['Content-Type'] =
  'text/html; charset=utf-8'; // 配置请求头信息。

Vue.prototype.$axios = axios;

// 请求拦截器
axios.interceptors.request.use(
  function (config) {
    // 每次请求前 需要验证token信息
    // let token = localStorage.getItem('token');
    // if (token) {
    //  config.url = `${config.url}&token=${token}`;
    // }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
// 响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 如果登录状态失效 自动重新验证登录接口 记录token信息
    if (response.data.status === -99) {
      // localStorage.removeItem('token');
      // 弹出提示 登录失效 返回登录页面
      MessageBox.confirm('', {
          message: '登录失效,请重新登录!',
          title: '提示',
          confirmButtonText: '确认'
         })
        .then(action => {
             if (action === 'confirm') { // 确认的回调
                 top.location.href = `${window.location.origin}/user`;
             }
         }).catch(err => {
             if (err === 'cancel') { // 取消的回调
                 top.location.href = `${window.location.origin}/user`;
             }
      });
    } else {
      return response;
    }
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 封装axios的post请求
export function fetch (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

// 封装axios的post请求
export function fetchfile (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, {
        responseType: 'blob'
      })
      .then(response => {
        resolve(response.data);
      })
      .catch(error => {
        reject(error);
      });
  });
}

export function getFiles (url) {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url,
      responseType: 'arraybuffer'
    })
      .then(data => {
        resolve(data.data);
      })
      .catch(error => {
        reject(error.toString());
      });
  });
}

export default {
  JH_news (url, params) {
    return fetch(url, params);
  },
  Hosturl () {
    return axios.defaults.baseURL + '/';
  },
  getFile (url) {
    return getFiles(url);
  },
  JH_File (url, params) {
    return fetchfile(url, params);
  }
};
