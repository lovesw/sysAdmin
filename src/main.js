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

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
