import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/navigation.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: '登录',
      component: (resolve) => require(['./views/login.vue'], resolve)
    },
    {
      path: '/',
      name: '重定向',
      redirect: '/login'
    },
    // 后台默认首页
    {
      path: '/',
      component: Main,
      children: [
        {path: 'index', name: '后台管理首页', component: (resolve) => require(['./views/index'], resolve)}
      ]
    },
    // 文章管理

    {
      path: '/sys',
      component: Main,
      children: [
        {
          path: 'menuList',
          name: '菜单列表',
          component: (resolve) => require(['./views/sys/menuList'], resolve)
        },
        {
          path: 'addMenu',
          name: '添加菜单',
          component: (resolve) => require(['./views/sys/addMenu'], resolve)
        }, {
          path: 'serviceList',
          name: '服务管理',
          component: (resolve) => require(['./views/sys/serviceList'], resolve)
        }, {
          path: 'addService',
          name: '添加服务',
          component: (resolve) => require(['./views/sys/addService'], resolve)
        }, {
          path: 'permissionList',
          name: '权限列表',
          component: (resolve) => require(['./views/sys/permissionList'], resolve)
        }, {
          path: 'addPermission',
          name: '添加权限',
          component: (resolve) => require(['./views/sys/addPermission'], resolve)
        }
      ]
    }

  ]
})
