<template>
  <div>
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
  </div>
</template>
<script>
import { mapState } from "vuex";
// import menuList from "@/config/menuConfig";
export default {
  computed: {
    ...mapState({
      user: state => state.adminUser.adminUser,
      menuList: state => state.authConfig.menuList
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
    /**
     * 获取 侧边栏 配置
     */
    this.getconfig();
  },
  methods: {
    async getconfig() {
      await this.$store.dispatch("getThisUserAuth");
    },
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
