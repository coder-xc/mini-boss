<template>
  <el-aside>
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
      @select="menuSelect"
    >
      <el-menu-item index="/home" style="background-color:#001529">
        <i class="el-icon-s-home"></i>
        <span slot="title">首页</span>
      </el-menu-item>
      <!-- 一级菜单 -->
      <el-submenu v-for="(item, index) in menuList" :key="index" :index="index.toString()">
        <template slot="title">
          <i :class="item.icon"></i>
          <span>{{ item.title }}</span>
        </template>
        <template v-if="item.children.length > 0">
          <el-menu-item v-for="(_item, _index) in item.children" :key="_index" :index="_item.key">
            <template slot="title">
              <i :class="_item.icon"></i>
              <span>{{ _item.title }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
import { mapState, mapGetters } from "vuex";
export default {
  data() {
    return {
      
    };
  },
  computed: {
    ...mapGetters(["sidebar"]),
    ...mapState({
      device: state => state.app.device,
      menus: state => state.adminUser.menus,
      menuList: state => state.authConfig.menuList
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
    },
    isCollapse() {
      return !this.sidebar.opened;
    }
  },

  created() {
    this.getconfig()
  },
  methods: {
    async getconfig() {
      await this.$store.dispatch("getThisUserAuth");
    },

    menuSelect() {
      if (this.device === "mobile") {
        this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
      }
    },
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
.sidebar-container {
  // width: 256px !important;
  background-color: #001529;
  // transform: translate(-256px, 0);
  transition: transform 0.28s;
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }

  .el-menu {
    border-right: none;
  }
}
.mobile {
  transform: none;
  height: 100%;
  position: fixed;
  font-size: 0;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
  transform: none;
}
.desktop {
  transform: none;
  position: unset;
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