<template>
  <div>
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>首页活动</el-breadcrumb-item>
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
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table :data="activeList" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="title" label="活动名称" width="200"></el-table-column>
        <el-table-column align="center" prop="icon" label="活动图片">
          <template v-slot:default="slotProps">
            <img
              v-if="slotProps.row.icon"
              :src="slotProps.row.icon"
              alt
              style="width:50px;height:50px"
            />
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="slotProps">
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="activeTotal"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[1,2,5,10]"
        ></el-pagination>
      </div>
    </el-card>
  </div>
</template>


<script>
import { mapState } from "vuex";
export default {
  data() {
    return {};
  },
  created() {
    this.$store.dispatch('getActiveList')
  },
  computed: {
    ...mapState({
      activeList: state => state.goods.activeList,
      activeTotal: state => state.goods.activeTotal
    })
  }
};
</script>
