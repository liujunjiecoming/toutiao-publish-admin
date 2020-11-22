import Vue from 'vue'
import VueRouter from 'vue-router'
// @ 就是src路径，记得加斜杠
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import Article from '@/views/article'
import Publish from '@/views/publish'
import Image from '@/views/image'
import Comment from '@/views/comment'

Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 如果没有默认子路由，就不要给父路由起名
    // name: 'layout',
    component: Layout,
    children: [
      {
        path: '', // path为空，会作为默认子路由渲染
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      },
      {
        path: '/publish',
        name: 'publish',
        component: Publish
      },
      {
        path: '/image',
        name: 'image',
        component: Image
      },
      {
        path: '/comment',
        name: 'comment',
        component: Comment
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})

// 路由导航守卫: 所有页面的导航都会经过这里
// to: 要去的路由页面信息
// from: 来自哪里的路由信息
// nex: 放行的方法
router.beforeEach((to, from, next) => {
  // next()

  const user = JSON.parse(window.localStorage.getItem('user'))

  // 校验非登录页面的登录状态
  if (to.path !== '/login') {
    if (user) {
      // 已登录，允许通过
      next()
    } else {
      // 没有登录，跳到登录页面
      next('/login')
    }
  } else {
    // 登录页面，正常允许通过
    next()
  }
})

export default router
