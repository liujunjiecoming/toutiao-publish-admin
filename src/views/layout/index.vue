<template>
  <div>
    <el-container class="layout-container">
      <el-aside class="aside" width="auto">
        <app-aside class="aside-menu" :is-collapse="isCollapse"></app-aside>
      </el-aside>
      <el-container>
        <el-header class="header">
          <div>
            <i :class="{
              'el-icon-s-fold' : isCollapse,
              'el-icon-s-unfold' : !isCollapse
            }"
            @click="isCollapse = !isCollapse"></i>
            <span>中国传媒科技有限公司</span>
          </div>
          <el-dropdown>
            <div class="avatar-wrap">
              <img class="avatar" :src="user.photo" alt="">
              <span>{{user.name}}</span>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </div>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>设置</el-dropdown-item>
              <el-dropdown-item @click.native="onLogout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-header>
        <el-main class="main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
    <!-- <div>顶部导航栏</div>
    <div>侧边导航栏</div>
    <router-view/> -->
  </div>
</template>

<script>
import AppAside from './components/aside'
import { getUserProfile } from '@/api/user.js'

export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  data () {
    return {
      user: {}, // 当前用户登陆信息
      isCollapse: false // 侧边菜单栏展开状态
    }
  },
  created () {
    this.loadUserProfile()
  },
  methods: {
    loadUserProfile () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },
    onLogout () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除用户状态
        window.localStorage.removeItem('user')
        // 跳转到登录页面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}

</script>
<style scoped lang='less'>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}

.aside {
  background-color: #d3dce6;
  .aside-menu {
    height: 100%;
  }
}

.header {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ccc;
  // background-color: #b3c0d1;
}

.main {
  background-color: #e9eef3;
}

.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
}

</style>
