<template>
  <el-aside :width="isCollapse ? '64px' : '200px'">
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <!-- 侧边栏菜单区域 -->
    <el-menu
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF"
      unique-opened
      :collapse="isCollapse"
      :collapse-transition="false"
      router
      :default-active="currentPath"
    >
      <!-- 一级菜单 -->
      <el-submenu index="1">
        <!-- 一级菜单的模板区域 -->
        <template slot="title">
          <i class="el-icon-s-home"></i>
          <span>首页</span>
        </template>
        <!-- 二级菜单 -->
        <el-menu-item index="/welcome">
          <template slot="title">
            <i class="el-icon-s-home"></i>
            <span>首页</span>
          </template>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <i class="el-icon-picture"></i>
          <span>轮播图</span>
        </template>
        <el-menu-item index="/banner">
          <template slot="title">
            <i class="el-icon-picture"></i>
            <span>首页轮播图</span>
          </template>
        </el-menu-item>
      </el-submenu>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  props: {
    currentPath: {
      type: String,
      value: ''
    }
  },
  data() {
    return {
      // 是否折叠
      isCollapse: false,
    };
  },

  methods: {
    toggleCollapse() {
      this.isCollapse = !this.isCollapse;
    },
    logout() {}
  },

  
};
</script>

<style lang="scss" scoped>
.el-aside {
  background-color: #333744;
  .el-menu {
    border-right: none;
  }
}

.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>