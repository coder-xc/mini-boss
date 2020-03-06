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
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="categoryList" stripe border>
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
        <el-table-column align="center" label="操作" width="200">
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { deleteCategory } from "api/category";

export default {
  data() {
    return {
      loading: true,
      parentCategoryList: [] // 一级分类
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
      this.loading = false;
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
     * 添加分类
     */
    openAddCategory() {
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
          category,
          parentCategoryList: this.parentCategoryList
        }
      });
    },

    /**
     * 删除分类
     */
    delCategory(category) {
      this.$confirm("确定删除该分类吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
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
      });
    }
  }
};
</script>