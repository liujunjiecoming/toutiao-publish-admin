<template>
  <div class="login-container">
    <div class="login-head">
      <div class="logo"></div>
    </div>
    <!--
      配置 Form 表单验证
      1，必须给 el-form 组件绑定 model为表单数据对象
      2，给需要验证的表单项 el-form-item 绑定 prop 属性
         注意：prop属性需要制定表单对象中的数据名称
      3，通过 el-form 组件的 rules 属性配置验证规则
    -->
    <el-form class="login-form" ref="login-form" :model="user" label-width="80px" :rules="formRules">
      <el-form-item prop="mobile">
        <el-input v-model="user.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <el-form-item prop="code">
        <el-input v-model="user.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item prop="agree">
         <el-checkbox v-model="user.agree"></el-checkbox>
         我已阅读并同意用户协议和隐私条款
      </el-form-item>
      <el-form-item>
        <el-button class="login-btn" type="primary" :loading="loginLoading" @click="onLogin">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '13911111111',
        code: '246810',
        agree: false
      },
      // checked: false, // 是否同意协议的选中状态
      loginLoading: false, // 登陆的 loading 状态
      formRules: {
        mobile: [
          // trigger 默认是 change，    另外还有一个blur
          { required: true, message: '手机号不能为空', trigger: 'change' },
          { pattern: /^1[3|5|7|8|9]\d{9}$/, message: '请输入正确的号码格式', trigger: 'change' }
        ],
        code: [
          { required: true, message: '验证码不能为空', trigger: 'change' },
          { pattern: /^\d{6}$/, message: '请输入正确的验证码格式' }
        ],
        agree: [
          {
            // 自定义校验规则
            validator: (rule, value, callback) => {
              if (value) {
                // 验证通过
                callback()
              } else {
                // 验证失败
                callback(new Error('请同意用户协议'))
              }
            },
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    onLogin () {
      // 获取表单数据
      // const user = this.user
      // 表单验证
      this.$refs['login-form'].validate((valid, err) => {
        // 如果表单验证错误，停止请求提交
        if (!valid) {
          return
        }
        // 验证通过，请求登录
        this.login()
      })

      // 关闭 loading
      this.loginLoading = false

      // this.$router.push('/')

      this.$router.push({
        name: 'home'
      })
    },
    login () {
      // 验证通过
      // 开启登录中
      this.loginLoading = true
      login(this.user).then(res => {
        console.log(res)
        this.$message({
          message: '登录成功',
          type: 'success'
        })

        // 关闭 loading
        this.loginLoading = false

        // 接口返回的用户相关数据放到本地存储，方便应用数据共享
        // 本地存储智能存字符串，其他转为JSON格式字符串
        window.localStorage.setItem('user', JSON.stringify(res.data.data))

        // 跳转到首页
        // this.$router.push('/')

        this.$router.push({
          name: 'home'
        })
      }).catch(err => {
        console.log('登录失败', err)
        this.$message({
          message: '登录失败，账号或密码错误',
          type: 'error'
        })
      })
    }
  }
}

</script>

<style scoped lang="less">
.login-container {
  position: fixed;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: url("./login_bg.jpg") no-repeat;
  background-size: cover;
  .login-head {
    width: 300px;
    height: 57px;
    background: url("./logo_index.png") no-repeat;
    margin-bottom: 30px;
  }
  .login-form {
    background-color: #fff;
    padding: 50px;
    min-width: 300px;
    .login-btn {
      width: 100%;
    }
  }
}
</style>
