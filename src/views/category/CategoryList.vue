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
          <el-button type="primary" @click="openAddCategory">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table :data="categoryList" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="name" label="分类名称"></el-table-column>
        <el-table-column align="center" label="分类级别">
          <template v-slot:default="slotProps">
            <span>{{slotProps.row.parent ? '二级分类' : '一级分类'}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="上级分类" prop="parent.name"></el-table-column>
        <el-table-column align="center" prop="url" label="分类图标">
          <template v-slot:default="slotProps">
            <img
              v-if="slotProps.row.url"
              :src="slotProps.row.url"
              alt
              style="width:50px;height:50px"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="editCategory(slotProps.row)"
            >编辑</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delCategory(slotProps.row)"
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

    <!-- 添加/修改分类对话框 -->
    <el-dialog
      :title="this.isUpdate ? '修改分类' : '添加分类'"
      :visible.sync="isShowDialog"
      @close="dialogClose"
      :lock-scroll="false"
    >
      <el-form ref="form" :model="categoryForm" :rules="categoryFormRules" label-width="80px">
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
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowDialog = false">取 消</el-button>
        <el-button type="primary" @click="addUpdateCategory">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 图片预览 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img :src="previewPath" alt />
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import {
  reqCategories,
  uploadImg,
  reqAddUpdateCategory,
  deleteCategory
} from "../../api";
export default {
  data() {
    return {
      // categoryList: [], // 总分类列表
      parentCategoryList: [], // 一级分类
      // total: 0, // 数据总条数
      isShowDialog: false, // 是否显示对话框
      categoryForm: {
        // 分类的form表单
        parent: "",
        categoryName: "",
        url: ""
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
      previewVisible: false, // 是否显示预览图片
      isUpdate: false, // 是否编辑

      editableTabsValue: "2",
      editableTabs: [
        {
          title: "Tab 1",
          name: "1",
          content: "Tab 1 content"
        },
        {
          title: "Tab 2",
          name: "2",
          content: "Tab 2 content"
        }
      ],
      tabIndex: 2
    };
  },

  computed: {
    ...mapState({
      categoryList: state => state.goods.categoryList,
      total: state => state.goods.categoryTotal
    })
  },

  created() {
    this.getCategoryList();
  },

  methods: {
    /**
     * 获取分类列表
     */
    async getCategoryList() {
      await this.$store.dispatch("getCategory");
      this.categoryList.forEach(category => {
        if (!category.parent) {
          if (
            !this.parentCategoryList.find(item => item._id === category._id)
          ) {
            this.parentCategoryList.push(category);
          }
        }
      });
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
    },

    /**
     * 点击确定按钮：添加/修改分类
     */
    addUpdateCategory() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          this.isShowDialog = false;
          await reqAddUpdateCategory(this.categoryForm);
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.getCategoryList();
          this.$refs.form.resetFields();
        } else {
          return false;
        }
      });
    },

    /**
     * 添加分类
     */
    openAddCategory() {
      // this.isUpdate = false;
      // this.isShowDialog = true;
      // this.$nextTick(() => {
      //   this.$refs.form.resetFields();
      // });
      this.$router.push({
        name: "addCategory",
        params: { type: "add", parentCategoryList: this.parentCategoryList }
      });
    },

    /**
     * 编辑分类
     */
    editCategory(category) {
      this.$router.push({
        name: "addCategory",
        params: {
          type: "edit",
          category: category,
          parentCategoryList: this.parentCategoryList
        }
      });
    },
    // openUpdateCategory(category) {
    //   this.isUpdate = true;
    //   this.isShowDialog = true;
    //   this.$nextTick(() => {
    //     this.categoryForm.parent = category.parent ? category.parent : "";
    //     this.categoryForm.categoryName = category.name;
    //     this.categoryForm._id = category._id;
    //     if (category.url) {
    //       const tempObj = {
    //         name: category.name,
    //         url: category.url
    //       };
    //       this.fileList.push(tempObj);
    //     }
    //   });
    // },

    /**
     * 关闭对话框前的事件
     */
    dialogClose() {
      this.fileList = [];
      this.$refs.form.resetFields();
      this.$refs.form.clearValidate();
    },

    /**
     * 删除分类
     */
    delCategory(category) {
      this.$confirm("确定删除该分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          if (!category.parent) {
            const i = this.parentCategoryList.findIndex(
              item => item._id === category._id
            );
            this.parentCategoryList.splice(i, 1);
          }
          await deleteCategory(category._id);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.getCategoryList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  }
};
</script>

