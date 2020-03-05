<template>
  <el-aside :width="isCollapse ? '80px' : '256px'">
    <div class="header">
      <img src="../../assets/logo.png" alt />
      <h1 v-show="!isCollapse">商城后台管理系统</h1>
    </div>
    <!-- 侧边栏菜单区域 -->
    <el-menu
      background-color="#001529"
      text-color="#fff"
      active-text-color="#409EFF"
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="currentPath"
    >
      <!-- 二级菜单 -->
      <el-submenu index="1">
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </template>
        <el-menu-item index="/home" style="background-color:#001529">
          <template slot="title">
            <span>首页</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <!-- 一级菜单 -->
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-picture"></i>
          <span>轮播图</span>
        </template>
        <el-menu-item index="/banner/bannerlist">
          <template slot="title">
            <i class="el-icon-picture"></i>
            <span>首页轮播图</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="3">
        <template slot="title">
          <i class="el-icon- iconfont icon-leimupinleifenleileibie"></i>
          <span>分类管理</span>
        </template>
        <el-menu-item index="/category/categorylist">
          <template slot="title">
            <span>分类列表</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="4">
        <template slot="title">
          <i class="el-icon-goods"></i>
          <span>商品管理</span>
        </template>
        <el-menu-item index="/goods/goodslist">
          <template slot="title">
            <span>商品列表</span>
          </template>
        </el-menu-item>
        <el-menu-item index="/goods/goodsservice">
          <template slot="title">
            <span>商品服务</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="5">
        <template slot="title">
          <i class="el-icon- iconfont icon-shangjia"></i>
          <span>商家管理</span>
        </template>
        <el-menu-item index="/merchant/merchantlist">
          <template slot="title">
            <span>店铺列表</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="6">
        <template slot="title">
          <i class="el-icon- iconfont icon-quanxianguanli"></i>
          <span>权限管理</span>
        </template>
        <el-menu-item index="/auth/userlist">
          <template slot="title">
            <span>用户管理</span>
          </template>
        </el-menu-item>
      </el-submenu>

      <el-submenu index="7">
        <template slot="title">
          <i class="el-icon- iconfont icon-huodong"></i>
          <span>活动管理</span>
        </template>
        <el-menu-item index="/active/activelist">
          <template slot="title">
            <span>首页活动</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="8">
        <template slot="title">
          <i class="el-icon- iconfont icon-dingdanguanli"></i>
          <span>订单管理</span>
        </template>
        <el-menu-item index="/order/orderlist">
          <template slot="title">
            <span>订单列表</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapState } from "vuex";
export default {
  data() {
    return {
      // 是否折叠
      // isCollapse: false
    };
  },
  computed: {
    ...mapState({
      isCollapse: state => state.isCollapseMenu
    }),
    currentPath() {
      // 得到当前请求的路由路径
      const { path } = this.$route;
      let selectKey = path;
      if (selectKey.indexOf("/goods") === 0) {
        // 处理goods路由路径
        if (selectKey.indexOf("/goods/goodslist") === 0) {
          selectKey = "/goods/goodslist";
        } else if (selectKey.indexOf("/goods/goodsservice") === 0) {
          selectKey = "/goods/goodsservice";
        } else {
          selectKey = "/goods/goodslist";
        }
      } else if (selectKey.indexOf("/category") === 0) {
        // 处理category路由路径
        selectKey = "/category/categorylist";
      }
      return selectKey;
    }
  },
  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {}
  }
};
</script>

<style lang="scss" scoped>
.header {
  display: flex;
  align-items: center;
  padding: 0 20px;
  height: 64px;
  > h1 {
    font-size: 20px;
    color: #fff;
    margin-left: 15px;
  }
  img {
    width: 32px;
    height: 32px;
  }
}
.el-aside {
  background-color: #001529;
  .el-menu {
    border-right: none;
  }
}

.toggle-button {
  background-color: #40434d;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}

.el-menu-item {
  background-color: #000c17;
}
.el-menu-item.is-active {
  background-color: #409eff !important;
  color: #fff !important;
}

// .el-submenu.is-opened .el-menu-item:hover {
//   background-color: #409EFF !important;
//   color: #fff !important;
// }
</style>