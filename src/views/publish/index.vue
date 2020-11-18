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
      <el-form ref="form" :model="article" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="活动形式">
          <el-input type="textarea" v-model="article.content"></el-input>
        </el-form-item>
        <el-form-item label="特殊资源">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道">
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

export default {
  name: 'PublishIndex',
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
      const articleId = this.$route.query.id
      console.log(articleId)
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
