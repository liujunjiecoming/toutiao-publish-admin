<template>
  <div class="artical-container">
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div>
        <el-form ref="form" :model="form" label-width="40px" size="mini">
          <el-form-item label="状态">
            <!--
              el-radio 默认把 lable 作为文本和选中之后的 Value 值
            -->
            <el-radio-group v-model="status">
              <el-radio :label="null">全部</el-radio>
              <el-radio :label="0">草稿</el-radio>
              <el-radio :label="1">待审核</el-radio>
              <el-radio :label="2">审核通过</el-radio>
              <el-radio :label="3">审核失败</el-radio>
              <el-radio :label="4">已删除</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="频道">
            <el-select v-model="channelId" placeholder="请选择频道">
              <el-option
                label="全部"
                :value="null"
              />
              <el-option
                :label="channel.name"
                :value="channel.id"
                v-for="(channel, index) in channels"
                :key="index"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="日期">
            <span class="demonstration"></span>
            <el-date-picker
              v-model="rangeDate"
              type="datetimerange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['12:00:00']"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              >
            </el-date-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" :disabled="loading" @click="loadArticle(1)">筛选</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{totalCount}}条
      </div>
      <div>
        <!--
          设计表格列 el-table-colum
          width 可以设定表格列的宽度
          label 可以设定列的标题
          prop  用来设定要渲染的列表项数据字段
        -->
        <el-table
          :data="articles"
          stripe
          border
          style="width: 100%"
          class="list-table"
          size="mini"
          v-loading="loading"
          >
          <el-table-column
            prop="date"
            label="封面">
            <template slot-scope="scope">
              <el-image
                style="width: 100px; height: 100px"
                :src="scope.row.cover.images[0]"
                fit="scale-down"
                lazy>
                <!--
                  加载失败的图片
                -->
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <!-- <img v-if="scope.row.cover.images[0]" class="article-cover" :src="scope.row.cover.images[0]" alt="">
              <img v-else class="article-cover" src="./no-cover.gif" alt=""> -->
            </template>
          </el-table-column>
          <el-table-column
            prop="title"
            label="标题">
          </el-table-column>
          <el-table-column
            prop="status"
            label="状态 ">
            <!--
              如果需要在自定义模板中获取当前遍历项数据，那么就在template中声明
              slot-scope="scope"        ""中的数据可以自定义
            -->
            <template slot-scope="scope">
              <el-tag :type="articleStatus[scope.row.status].type">
                {{articleStatus[scope.row.status].text}}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column
            prop="pubdate"
            label="发布时间 ">
          </el-table-column>
          <el-table-column
            label="操作 ">
            <template slot-scope="scope">
              <el-button
                size="mini"
                circle
                type="primary"
                icon="el-icon-edit"
                @click="$router.push('/publish?id=' + scope.row.id.toString())"
                >
              </el-button>
              <el-button
                size="mini"
                type="danger"
                icon="el-icon-delete"
                circle
                @click="onDeleteArtical(scope.row.id)"
                >
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页按钮 -->
        <el-pagination
          layout="prev, pager, next"
          background
          :total="totalCount"
          :page-size="pageSize"
          :disabled="loading"
          :current-page.sync="page"
          @current-change="onCurrentPage"
          >
        </el-pagination>
      </div>
    </el-card>

  </div>
</template>

<script>
import { getArticle, getArticleChannels, deleteArticle } from '@/api/article'

export default {
  name: 'ArticleIndex',
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
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      articles: [],
      articleStatus: [
        { status: 0, text: '草稿', type: 'info' },
        { status: 1, text: '待审核', type: '' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '失败', type: 'danger' }
      ],
      totalCount: 0, // 总数据条数
      pageSize: 10, // 没页条数
      status: null, // 查询文章的状态
      channels: [], // 文章频道下列列表
      channelId: null, // 文章频道
      rangeDate: null, // 筛选时间范围
      loading: true, // 加载
      page: 1 // 当前页码
    }
  },
  created () {
    // 默认是加载第一页
    this.loadArticle(1)
    this.loadArticleChannels()
  },
  methods: {
    onSubmit () {
      console.log('submit!')
    },
    loadArticleChannels () {
      getArticleChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    loadArticle (page) {
      this.loading = true
      getArticle({
        page: page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        console.log(res)
        // 前端不支持下划线，转成驼峰
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount

        // 关闭加载中loading
        this.loading = false
      })
    },
    onCurrentPage (page) {
      this.loadArticle(page)
    },
    onDeleteArtical (articleId) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页的文章数据
          this.loadArticle(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>

<style scoped>
.filter-card {
  margin-bottom: 30px;
}

.list-table {
  margin-bottom: 20px;
}

.article-cover {
  width: 100px;
  background-size: cover;
}
</style>
