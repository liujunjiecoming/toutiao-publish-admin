<template>
  <div class="image-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to="/">首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="action-head">
        <el-radio-group v-model="collect" size="mini" @change="loadImages(1)">
          <el-radio-button label="false">全部</el-radio-button>
          <el-radio-button label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button size="mini" type="success" @click="dialogUploadVisible = true">上传素材</el-button>
      </div>
      <el-row :gutter="10">
        <el-col
          :xs="12"
          :sm="6"
          :md="6"
          :lg="4"
          v-for="(img, index) in images"
          :key="index"
          class="image-item"
          >
          <el-image
            style="height: 100px"
            :src="img.url"
            fit="cover"
            ></el-image>
            <div class="image-action">
              <el-button
                type="warning"
                :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
                size="mini"
                circle
                @click="onCollect(img)"
                :loading="img.loading"
              ></el-button>
              <!-- <i :class="{
                'el-icon-star-on': img.is_collected,
                'el-icon-star-off': !img.is_collected
              }" @click="onCollect(img)"></i> -->
              <el-button
                type="danger"
                icon="el-icon-delete"
                circle
                size="mini"
                :loading="img.loading"
                @click="onDelete(img)"
                >
              </el-button>
            </div>
        </el-col>
      </el-row>
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="onCurrentPage"
        :page-size="pageSize"
        :current-page.sync="page"
        ></el-pagination>
    </el-card>
    <el-dialog
      title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body="true"
      >
      <el-upload
        class="upload-demo"
        drag
        action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers="uploadHeaders"
        name="image"
        :on-success="uploadSuccess"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import { getImages, collectImage, deleteImage } from '@/api/image'

export default {
  name: 'ImageIndex',
  data () {
    const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: 'false',
      images: [], // 图片素材
      dialogUploadVisible: false,
      uploadHeaders: {
        Authorization: `Bearer ${user.token}`
      },
      totalCount: 0,
      pageSize: 20,
      page: 1
    }
  },
  created () {
    this.loadImages(1, false)
  },
  methods: {
    loadImages (page = 1) {
      // 重置高亮代码
      this.page = page
      getImages(
        {
          collect: this.collect,
          page,
          per_page: this.pageSize
        }
      ).then(res => {
        const results = res.data.data.results
        // img 对象本身没有 loading 数据
        // 我们这里收到的往里面添加该数据是用来控制每个收藏按钮的 loading 状态
        results.forEach(img => {
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },
    uploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false

      // 更新素材列表
      this.loadImages(false)
    },
    onCurrentPage (page) {
      this.loadImages(page)
    },
    onCollect (img) {
      // 展示 loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        img.is_collected = !img.is_collected

        // 关闭 loading
        img.loading = false
      })
      // console.log(img)
      // if (img.is_collected) {
      //   // 已收藏，取消收藏
      //   collectImage(img.id, true)
      // } else {
      //   // 没有收藏，添加收藏
      //   collectImage(img.id, false)
      // }
    },
    onDelete (img) {
      img.loading = true
      deleteImage(img.id).then(res => {
        this.loadImages(this.page)
        img.loading = false
      })
    }
  }
}

</script>

<style scoped lang='less'>
.action-head {
  padding-bottom: 20px;
  display: flex;
  justify-content: space-between;
}

.image-action {
  font-size: 25px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  color: yellow;
  height: 40px;
  background-color: rgba(204, 204, 204, .5);
  position: absolute;
  bottom: 4px;
  left: 5px;
  right: 5px;
}

.image-item {
  position: relative;
}
</style>
