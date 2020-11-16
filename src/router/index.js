import Vue from 'vue'
import VueRouter from 'vue-router'
// @ 就是src路径，记得加斜杠
import Login from '@/views/login'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

export default router
