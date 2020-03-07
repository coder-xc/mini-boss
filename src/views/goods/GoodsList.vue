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
          <el-button type="primary" @click="addGoods">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="goods" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="title" label="商品名称"></el-table-column>
        <el-table-column align="center" prop="category.name" label="所属分类" width="120"></el-table-column>
        <el-table-column align="center" prop="prices.initPrice" label="原价" width="70"></el-table-column>
        <el-table-column align="center" prop="prices.nowPrice" label="现价" width="70"></el-table-column>
        <el-table-column align="center" prop="prices.hotPrice" label="热门价格" width="70"></el-table-column>
        <el-table-column align="center" label="操作" width="300">
          <template v-slot:default="slotProps">
            <el-button
              type="warning"
              icon="el-icon-search"
              size="mini"
              @click="goDetail(slotProps.row)"
            >详情</el-button>
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="updateGoods(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delGoods(slotProps.row)"
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
  </div>
</template>

<script>
import { mapState } from "vuex";
import { reqDelGoods } from "api/goods";
export default {
  data() {
    return {
      loading: true,
      pageSize: [5, 10, 15, 20],
      searchQuery: { limit: 10, page: 1 }
    };
  },
  computed: {
    ...mapState({
      goods: state => state.goods.goodsList,
      total: state => state.goods.goodsTotal
    })
  },
  created() {
    this.getGoods();
  },
  methods: {
    /**
     * 获取商品列表
     */
    getGoods() {
      this.$store
        .dispatch("getGoods", this.searchQuery)
        .then(() => (this.loading = false));
    },
    /**
     * 每页/条改变时触发
     */
    sizeChange(size) {
      this.searchQuery.limit = size;
      this.getGoods();
    },

    /**
     * 页码改变时触发
     */
    pageChange(page) {
      this.searchQuery.page = page;
      this.getGoods();
    },
    goDetail(goods) {
      this.$store.dispatch("saveGoods", goods);
      this.$router.replace("/goods/detail");
    },
    addGoods() {
      this.$router.push({ name: "addUpdateGoods", params: { type: "add" } });
    },
    updateGoods(goods) {
      this.$store.dispatch("saveGoods", goods);
      this.$router.push({ name: "addUpdateGoods", params: { type: "update" } });
    },
    async delGoods(goods) {
      this.$confirm("确定删除该商品吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        await reqDelGoods(goods);
        this.$message({
          type: "success",
          message: "删除成功!"
        });
        this.$store.dispatch("getGoods");
      });
    }
  }
};
</script>
