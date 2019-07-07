import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/views/navigation.vue'

Vue.use(Router)

/***
 *  首页路由配置
 * @type {*[]}
 */
let home = [
  {
    path: '/',
    name: '重定向',
    redirect: '/login'
  }, {
    path: '/login',
    name: '登录',
    component: (resolve) => require(['./views/login.vue'], resolve)
  }]
/**
 * 后台管理也面默认首页
 * @type {{path: string, component, children: {path: string, name: string, component: (function(*=): *)}[]}[]}
 */
let adminHome = [
  // 后台默认首页
  {
    path: '/',
    component: Main,
    children: [
      {path: 'index', name: '后台管理首页', component: (resolve) => require(['./views/index'], resolve)}
    ]
  }
]
/**
 *  权限管理相关路由
 * @type {{path: string, component, children: *[]}[]}
 */
let permission = [
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
      }, {
        path: 'roleList',
        name: '角色列表',
        component: (resolve) => require(['./views/sys/roleList'], resolve)
      }, {
        path: 'addRole',
        name: '添加角色',
        component: (resolve) => require(['./views/sys/addRole'], resolve)
      }, {
        path: 'userList',
        name: '用户管理',
        component: (resolve) => require(['./views/sys/userList'], resolve)
      },
      {
        path: 'cornList',
        name: '任务管理',
        component: (resolve) => require(['./views/sys/cornList'], resolve)
      },{
        path: 'addCron',
        name: '添加任务',
        component: (resolve) => require(['./views/sys/addCron'], resolve)
      }
    ]
  }
]


/**
 * 全局路由定义
 */
export default new Router({
  routes: [
    ...home,
    ...adminHome,
    ...permission
  ]
})
