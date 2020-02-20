<template>
  <div>
    <!-- 头部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
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
          <el-button type="primary">添加活动</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table :data="goods" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="title" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="category.name" label="所属分类" width="120"></el-table-column>
        <el-table-column align="center" prop="prices.initPrice" label="原价" width="70"></el-table-column>
        <el-table-column align="center" prop="prices.nowPrice" label="现价" width="70"></el-table-column>
        <el-table-column align="center" prop="prices.hotPrice" label="热门价格" width="70"></el-table-column>
        <el-table-column align="center" label="操作">
          <template v-slot:default="slotProps">
            <el-button
              type="warning"
              icon="el-icon-search"
              size="mini"
              @click="goDetail(slotProps.row)"
            >详情</el-button>
            <el-button type="primary" icon="el-icon-edit" size="mini">修改</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="1"
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
import { reqGoods } from "../../api";
export default {
  data() {
    return {};
  },
  computed: {
    ...mapState({
      goods: state => state.goods.goodsList,
      total: state => state.goods.goodsTotal
    })
  },
  created() {
    this.$store.dispatch("getGoods");
  },
  methods: {
    goDetail(goods) {
      console.log(goods)
      this.$store.dispatch('saveGoods', goods)
      // this.$router.push({ name: "detail", params: { goods } });
      this.$router.replace('/goodslist/detail')
    }
  }
};
</script>
