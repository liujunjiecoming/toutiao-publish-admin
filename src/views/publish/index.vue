<template>
  <div class="publish-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <div slot="header" class="clearfix">
         <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章' }}</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      </div>
      <el-form ref="publlish-form" :model="article" label-width="80px" :rules="formRules">
        <el-form-item label="标题" prop="title">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="活动形式" prop="content">
          <!-- <el-input type="textarea" v-model="article.content"></el-input> -->
          <el-tiptap v-model="article.content" :extensions="extensions" height="400" placeholder="请输入文章内容"/>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道" prop="channel_id">
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
              :label="channel.name"
              :value="channel.id"
              v-for="(channel, index) in channels"
              :key="index"
              ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getArticleChannels, addArticle, queryArticle, editArticle } from '@/api/article'
import {
  ElementTiptap,
  // 需要的 extensions
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Image
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image.js'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  data () {
    return {
      channels: [],
      article: {
        title: '',
        content: '',
        cover: {
          type: 0,
          images: []
        },
        channel_id: null
      },
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Image({
          // 自定义图片上传
          uploadImage (file) {
            const fd = new FormData()
            fd.append('iamge', file)
            return uploadImage(fd).then(res => {
              console.log(res)
              return res.data.data.url
            })
          }
        })
      ],
      formRules: {
        title: [
          { required: true, message: '标题不能为空', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        content: [
          // 自定义校验
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  created () {
    this.loadChannels()

    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  methods: {
    onPublish (draft = false) {
      this.$refs['publlish-form'].validate(valid => {
        if (!valid) {
          // return
        } else {
          const articleId = this.$route.query.id
          if (articleId) {
            editArticle(articleId, this.article, draft).then(res => {
              this.$message({
                message: '修改成功',
                type: 'success'
              })
            })

            // 跳转到内容管理页面
            this.$router.push('/article')
          } else {
            addArticle(this.article, draft).then(res => {
              this.$message({
                message: '发布成功',
                type: 'success'
              })

              // 跳转到内容管理页面
              this.$router.push('/article')
            })
          }
        }
      })
    },
    loadChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    loadArticle () {
      const id = this.$route.query.id
      console.log(id)
      queryArticle(id).then(res => {
        this.article = res.data.data
      })
    }
  }
}
</script>

<style scoped lang="less">

</style>
