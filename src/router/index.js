import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// 配置接口地址
const baseUrl = process.env.API_ROOT;

export default new Router({
  routes: [
    {
      path: '/',
      name: 'QcList',
      component: () => import('@/components/QualityInspection/QcList.vue')
    },
    {
      path: '/QcDetail',
      name: 'QcDetail',
      component: () => import('@/components/QualityInspection/QcDetail.vue')
    },
    {
      path: '/AddQcOrder',
      name: 'AddQcOrder',
      component: () => import('@/components/QualityInspection/AddQcOrder.vue')
    },
    {
      path: '/AddQcOk',
      name: 'AddQcOk',
      component: () => import('@/components/QualityInspection/AddQcOk.vue')
    },
    {
      path: '/AddQcError',
      name: 'AddQcError',
      component: () => import('@/components/QualityInspection/AddQcError.vue')
    }
  ],
  dev: {
    // Paths
    targetUrl: baseUrl,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: baseUrl, // 设置你调用的接口域名和端口号 别忘了加http
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' // 这里理解成用‘/api’代替target里面的地址，后面组件中我们掉接口时直接用api代替 比如我 要调用'http://xxx.xxx.xxx.xxx:8081/user/add'，直接写‘/api/user/add’即可
        }
      }
    }
  }
});
