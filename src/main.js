import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css'
import * as kit from './common/commonKit.js'
import * as permission from './common/permission.js'

Vue.config.productionTip = false
Vue.use(iView)
// 常用工具箱
Vue.prototype.$kit = kit
// 权限定义
Vue.prototype.$res = permission.permission

// 自定义的权限指令
Vue.directive('has', {
  bind: function (el, binding) {
    let res = kit.getResources(binding.value)
    if (res === undefined) {
      el.remove()
    }
  }
})
// 路由变化前处理,用于拦截没有登录就直接进入到了静态页面.
router.beforeEach((to, from, next) => {
  if (to.path !== '/login') {
    if (kit.getSession(kit.headerName)) {
      return next()
    } else {
      //如果没有获取到session登录凭证就直接跳转到登录页面
      return next('/login')
    }
  } else {
    return next()
  }
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
