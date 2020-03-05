<template>
  <div>
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
          <el-button type="primary" @click="openAddOrderDialog">添加订单</el-button>
        </el-col>
      </el-row>

      <!-- 表格数据渲染区域 -->
      <el-table v-loading="loading" element-loading-text="拼命加载中" :data="orderList" stripe border>
        <el-table-column align="center" type="selection" width="55"></el-table-column>
        <el-table-column align="center" type="index" label="#"></el-table-column>
        <el-table-column align="center" prop="_id" label="订单编号" width="200"></el-table-column>
        <el-table-column align="center" prop="username" label="用户名" width="150">
          <template v-slot:default="slotProps">
            <span>{{slotProps.row.user.username}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="username" label="订单商品数量">
          <template v-slot:default="slotProps">
            <el-link v-if="slotProps.row.commoditis.length > 0" type="primary" @click="openGoodsDialog(slotProps.row)">
              <span>{{slotProps.row.commoditis.length}}件</span>
            </el-link>
            <span v-else>{{slotProps.row.commoditis.length}}件</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="createdAt" label="创建时间">
          <template v-slot:default="slotProps">
            <span>{{slotProps.row.createdAt | formateDate}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="updatedAt" label="更新时间">
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
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <div style="text-align:right">
        <el-pagination
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          background
          :page-sizes="[1,2,5,10]"
        ></el-pagination>
      </div>
    </el-card>

    <!-- 查看商品的对话框 -->
    <el-dialog
      class="shop"
      title="查看商品"
      :visible.sync="isShowShopDialog"
      :lock-scroll="false"
      width="600px"
    >
      <el-card v-if="orderDetail">
        <div slot="header" class="clearfix">
          <span>
            订单编号：
            <span>{{orderDetail._id}}</span>
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
import { reqAddOrder } from "api/order";
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
      currentDate: new Date(),
      loading: true,
      isShowShopDialog: false,
      orderDetail: null,
      currentCategory: null,
      isUpdate: false,
      isShowAddUpdateDialog: false,
      orderForm: {
        commoditis: [],
        user: ""
      },
      orderFormRules: {
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
    this.$store.dispatch("getOrders").then(() => (this.loading = false));
    if (!this.goodsList) {
      this.$store.dispatch("getGoods");
    }
    if (!this.adminUserList) {
      this.$store.dispatch("getUserList");
    }
  },

  methods: {
    openGoodsDialog(order) {
      this.isShowShopDialog = true;
      this.orderDetail = order;
    },

    goGoodsDetail(goods) {
      this.$store.dispatch("saveGoods", goods);
      this.$router.push("/goods/detail");
    },
    openAddOrderDialog() {
      this.isUpdate = false;
      this.isShowAddUpdateDialog = true;
    },
    openUpdateOrderDialog(order) {
      this.isUpdate = true;
      this.isShowAddUpdateDialog = true;
      const { commoditis, user } = order;
      this.$nextTick(() => {
        order.commoditis.forEach(item =>
          this.orderForm.commoditis.push(item._id)
        );
        this.orderForm.user = user._id;
      });
    },

    dialogClose() {
      this.$refs.form.resetFields();
    },
    async addOrder() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          await reqAddOrder(this.orderForm);
          this.isShowAddUpdateDialog = false;
          this.$message({
            message: `${this.isUpdate ? "修改" : "添加"}成功!`,
            type: "success"
          });
          this.$store.dispatch("getOrders").then(() => (this.loading = false));
        }
      });
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
