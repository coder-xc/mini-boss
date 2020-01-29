<template>
  <div class="home">
    <el-container direction="vertical" class="home-container">
      <Header />
      <el-container>
        <Aside :currentPath="currentPath" />
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>



<script>
  import Header from "../../components/Header/Header.vue";
  import Aside from "../../components/Aside/Aside.vue";
  export default {
    components: {
      Header,
      Aside
    },
    data() {
      return {
        currentPath: this.$route.path,
      };
    },
  }
</script>




<style lang="scss" scoped>
  .home, .home-container {
    height: 100%;
  }
  .el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
    padding-left: 0;
    align-items: center;
    color: #fff;
    font-size: 20px;
    > div {
      display: flex;
      align-items: center;
      span {
        margin-left: 15px;
      }
    }
  }

  .el-aside {
    background-color: #333744;
    .el-menu {
      border-right: none;
    }
  }

  .el-main {
    background-color: #eaedf1;
  }

  .iconfont {
    margin-right: 10px;
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