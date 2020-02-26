<template>
  <div>
    <!-- 头部面包屑区域 -->
    <my-bread />

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" clearable>
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">查询</el-button>
        </el-col>
        <el-col :span="2">
          <el-button type="primary" @click="openAddBannerDialog">添加轮播图</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table :data="bannerList" stripe border @selection-change="handleSelectionChange">
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="title" label="标题" width="200"></el-table-column>
        <el-table-column align="center" prop="index" label="排序权重"></el-table-column>
        <el-table-column align="center" prop="url" label="图片">
          <template v-slot:default="slotProps">
            <img :src="slotProps.row.url" alt style="width:50px;height:50px" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateBannerDialog(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deleteBanner(slotProps.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :page-sizes="[1,2,5,10]"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加轮播图对话框区域 -->
    <el-dialog
      :title="isUpdate ? '修改轮播图' : '添加轮播图'"
      :visible.sync="isShowDialog"
      :before-close="beforeCloseDialog"
    >
      <el-form :model="addBannerForm" :rules="addBannerRules" ref="form" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addBannerForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="图片" ref="uploadForm" prop="img">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-change="handleChange"
            :auto-upload="false"
            ref="upload"
            :limit="1"
            :file-list="showFiles"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
          >
            <i slot="default" class="el-icon-plus"></i>
            <div slot="file" slot-scope="{file}">
              <img class="el-upload-list__item-thumbnail" :src="imgUrl" alt />
              <span class="el-upload-list__item-actions">
                <span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">
                  <i class="el-icon-zoom-in"></i>
                </span>
                <span class="el-upload-list__item-delete" @click="handleRemove(file)">
                  <i class="el-icon-delete"></i>
                </span>
              </span>
            </div>
          </el-upload>
        </el-form-item>

        <el-form-item label="排序" prop="index">
          <el-select v-model="addBannerForm.index" placeholder="请选择排序">
            <el-option v-for="(item, index) in 10" :key="index" :value="index + 1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateBanner">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览区域 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { reqBanner, uploadImg, addUpdateBanner, delBanner } from "../../api";
import { serverURL } from "../../api/serverConfig";
export default {
  data() {
    return {
      bannerList: [],
      total: 0,
      isShowDialog: false,
      addBannerForm: {
        title: "",
        index: 1,
        img: ""
      },
      addBannerRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        img: [{ required: true, message: "请添加图片", trigger: "blur" }],
        index: [{ required: true, message: "请选择权重", trigger: "blur" }]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      uploadUrl: serverURL + "/upload",
      imgUrl: "",
      limitCount: 1,
      hideUpload: false,
      showFiles: [],
      isUpdate: false
    };
  },
  created() {
    this.getBanners();
  },
  methods: {
    /**
     * 调接口获取轮播图数据
     */
    async getBanners() {
      const result = await reqBanner();
      this.bannerList = result.data;
      this.total = result.total;
    },
    /**
     * pageSize 改变时会触发
     */
    handleSizeChange() {},
    /**
     * currentPage 改变时会触发
     */
    handlePageChange() {},

    /**
     * 监听upload组件图片改变
     */
    async handleChange(file, fileList) {
      this.hideUpload = fileList.length >= this.limitCount;
      const files = file.raw;
      const result = await uploadImg(files);
      this.addBannerForm.img = "imgurl";
      this.$refs.form.validateField("img");
      this.imgUrl = result.url;
      this.dialogImageUrl = result.url;
      return false;
    },

    /**
     * 删除upload组件中的图片
     */
    // handleRemove(file) {
    //   // 实现缩略图模板时删除文件
    //   let fileList = this.$refs.upload.uploadFiles;
    //   let index = fileList.findIndex(fileItem => {
    //     return fileItem.uid === file.uid;
    //   });
    //   fileList.splice(index, 1);
    //   this.addBannerForm.img = "";
    //   this.$refs.form.validateField("img");
    //   this.hideUpload = this.$refs.upload.uploadFiles >= this.limitCount;
    // },

    handlePictureCardPreview() {
      this.dialogVisible = true;
    },

    handleSelectionChange() {},

    /**
     * 点击确定按钮：添加/修改轮播图
     */
    addOrUpdateBanner() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.isShowDialog = false;
          this.addBannerForm.url = this.imgUrl;
          await addUpdateBanner(this.addBannerForm);
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.clearFormData();
          this.getBanners();
        } else {
          return false;
        }
      });
    },

    /**
     * 修改轮播图
     * @param banner 轮播图对象
     */
    openUpdateBannerDialog(banner) {
      this.isUpdate = true;
      this.isShowDialog = true;
      let fileArr = [];
      let fileObj = {};
      fileObj.name = banner.title;
      fileObj.url = banner.url;
      fileArr.push(fileObj);
      this.showFiles = [...fileArr];
      this.addBannerForm.title = banner.title;
      this.addBannerForm.index = banner.index;
      this.addBannerForm._id = banner._id;
      this.imgUrl = banner.url;
      this.addBannerForm.img = "img";
    },

    /**
     * 打开添加轮播图对话框
     */
    openAddBannerDialog() {
      this.isUpdate = false;
      this.isShowDialog = true;
      this.addBannerForm = {
        title: "",
        index: 1,
        img: ""
      };
    },
    /**
     * 关闭对话框
     */
    closeDialog() {
      this.isShowDialog = false;
      this.clearFormData();
    },
    /**
     * 在关闭对话框之前执行的函数
     */
    beforeCloseDialog(done) {
      this.$refs.form.resetFields();
      this.clearFormData();
      done();
    },

    /**
     * 删除某张轮播图
     * @param banner 轮播图对象
     */
    deleteBanner(banner) {
      this.$confirm("确定删除该轮播图吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await delBanner(banner._id);
          this.getBanners();
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },

    /**
     * 图片超出上传的数量
     */
    handleExceed() {
      this.$message({
        message: "只能添加一张图片",
        type: "error"
      });
    },
    /**
     * 清空表单数据函数
     */
    clearFormData() {
      this.$refs.form.resetFields();
      this.$refs.upload.clearFiles();
      this.showFiles = [];
      this.addBannerForm = {
        title: "",
        index: 1,
        img: ""
      };
    },
    /**
     * 移除已上传的图片
     */
    handleRemove(file) {
      const uid = file.uid;
      const i = this.showFiles.findIndex(file => file.uid === uid);
      this.showFiles.splice(i, 1);
    }
  }
};
</script>


<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
.el-upload-list__item {
  transition: none !important;
}
</style>
