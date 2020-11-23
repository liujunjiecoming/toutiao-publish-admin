<template>
  <div class="comment-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-table
          :data="articles"
          style="width: 100%"
          stripe
          class="table-list"
          >
          <el-table-column
            prop="title"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="total_comment_count"
            label="总评论数">
          </el-table-column>
          <el-table-column
            prop="fans_comment_count"
            label="粉丝评论数">
          </el-table-column>
          <el-table-column
            prop="address"
            label="状态">
            <template slot-scope="scope">
              {{ scope.row.comment_status ? '正常' : '关闭' }}
            </template>
          </el-table-column>
          <el-table-column
            prop="address"
            label="操作">
            <template slot-scope="scope">
              <el-switch
                v-model="scope.row.comment_status"
                active-color="#13ce66"
                inactive-color="#ff4949"
                @change="onStatusChange(scope.row)"
                :disabled="scope.row.statusDiasbled"
                >
              </el-switch>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page.sync="page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size.sync="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount"
          background>
        </el-pagination>
      </div>
    </el-card>
  </div>
</template>

<script>
import { getArticle, updateCommentStatus } from '@/api/article'

export default {
  name: 'CommentIndex',
  data () {
    return {
      articles: [], // 评论列表
      totalCount: 0, // 总数据条数
      pageSize: 30,
      page: 1 // 当前激活的页码
    }
  },
  created () {
    this.loadComments()
  },
  methods: {
    handleSizeChange () {
      this.loadComments(1)
    },
    handleCurrentChange (page) {
      this.loadComments(page)
    },
    loadComments (page = 1) {
      // 分页页码和请求数据页码保持一致
      this.page = page
      getArticle({
        response_type: 'comment',
        page,
        per_page: this.pageSize
      }).then(res => {
        const { results } = res.data.data
        results.forEach(article => {
          article.statusDiasbled = false
        })
        this.articles = results
        this.totalCount = res.data.data.total_count
      })
    },
    onStatusChange (article) {
      // 禁用开关
      article.statusDiasbled = true

      // 请求提交修改
      updateCommentStatus(article.id.toString(), article.comment_status).then(res => {
        console.log(res)

        // 启用开关
        article.statusDiasbled = false

        this.$message({
          type: 'success',
          message: article.comment_status ? '开启文章评论状态' : '关闭文章评论状态'
        })
      })
    }
  }
}
</script>

<style scoped lang="less">
.table-list {
  margin-bottom: 30px;
}
</style>
