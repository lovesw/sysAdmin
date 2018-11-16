import Vue from 'vue'
import App from './App.vue'
import router from './router'
import iView from 'iview';
import 'iview/dist/styles/iview.css'
import * as kit from './common/commonKit.js'

Vue.config.productionTip = false
Vue.use(iView)

Vue.prototype.$kit = kit
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
