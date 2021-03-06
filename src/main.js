// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Myaxios from '@/plugins/myaxios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import moment from 'moment'
import MyBreadcrumb from '@/components/mybreadcrumb'
// 全局样式
import '@/assets/css/index.css';
// 全局组件
Vue.component(MyBreadcrumb.name, MyBreadcrumb);

Vue.filter('fmtDate',(value,fmtStr)=>{
  return moment(value).format(fmtStr);
})
Vue.config.productionTip = false
Vue.use(Myaxios)
Vue.use(ElementUI)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
