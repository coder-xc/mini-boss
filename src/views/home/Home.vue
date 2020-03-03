<template>
  <div class="home">
    <el-container class="home-container">
      <Aside />
      <el-container class="inner-container" direction="vertical">
         <Header />
        <el-main>
         
          <div v-if="currentPath === '/home'" class="welcome">
            <h3>欢迎来到小程序商城后台管理系统</h3>
          </div>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Header from "components/Header/Header.vue";
import Aside from "components/Aside/Aside.vue";
export default {
  components: {
    Header,
    Aside
  },
  data() {
    return {
      
    };
  },
  computed: {
    currentPath() {
      return this.$route.path;
    }
  }
};
</script>




<style lang="scss" scoped>
.home,
.home-container {
  height: 100%;
}

.inner-container{
  height: 100%;
}

.welcome {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

// .iconfont {
//   margin-right: 10px;
// }

// .toggle-button {
//   background-color: #4a5064;
//   font-size: 10px;
//   line-height: 24px;
//   color: #fff;
//   text-align: center;
//   letter-spacing: 0.2em;
//   cursor: pointer;
// }
</style>