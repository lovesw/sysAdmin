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
      path: '/article',
      component: Main,
      children: [
        {
          path: 'list',
          name: '文章列表',
          component: (resolve) => require(['./views/article/articleList'], resolve)
        },
        {
          path: 'addArticle',
          name: '添加文章',
          component: (resolve) => require(['./views/article/addArticle'], resolve)
        }
      ]
    }

  ]
})
