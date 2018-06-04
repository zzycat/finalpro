import Vue from 'vue';
import Router from 'vue-router';

// 导入组件
import Login from '@/views/login';
import Home from '@/components/home/home';
import Users from '@/views/users/users'

Vue.use(Router);

export default new Router({
  routes: [{
      name: 'login',
      path: '/login',
      component: Login
    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
        name: 'users',
        path: 'users',
        component: Users
        }
      ]
    }
  ]
});
