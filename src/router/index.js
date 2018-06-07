import Vue from 'vue';
import Router from 'vue-router';

// 导入组件
import Login from '@/views/login';
import Home from '@/components/home/home';
// import Users from '@/views/users/users'
import UserList from '@/components/userlist/userList';
import Rights from '@/components/roles/rights';
import Roles from '@/components/roles/roles';
import Categories from '@/components/goods/categories';

import {Message} from 'element-ui'
Vue.use(Router);

const router = new Router({
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
        name: 'userlist',
        path: '/users',
        component: UserList
        },
        {
          name: 'rights',
          path: '/rights',
          component: Rights
        },
        {
          name: 'roles',
          path: 'roles',
          component: Roles
        },
        {
          name: 'categories',
          path: 'categories',
          component: Categories
        }
      ]
    }
  ]
});

// 在跳转前设定全局路由
router.beforeEach((to,from,next)=>{
  //判断，若登录不需要token
  if(to.name === 'login'){
    next();
  }else{
    const token = sessionStorage.getItem('token');
    if (token) {
      next();
    } else {
      // 提示
      Message.warning('请先登录');
      // 跳转到登录
      router.push({
        name: 'login'
      });
    }
  }
});

export default router;