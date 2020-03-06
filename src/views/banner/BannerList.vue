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
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="bannerList" stripe border>
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
          :page-sizes="[1,2,5,10]"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 添加轮播图对话框区域 -->
    <el-dialog
      :title="isUpdate ? '修改轮播图' : '添加轮播图'"
      :visible.sync="isShowDialog"
      @close="dialogClose"
    >
      <el-form :model="addBannerForm" :rules="addBannerRules" ref="form" label-width="70px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="addBannerForm.title" placeholder="请输入标题"></el-input>
        </el-form-item>
        <el-form-item label="图片" ref="uploadForm" prop="url">
          <el-upload
            action="#"
            list-type="picture-card"
            :on-change="handleChange"
            :auto-upload="false"
            :limit="1"
            :file-list="fileList"
            :on-exceed="handleExceed"
            :on-remove="handleRemove"
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

        <el-form-item label="排序" prop="index">
          <el-select v-model="addBannerForm.index" placeholder="请选择排序">
            <el-option v-for="(item, index) in 10" :key="index" :value="index + 1"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateBanner">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 图片预览区域 -->
    <el-dialog :visible.sync="previewVisible">
      <img width="100%" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>

<script>
import { uploadImg } from "api";
import { reqBanner, addUpdateBanner, delBanner } from "api/banner";
export default {
  data() {
    return {
      loading: true,
      bannerList: [],
      total: 0,
      isShowDialog: false,
      addBannerForm: {
        title: "",
        index: 1,
        url: ""
      },
      addBannerRules: {
        title: [{ required: true, message: "请输入标题", trigger: "blur" }],
        url: [{ required: true, message: "请添加图片", trigger: "blur" }],
        index: [{ required: true, message: "请选择权重", trigger: "blur" }]
      },
      fileList: [],
      isUpdate: false,
      previewPath: "",
      previewVisible: false
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
      this.loading = false;
      this.bannerList = result.data;
      this.total = result.total;
    },

    /**
     * 监听upload组件图片改变
     */
    async handleChange({ raw }) {
      const file = raw;
      this.imgLoading = this.$notify({
        title: "提示",
        message: "图片上传中...",
        duration: 0
      });
      const result = await uploadImg(file);
      this.imgLoading.close();
      if (!result) {
        return;
      }
      this.$notify({
        title: "成功",
        message: "图片上传成功！",
        type: "success",
        duration: 3000
      });
      this.addBannerForm.url = result.url;
      this.$refs.form.validateField("img");
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
     * 点击确定按钮：添加/修改轮播图
     */
    addOrUpdateBanner() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.isShowDialog = false;
          await addUpdateBanner(this.addBannerForm);
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.getBanners();
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
      const { url, index, title, _id } = banner;
      this.$nextTick(() => {
        this.addBannerForm.url = url;
        this.addBannerForm.index = index;
        this.addBannerForm.title = title;
        this.addBannerForm._id = _id;
        const tempObj = {
          name: title,
          url: url
        };
        this.fileList.push(tempObj);
      });
    },

    /**
     * 打开添加轮播图对话框
     */
    openAddBannerDialog() {
      if(this.addBannerForm._id) delete this.addBannerForm._id
      this.isUpdate = false;
      this.isShowDialog = true;
    },
    /**
     * 对话框关闭时
     */
    dialogClose() {
      this.fileList = [];
      this.$refs.form.resetFields();
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
      }).then(async () => {
        await delBanner(banner._id);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.getBanners();
      });
    },

    /**
     * 图片超出上传的数量
     */
    handleExceed() {
      this.$message.error("只能添加一张图片");
    },

    /**
     * 移除已上传的图片
     */
    handleRemove(file) {
      this._axiosPromiseArr.forEach(cancel => {
        cancel({ msg: "图片已停止上传", code: 600 });
      });
      const uid = file.uid;
      const i = this.fileList.findIndex(file => file.uid === uid);
      this.fileList.splice(i, 1);
      this.addBannerForm.url = "";
      this.$refs.form.validateField("img");
    }
  }
};
</script>


<style lang="scss" scoped>
/deep/ .el-upload-list__item {
  transition: none !important;
}
</style>
