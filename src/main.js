// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue';
import App from './App';
import router from './router';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import quillEditor from 'vue-quill-editor';
// 一定要引入这三个css，不然文本编辑器会出现不规则黑白几何图形
// 这三个css可以在main.js中引入，也可以在具体使用的.vue文件中引入
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
// Mint-ui引入
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
// 引入状态管理
import Vuex from 'vuex';

Vue.use(MintUI);
Vue.use(ElementUI);
Vue.use(quillEditor);
Vue.use(Vuex);

const ADD_COUNT = 'ADD_COUNT'; // 用常量代替事件类型，使得代码更清晰
const REMOVE_COUNT = 'REMOVE_COUNT';

// 注册状态管理全局参数
var store = new Vuex.Store({
  state: {
  token: '',
  userID: ''
  },
  mutations: {
  // 写法与getters相类似
  // 组件想要对于vuex 中的数据进行的处理
  // 组件中采用this.$store.commit('方法名') 的方式调用，实现充分解耦
  // 内部操作必须在此刻完成(同步)
  [ADD_COUNT] (state, token) { // 第一个参数为 state 用于变更状态 登录
   sessionStorage.setItem('token', token);
   state.token = token;
  },
  [REMOVE_COUNT] (state, token) { // 退出登录
   sessionStorage.removeItem('token', token);
   state.token = token;
  }
  }
 });

 router.beforeEach((to, from, next) => {
  store.state.token = sessionStorage.getItem('token');// 获取本地存储的token
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
  if (store.state.token !== '') { // 通过vuex state获取当前的token是否存
   next();
  } else {
   next({
   path: '/',
   query: {redirect: to.fullPath} // 将跳转的路由path作为参数，登录成功后跳转到该路由
   });
  }
  } else {
  next();
  }
 });

Vue.config.productionTip = false;
// 引入mockjs
// require('./mock.js')

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store, // 注册组件
  components: { App },
  template: '<App/>'
});

Vue.filter('getYMD', function (input) {
  return input.split(' ')[0];
});
