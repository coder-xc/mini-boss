<template>
  <div>
    <el-menu-item index="/home" style="background-color:#001529">
      <i class="el-icon-s-home"></i>
      <span slot="title">首页</span>
    </el-menu-item>
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
    <el-submenu index="9">
      <template slot="title">
        <i class="el-icon- iconfont icon-ziyuan"></i>
        <span>评论管理</span>
      </template>
      <el-menu-item index="/comment/commentlist">
        <template slot="title">
          <span>评论列表</span>
        </template>
      </el-menu-item>
    </el-submenu>
  </div>
</template>
<script>
import { mapState } from "vuex";
import menuList from "@/config/menuConfig";
export default {
  computed: {
    ...mapState({
      user: state => state.adminUser.adminUser
    })
  },
  props: {
    menus: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  data() {
    return {
      newMenus: []
    };
  },
  watch: {
    menus() {}
  },
  created() {
    this.newMenus = menuList.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          pre.push(item);
        }
      }

      return pre;
    }, []);
    console.log(this.newMenus)
  },
  methods: {
    hasAuth(item) {
      const user = this.user;
      const menus = this.menus;
      // 1. 如果当前用户是1440407551
      // 2. 当前用户有此item权限
      if (user.username === "1440407551" || menus.indexOf(item.key) !== -1) {
        return true;
      }
      // 如果当前用户有item的某个子节点的权限, 当前item也应该显示
      if (item.children) {
        const cItem = item.children.find(
          cItem => menus.indexOf(cItem.key) !== -1
        );
        if (cItem) {
          return !!cItem;
        }
      }
      return false;
    }
  }
};
</script>
