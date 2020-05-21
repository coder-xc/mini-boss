<template>
  <div>
    <el-page-header
      @back="$router.replace('/category/categorylist')"
      :content="isUpdate ? '修改分类' : '添加分类'"
    ></el-page-header>
    <el-form
      ref="form"
      style="margin-top: 2rem;"
      :model="categoryForm"
      :rules="categoryFormRules"
      label-width="100px"
      @submit.native.prevent="save"
    >
      <el-tabs type="border-card">
        <el-tab-pane label="分类普通值">
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
          <el-form-item label="分类图标" prop="url">
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
              <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
            </el-upload>
          </el-form-item>
        </el-tab-pane>
        <el-tab-pane label="分类属性值">
          <el-row>
            <el-button
              icon="el-icon-plus"
              @click="categoryForm.attributes.push(getPureDemoitem())"
            >添加属性</el-button>
          </el-row>
          <el-row type="flex" style="margin-top:1rem; flex-wrap: wrap;">
            <el-col
              :md="8"
              v-for="(item, index) in categoryForm.attributes"
              style="magrin-top: 1rem;"
              :key="index"
            >
              <el-form-item label="属性名称" prop>
                <el-input placeholder="请输入属性名称" v-model="categoryForm.attributes[index].name"></el-input>
              </el-form-item>
              <el-form-item label="属性类型">
                <el-select
                  v-model="categoryForm.attributes[index].type"
                  style="width:100%"
                  placeholder="请选择属性类型"
                >
                  <el-option label="多选框" value="selects"></el-option>
                  <el-option label="单选框" value="select"></el-option>
                  <el-option label="输入框" value="input"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性值类型">
                <el-select
                  v-model="categoryForm.attributes[index].messageType"
                  style="width:100%"
                  placeholder="请选择属性值类型"
                  @change="selectChange(index)"
                  @click="categoryForm.attributes[index].messageType === 'array' && (categoryForm.attributes[index].message = [])"
                >
                  <el-option label="数组" value="array"></el-option>
                  <el-option label="数字" value="number"></el-option>
                  <el-option label="字符串" value="string"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="属性值">
                <el-input
                  v-if="categoryForm.attributes[index].messageType == 'number'"
                  v-model="categoryForm.attributes[index].message"
                  value="number"
                ></el-input>
                <div v-if="categoryForm.attributes[index].messageType == 'array'">
                  <el-form-item>
                    <el-button
                      type="primary"
                      icon="el-icon-plus"
                      @click="categoryForm.attributes[index].message.push('')"
                      size="mini"
                    >新增属性值</el-button>
                  </el-form-item>
                  <el-row type="flex">
                    <el-form-item style="magrin-top: 10px; margin-top: 10px;">
                      <el-row
                        v-for="(item, _index) in categoryForm.attributes[index].message"
                        :key="_index"
                        type="flex"
                        style="margin-bottom:10px"
                      >
                        <el-input
                          v-model="categoryForm.attributes[index].message[_index]"
                          clearable
                          placeholder="请输入值"
                          style="margin-right:10px;"
                        ></el-input>
                        <el-button
                          class="el-icon-delete"
                          type="danger"
                          @click="categoryForm.attributes[index].message.splice(_index, 1)"
                        >删除</el-button>
                      </el-row>
                    </el-form-item>
                  </el-row>
                </div>
                <el-input
                  v-if="categoryForm.attributes[index].messageType == 'string'"
                  v-model="categoryForm.attributes[index].message"
                  type="textarea"
                  autosize
                ></el-input>
              </el-form-item>
              <el-form-item>
                <el-button
                  class="el-icon-delete"
                  type="danger"
                  @click="categoryForm.attributes.splice(index, 1)"
                >删除</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-tab-pane>
      </el-tabs>
      <el-form-item style="margin-top: 1rem;">
        <el-button type="primary" native-type="submit">保存</el-button>
      </el-form-item>
    </el-form>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible">
      <img class="pre-img" :src="previewPath" alt />
    </el-dialog>
  </div>
</template>

<script>
import { uploadImg } from "api";
import { reqAddUpdateCategory } from "api/category";
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
            name: "",
            type: "",
            messageType: null,
            message: ""
          }
        ]
      },
      //为attribute 提供的空值, 防止 新增时 get 不到需要的属性
      demoItem: {
        name: "",
        type: "",
        messageType: null,
        message: ""
      },
      categoryFormRules: {
        // 分类form表单的验证规则
        categoryName: [
          { required: true, message: "请输入分类名称", trigger: "blur" }
        ],
        url: [{ required: true, message: "请添加图片", trigger: "change" }]
      },
      fileList: [], // 上传图片的列表
      previewPath: "", // 预览的图片地址
      previewVisible: false, // 是否显示预览图片
      isUpdate: false
    };
  },
  created() {
    const { type } = this.$route.params;
    this.parentCategoryList = this.$route.params.parentCategoryList;
    if (type === "edit") {
      this.isUpdate = true;
      const {
        attributes,
        name: categoryName,
        parent,
        url,
        _id
      } = this.$route.params.category;
      this.categoryForm.attributes = attributes;
      this.categoryForm.categoryName = categoryName;
      this.categoryForm.url = url;
      this.categoryForm.parent = parent && parent._id;
      this.categoryForm._id = _id;
      const temp = {
        name: categoryName,
        url
      };
      this.fileList.push(temp);
    }
  },
  methods: {
    /**
     * 序列化 demoItem
     */
    getPureDemoitem() {
      return JSON.parse(JSON.stringify(this.demoItem));
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
      this.categoryForm.url = "";
      this.$refs.form.validateField("url");
    },

    /**
     * 监听上传图片组件的事件
     */
    async handleChange(file) {
      const files = file.raw;
      this.imgLoading = this.$notify({
        title: "提示",
        message: "图片上传中...",
        duration: 0
      });
      const result = await uploadImg(files);
      this.imgLoading.close();
      if (!result) {
        return;
      }
      this.$notify({
        title: "成功",
        message: "图片上传成功！",
        type: "success"
      });
      this.categoryForm.url = result.url;
      this.$refs.form.validateField("url");
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
    },

    /**
     * 监听属性值类型select下拉框的改变
     */
    selectChange(index) {
      if (this.categoryForm.attributes[index].messageType === "array") {
        this.categoryForm.attributes[index].message = [];
      } else {
        this.categoryForm.attributes[index].message = "";
      }
    },

    /**
     * 点击保存按钮: 添加/修改分类
     */
    async save() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await reqAddUpdateCategory(this.categoryForm);
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.$router.replace("/category/categorylist");
        }
      });
    }
  }
};
</script>
