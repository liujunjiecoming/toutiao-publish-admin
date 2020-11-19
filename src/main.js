import Vue from 'vue'
import App from './App.vue'
import router from './router'

// 加载 element 组件库
import ElementUI from 'element-ui'
// 记载 element 组件库的样式
import 'element-ui/lib/theme-chalk/index.css'

// 加载全局样式文件
import './styles/index.less'

import { ElementTiptapPlugin } from 'element-tiptap'

Vue.config.productionTip = false

// 全局注册 element 组件库
Vue.use(ElementUI)

Vue.use(ElementTiptapPlugin)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
