<template>
  <div>
    <my-bread />
    <!-- 卡片区域 -->
    <el-card class="filter">
      <el-row>
        <el-col class="input" :xs="24" :md="7">
          <el-input v-model="searchName" type="text" placeholder="请输入评论内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col class="search" :xs="8" :md="3">
          <el-button type="primary">查询</el-button>
        </el-col>
        <el-col class="add" :xs="8" :md="8">
          <el-button type="primary" @click="openAddCommentDialog">添加评论</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="commentList" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="message" label="评论内容" min-width="200"></el-table-column>
        <el-table-column align="center" prop="images" label="评论图片" min-width="150">
          <template v-slot:default="slotProps">
            <el-link
              v-if="slotProps.row.images.length > 0"
              type="primary"
              @click="openImageDeatil(slotProps.row)"
            >
              <span>{{slotProps.row.images.length}}张</span>
            </el-link>
            <span v-else>{{slotProps.row.images.length}}张</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="order._id" label="评论所属订单" min-width="200"></el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateCommentDialog(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delComment(slotProps.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="pageSize"
          @size-change="sizeChange"
          @current-change="pageChange"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 查看图片的对话框 -->
    <el-dialog
      class="shop"
      title="查看图片"
      :visible.sync="isShowImgDialog"
      :lock-scroll="false"
      style="min-width:600px"
    >
      <el-row type="flex" justify="space-between" align="center" style="flex-wrap: wrap;">
        <el-col v-for="(item, index) in images" :key="index" :sm="12" :xs="12" :md="12">
          <div style="text-align:center;margin-bottom:20px">
            <img :src="item" alt style="width:200px;height:200px;" />
          </div>
        </el-col>
      </el-row>
    </el-dialog>

    <!-- 添加/修改评论对话框 -->
    <el-dialog
      :title="this.isUpdate ? '修改评论' : '添加评论'"
      :visible.sync="isShowAddUpdateDialog"
      :lock-scroll="false"
      @close="dialogClose"
    >
      <el-form ref="form" :model="commentForm" :rules="commentFormRules" label-width="120px">
        <el-form-item label="评论所属订单" prop="order">
          <el-col :span="14">
            <el-select
              clearable
              v-model="commentForm.order"
              style="width:100%"
              placeholder="请选择要评论的订单"
            >
              <el-option
                v-for="item in orderList"
                :key="item._id"
                :label="item._id"
                :value="item._id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="评论内容" prop="message">
          <el-col :span="14">
            <el-input v-model="commentForm.message" type="textarea" placeholder="请输入评论内容" autosize></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="评论图片" prop="images">
          <el-upload
            ref="upload"
            action="#"
            list-type="picture-card"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="9"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
            multiple
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="file.url" alt />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addComment">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="600px">
      <img :src="previewPath" width="400" alt />
    </el-dialog>
  </div>
</template>


<script>
import { mapState } from "vuex";

import { uploadImg } from "api";
import { reqAddUpdateComment, reqDelComment } from "api/comment";

export default {
  computed: {
    ...mapState({
      commentList: state => state.goods.commentList,
      total: state => state.goods.commentTotal,
      orderList: state => state.goods.orderList
    })
  },

  data() {
    return {
      searchName: '',
      loading: false,
      isShowImgDialog: false,
      isUpdate: false,
      images: [],
      isShowAddUpdateDialog: false,
      commentForm: {
        order: "",
        message: "",
        images: []
      },
      commentFormRules: {
        order: [
          { required: true, message: "请选择该评论所属订单", trigger: "blur" }
        ],
        message: [
          { required: true, message: "请输入评论内容", trigger: "blur" }
        ]
        // images: [{ required: true, message: "请上传评论图片", trigger: "blur" }]
      },
      pageSize: [5, 10, 15, 20],
      searchQuery: { limit: 10, page: 1 },
      fileList: [],
      previewPath: "",
      previewVisible: false
    };
  },

  created() {
    this.getComment();
    if (!this.orderList) this.$store.dispatch("getOrders", {});
  },

  methods: {
    /**
     * 获取评论列表
     */
    getComment() {
      this.$store.dispatch("getComments", this.searchQuery);
    },

    /**
     * 每页/条改变时触发
     */
    sizeChange(size) {
      this.searchQuery.limit = size;
      this.getComment();
    },

    /**
     * 页码改变时触发
     */
    pageChange(page) {
      this.searchQuery.page = page;
      this.getComment();
    },
    /**
     * 查看图片
     */
    openImageDeatil(comment) {
      this.isShowImgDialog = true;
      this.images = comment.images;
    },

    /**
     * 打开添加评论对话框
     */
    openAddCommentDialog() {
      this.isShowAddUpdateDialog = true;
      this.isUpdate = false;
    },
    /**
     * 打开修改评论对话框
     */
    openUpdateCommentDialog(comment) {
      this.isShowAddUpdateDialog = true;
      this.isUpdate = true;
      const { order, images, message, _id } = comment;
      this.$nextTick(() => {
        this.commentForm._id = _id;
        this.commentForm.order = order;
        this.commentForm.message = message;
        this.commentForm.images = images;
        images.forEach(img => {
          const tempObj = {
            name: new Date().getTime(),
            url: img
          };
          this.fileList.push(tempObj);
        });
      });
    },
    /**
     * 对话框关闭时
     */
    dialogClose() {
      this.fileList = [];
      this.$refs.form.resetFields();
      if (this.commentForm._id) delete this.commentForm._id;
    },

    /**
     * 监听上传图片组件的事件
     */
    async handleChange(file) {
      const files = file.raw;
      if (!this.imgLoading) {
        this.imgLoading = this.$notify({
          title: "提示",
          message: "图片上传中...",
          duration: 0
        });
      }
      const result = await uploadImg(files);
      if (!result) {
        return;
      }
      this.imgLoading.close();
      this.$notify({
        title: "成功",
        message: "图片上传成功！",
        type: "success",
        duration: 1500
      });
      this.commentForm.images.push(result.url);
      this.$refs.form.validateField("images");
      const tempObj = {
        name: result.filename,
        url: result.url
      };
      this.fileList.push(tempObj);
    },
    /**
     * 图片预览
     */
    handlePreview(file) {
      this.previewPath = file.url;
      this.previewVisible = true;
    },

    /**
     * 移除已上传的图片
     */
    handleRemove(file) {
      this._axiosPromiseArr.forEach(cancel => {
        cancel({ msg: "图片已停止上传", code: 600 });
      });
      this.imgLoading.close();
      const uid = file.uid;
      const i = this.fileList.findIndex(file => file.uid === uid);
      this.fileList.splice(i, 1);

      // 删除后, 重新表单验证
      this.commentForm.images.splice(i, 1);
      // this.$refs.form.validateField("images");
    },

    /**
     * 图片超出限制
     */
    handleExceed() {
      this.$message.error("只能上传九张图片");
    },

    /**
     * 点击确定按钮: 添加/修改评论
     */
    addComment() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await reqAddUpdateComment(this.commentForm);
          this.isShowAddUpdateDialog = false;
          this.$message.success(`${this.isUpdate ? "修改" : "添加"}成功!`);
          this.$store.dispatch("getComments", this.searchQuery);
        }
      });
    },

    /**
     * 删除评论
     */
    delComment(comment) {
      this.$confirm("确定删除该评论吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await reqDelComment(comment);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store
            .dispatch("getComments")
            .then(() => (this.loading = false));
        })
        .catch(() => {});
    }
  }
};
</script>

<style lang="scss" scoped>
/deep/ .el-upload-list__item {
  transition: none !important;
}
</style>