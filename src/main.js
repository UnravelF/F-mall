import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import Fastclick from 'fastclick'
import VueLazyLoad from 'vue-lazyload'


// 导入自己封装的对象以插件形式使用
import toast from 'components/common/toast'

Vue.config.productionTip = false

// 安装Toast插件
Vue.use(toast)

// 使用懒加载插件
Vue.use(VueLazyLoad)

// 解决移动端300s延迟
 Fastclick.attach(document.body)

// 为事件总线$bus赋值为Vue实例 $bus默认underfined
Vue.prototype.$bus = new Vue()

new Vue({
  render: h => h(App),
  router,
  store
}).$mount('#app')
