<template>
  <div>
    <el-page-header @back="$router.replace('/categorylist')" content="添加分类"></el-page-header>
    <el-card>
      <el-tabs type="card">
        <el-tab-pane label="分类普通值">
          <el-form
            ref="normalForm"
            :model="categoryForm"
            :rules="categoryFormRules"
            label-width="80px"
          >
            <el-form-item label="父级分类" prop="parent">
              <el-select
                clearable
                @clear="clearSelect"
                v-model="categoryForm.parent"
                style="width:100%"
                placeholder="请选择,不选即添加一级分类"
              >
                <el-option
                  v-for="item in parentCategoryList"
                  :key="item._id"
                  :label="item.name"
                  :value="item._id"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="分类名称" prop="categoryName">
              <el-input v-model="categoryForm.categoryName" placeholder="请选择"></el-input>
            </el-form-item>
            <el-form-item label="分类图标">
              <el-upload
                action="#"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                list-type="picture"
                :file-list="fileList"
                :on-change="handleChange"
                :auto-upload="false"
                :limit="1"
                :on-exceed="handleExceed"
              >
                <el-button size="small" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane label="分类属性值">
          <el-button icon="el-icon-plus">添加属性</el-button>
          <el-form ref="specialForm" :model="categoryForm" :rules="categoryFormRules">
            <el-form-item label="属性名称">
              <el-input v-model="categoryForm.attributes[0].attrName"></el-input>
            </el-form-item>
            <el-form-item label="属性类型">
              <el-select
                v-model="categoryForm.attributes[0].attrType"
                style="width:100%"
                placeholder="请选择属性类型"
              >
                <el-option label="下拉多选" value="selects"></el-option>
                <el-option label="下拉单选" value="select"></el-option>
                <el-option label="输入框" value="input"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性值类型">
              <el-select
                v-model="categoryForm.attributes[0].attrValType"
                style="width:100%"
                placeholder="请选择属性值类型"
              >
                <el-option label="数组" value="array"></el-option>
                <el-option label="数字" value="number"></el-option>
                <el-option label="字符串" value="string"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="属性值">
              
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import { uploadImg } from "../../api";
export default {
  data() {
    return {
      parentCategoryList: [], // 一级分类
      categoryForm: {
        // 分类的form表单
        parent: "",
        categoryName: "",
        url: "",
        attributes: [
          {
            attrName: "",
            attrType: "",
            attrValType: "",
            attrVal: ""
          }
        ]
      },
      categoryFormRules: {
        // 分类form表单的验证规则
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ]
      },
      // seleteId: "", // 选择的一级分类
      fileList: [], // 上传图片的列表
      previewPath: "", // 预览的图片地址
      previewVisible: false // 是否显示预览图片
    };
  },
  created() {
    this.parentCategoryList = this.$route.params.parentCategoryList;
  },
  methods: {
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
      const uid = file.uid;
      const i = this.fileList.findIndex(file => file.uid === uid);
      this.fileList.splice(i, 1);
    },

    /**
     * 监听上传图片组件的事件
     */
    async handleChange(file) {
      const files = file.raw;
      const result = await uploadImg(files);
      this.categoryForm.url = result.url;
      const tempObj = {
        name: result.filename,
        url: result.url
      };
      this.fileList.push(tempObj);
    },

    /**
     * 图片超出限制
     */
    handleExceed() {
      this.$message.error("只能上传一张图片");
    },

    /**
     * 清除已选择的父类
     */
    clearSelect() {
      this.categoryForm.parent = "";
    }
  }
};
</script>

