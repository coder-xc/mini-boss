<template>
  <div>
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>轮播图</el-breadcrumb-item>
      <el-breadcrumb-item>首页轮播图</el-breadcrumb-item>
    </el-breadcrumb>

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
        <el-table-column align="center" label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateBannerDialog(slotProps.row)"
            >修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination layout="total, sizes, prev, pager, next, jumper" :total="total" background></el-pagination>
      </div>
    </el-card>

    <!-- 添加轮播图对话框区域 -->
    <el-dialog
      :title="addBannerForm.title ? '修改轮播图' : '添加轮播图'"
      :visible.sync="isShowDialog"
      width="30%"
      :before-close="beforeCloseDialog"
      
    >
      <el-form 
        :model="addBannerForm" 
        :rules="addBannerRules"
        ref="ruleForm" 
        label-width="70px"
       >
        <el-form-item label="标题" prop="title">
          <el-input v-model="addBannerForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="图片">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-change="handleChange"
            :auto-upload="false"
            ref="upload"
            :limit="1"
            :file-list="showFiles"
            :on-exceed="handleExceed"
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
            <el-option v-for="(item, index) in 10" :key="index" :label="item" :value="index + 1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addBanner">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览区域 -->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { reqBanner, uploadImg, addBanner } from "../../api";
import { serverURL } from "../../api/serverConfig";
export default {
  data() {
    return {
      bannerList: [],
      total: 0,
      isShowDialog: false,
      addBannerForm: {
        title: "",
        index: 1
      },
      addBannerRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }]
      },
      dialogImageUrl: "",
      dialogVisible: false,
      disabled: false,
      uploadUrl: serverURL + "/upload",
      imgUrl: "",
      limitCount: 1,
      hideUpload: false,
      showFiles: []
    };
  },
  methods: {
    async getBanners() {
      const result = await reqBanner();
      this.bannerList = result.data;
      this.total = result.total;
    },

    async handleChange(file, fileList) {
      // console.log(this.$refs.upload)
      this.hideUpload = fileList.length >= this.limitCount;
      const files = file.raw;
      const result = await uploadImg(files);
      this.imgUrl = result.url;
      this.dialogImageUrl = result.url;
      return false;
    },

    handleRemove(file) {
      // 实现缩略图模板时删除文件
      let fileList = this.$refs.upload.uploadFiles;
      let index = fileList.findIndex(fileItem => {
        return fileItem.uid === file.uid;
      });
      fileList.splice(index, 1);
      this.hideUpload = this.$refs.upload.uploadFiles >= this.limitCount;
    },

    handlePictureCardPreview() {
      this.dialogVisible = true;
    },

    handleSelectionChange() {},

    async addBanner() {
      this.isShowDialog = false;
      this.addBannerForm.url = this.imgUrl;
      const result = await addBanner(this.addBannerForm);
      console.log(result)
      this.$message({
        message: "添加成功!",
        type: "success"
      });
      this.getBanners();
    },

    // 编辑轮播图
    openUpdateBannerDialog(banner) {
      this.isShowDialog = true;
      let fileArr = [];
      let fileObj = {};
      fileObj.name = banner.title;
      fileObj.url = banner.url;
      fileArr.push(fileObj);
      this.showFiles = [...fileArr];

      this.addBannerForm.title = banner.title;
      this.addBannerForm.index = banner.index;
      this.imgUrl = banner.url;
    },

    // 打开添加轮播图对话框
    openAddBannerDialog() {
      this.isShowDialog = true;
      this.addBannerForm = {}
      // this.addBannerForm = {
      //   title: "",
      //   index: 1
      // };
    },
    // 关闭对话框
    closeDialog() {
      this.isShowDialog = false;
      this.$refs.ruleForm.resetFields()
      this.$refs.upload.clearFiles()
      this.showFiles = [];
      this.addBannerForm = {}
      // this.addBannerForm = {
      //   title: "",
      //   index: 1
      // };
    },
    // 关闭对话框之前
    beforeCloseDialog(done) {
      this.$refs.ruleForm.resetFields()
      this.$refs.upload.clearFiles()
      this.showFiles = [];
      this.addBannerForm = {}
      // this.addBannerForm = {
      //   title: "",
      //   index: 1
      // };
      done()
    },

    handleExceed() {
      this.$message({
        message: "只能添加一张图片",
        type: "error"
      });
    }
  },
  created() {
    this.getBanners();
  }
};
</script>


<style lang="scss">
.hide .el-upload--picture-card {
  display: none;
}
</style>
