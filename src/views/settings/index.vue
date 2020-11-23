<template>
  <div class="settings-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span="15">
          <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>
            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>
            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>
            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">
                保存
              </el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :offset="2" :span="4">
            <label for="file">
              <el-avatar
                shape="square"
                :size="200"
                fit="cover"
                :src="user.photo"
                ></el-avatar>
                <p @click="$refs.file.click()">点击修改头像</p>
            </label>
            <input id="file" type="file" hidden ref="file" @change="onFileChange">
        </el-col>
      </el-row>
    </el-card>
    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body>
      <img :src="previewImage" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserMsg } from '@/api/user'

export default {
  name: 'SettingsIndex',
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      user: {
        // email: '',
        // id: 0,
        // intro: '',
        // mobike: '',
        // name: '',
        // photo: ''
      },
      dialogVisible: false,
      previewImage: '' // 预览图片
    }
  },
  created () {
    this.loadUserMsg()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    loadUserMsg () {
      getUserMsg().then(res => {
        this.user = res.data.data
      })
    },
    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file

      const blobData = window.URL.createObjectURL(file.files[0])

      this.previewImage = blobData

      this.dialogVisible = true

      // 解决选择相同文件不触发change事件问题
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped>

</style>
