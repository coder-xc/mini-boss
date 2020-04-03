<template>
  <div>
    <my-bread />

    <!-- 卡片区域 -->
    <el-card class="filter">
      <el-row>
        <el-col class="input" :xs="24" :md="12">
          <el-input 
            v-model="searchQuery.where.orderNum.$regex" 
            placeholder="请输入订单编号" 
            clearable
            @clear="clearSearch"
            @keyup.enter.native="getOrder"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrder"></el-button>
          </el-input>
        </el-col>
        <!-- <el-col class="search" :xs="8" :md="3">
          <el-button type="primary" @click="getOrder">查询</el-button>
        </el-col> -->
        <el-col class="add" :xs="8" :md="8">
          <el-button type="primary" @click="openAddOrderDialog">添加订单</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="orderList" stripe border>
        <!-- <el-table-column align="center" type="selection" width="55"></el-table-column> -->
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="orderNum" label="订单编号" min-width="200"></el-table-column>
        <el-table-column align="center" prop="username" label="用户名" min-width="150">
          <template v-slot:default="slotProps">
            <span>{{slotProps.row.user && slotProps.row.user.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="订单商品数量" min-width="100">
          <template v-slot:default="slotProps">
            <el-link
              v-if="slotProps.row.commoditis.length > 0"
              type="primary"
              @click="openGoodsDialog(slotProps.row)"
            >
              <span>{{slotProps.row.commoditis.length}}件</span>
            </el-link>
            <span v-else>{{slotProps.row.commoditis.length}}件</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createdAt" label="创建时间" min-width="140">
          <template v-slot:default="slotProps">
            <span>{{slotProps.row.createdAt | formateDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updatedAt" label="更新时间" min-width="140">
          <template v-slot:default="slotProps">
            <span>{{slotProps.row.updatedAt | formateDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作" width="200">
          <template v-slot:default="slotProps">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="openUpdateOrderDialog(slotProps.row)"
            >修改</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="delOrder(slotProps.row)"
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

    <!-- 查看商品的对话框 -->
    <el-dialog
      class="shop"
      title="查看商品"
      :visible.sync="isShowShopDialog"
      :lock-scroll="false"
    >
      <el-card v-if="orderDetail">
        <div slot="header" class="clearfix">
          <span>
            订单编号：
            <span>{{orderDetail.orderNum}}</span>
          </span>
          <span style="float: right; padding: 3px 0">创建时间：{{orderDetail.createdAt | formateDate}}</span>
        </div>
        <div class="shop-list" v-for="item in orderDetail.commoditis" :key="item._id">
          <img class="image" :src="item.images[0]" />
          <div class="shop-info">
            <span class="shop-title">{{item.title}}</span>
            <span>所属分类：{{item.category.name}}</span>
            <div class="bottom clearfix">
              <time class="price">
                商品价格：
                <span>￥{{item.prices.nowPrice}}</span>
              </time>
            </div>
          </div>
          <el-button type="text" class="button" @click="goGoodsDetail(item)">查看商品</el-button>
        </div>
      </el-card>
    </el-dialog>
    <!-- 添加/修改订单对话框 -->
    <el-dialog
      :title="this.isUpdate ? '修改订单' : '添加订单'"
      :visible.sync="isShowAddUpdateDialog"
      :lock-scroll="false"
      @close="dialogClose"
    >
      <el-form ref="form" :model="orderForm" :rules="orderFormRules" label-width="80px">
        <el-form-item label="下单用户" prop="user">
          <el-select clearable v-model="orderForm.user" style="width:100%" placeholder="请选择店铺商品">
            <el-option
              v-for="item in adminUserList"
              :key="item._id"
              :label="item.username"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="店铺商品" prop="commoditis">
          <el-select
            clearable
            v-model="orderForm.commoditis"
            style="width:100%"
            placeholder="请选择店铺商品"
            multiple
          >
            <el-option
              v-for="item in goodsList"
              :key="item._id"
              :label="item.title"
              :value="item._id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="isShowAddUpdateDialog = false">取 消</el-button>
        <el-button type="primary" @click="addOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { formateDate } from "@/utils/dateUtils";
import { reqAddUpdateOrder, reqDelOrder } from "api/order";
export default {
  computed: {
    ...mapState({
      orderList: state => state.goods.orderList,
      total: state => state.goods.orderTotal,
      goodsList: state => state.goods.goodsList,
      adminUserList: state => state.adminUser.adminUserList
    })
  },
  data() {
    return {
      loading: true, // loading状态
      isShowShopDialog: false, // 是否显示查看商品对话框
      orderDetail: null, // 查看商品时对应的商品数据
      isUpdate: false, // 是否更新订单
      isShowAddUpdateDialog: false, // 是否显示添加/修改订单对话框
      pageSize: [5, 10, 15, 20],
      searchQuery: { limit: 10, page: 1, where: { orderNum: { $regex: "" } } },
      orderForm: {
        // 添加/修改订单的Form表单数据
        commoditis: [],
        user: ""
      },
      orderFormRules: {
        // 添加/修改订单的Form表单验证规则
        commoditis: [
          { required: true, message: "请选择下单商品", trigger: "blur" }
        ],
        user: [{ required: true, message: "请选择下单用户", trigger: "blur" }]
      }
    };
  },

  filters: {
    formateDate
  },

  created() {
    this.getOrder();
    /**
     * 不存在: 获取数据; 存在: 但数据只有10条以下, 也获取数据
     */
    if (!this.goodsList) {
      this.$store.dispatch("getGoods", {});
    }
    if (this.goodsList && this.goodsList.length <= 10) {
      this.$store.dispatch("getGoods", {});
    }

    if (!this.adminUserList) {
      this.$store.dispatch("getUserList", {});
    }
    if (this.adminUserList && this.adminUserList.length <= 10) {
      this.$store.dispatch("getUserList", {});
    }
  },

  methods: {
    getOrder() {
      this.$store
        .dispatch("getOrders", this.searchQuery)
        .then(() => (this.loading = false));
    },
    /**
     * 每页/条改变时触发
     */
    sizeChange(size) {
      this.searchQuery.limit = size;
      this.getOrder();
    },

    /**
     * 页码改变时触发
     */
    pageChange(page) {
      this.searchQuery.page = page;
      this.getOrder();
    },
    /**
     * 打开查看商品对话框
     */
    openGoodsDialog(order) {
      this.isShowShopDialog = true;
      this.orderDetail = order;
    },

    /**
     * 对话框中查看商品详情
     */
    goGoodsDetail(goods) {
      this.$store.dispatch("saveGoods", goods);
      this.$router.push("/goods/detail");
    },

    /**
     * 打开添加订单对话框
     */
    openAddOrderDialog() {
      if (this.orderForm._id) delete this.orderForm._id;
      this.isUpdate = false;
      this.isShowAddUpdateDialog = true;
    },

    /**
     * 打开修改订单对话框
     */
    openUpdateOrderDialog(order) {
      this.isUpdate = true;
      this.isShowAddUpdateDialog = true;
      const { commoditis, user, _id } = order;
      // debugger
      this.$nextTick(() => {
        commoditis.forEach(item => this.orderForm.commoditis.push(item._id));
        this.orderForm.user = user._id;
        this.orderForm._id = _id;
      });
    },

    /**
     * 对话框关闭时
     */
    dialogClose() {
      this.$refs.form.resetFields();
    },

    /**
     * 点击确定按钮: 添加/修改订单
     */
    async addOrder() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await reqAddUpdateOrder(this.orderForm);
          this.isShowAddUpdateDialog = false;
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.$store
            .dispatch("getOrders", this.searchQuery)
            .then(() => (this.loading = false));
        }
      });
    },

    delOrder(order) {
      this.$confirm("确定删除该订单吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(async () => {
          await reqDelOrder(order);
          this.$message({
            type: "success",
            message: "删除成功!"
          });
          this.$store.dispatch("getOrders", this.searchQuery).then(() => (this.loading = false));
        })
        .catch(() => {});
    },

    clearSearch() {
      this.getOrder()
    }
  }
};
</script>

<style lang="scss" scoped>
.shop {
  /deep/ .el-card {
    margin-top: 0;
  }
  .shop-list {
    display: flex;
    justify-content: space-between;
    padding-bottom: 25px;
    margin-bottom: 25px;
    border-bottom: 1px solid #ebeef5;
    &:last-child {
      padding-bottom: 0;
      margin-bottom: 0;
      border-bottom: none;
    }
    .image {
      width: 100px;
      height: 100px;
      flex: 1;
    }
    .shop-info {
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex: 2;
      .shop-title {
        font-size: 16px;
        font-weight: 600;
      }
      .price {
        > span {
          color: #f40;
        }
      }
    }
    .el-button {
      flex: 1;
    }
  }
}
</style>
