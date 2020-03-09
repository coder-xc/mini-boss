<template>
  <div class="home">
    <el-container class="home-container" :class="classObj">
      <div v-if="device==='mobile'&&sidebar.opened" class="drawer-bg" @click="handleClickOutside" />
      <Aside class="sidebar-container" />
      <el-container class="inner-container main-container" direction="vertical">
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
import { mapState } from "vuex";
import Header from "components/Header/Header.vue";
import Aside from "components/Aside/Aside.vue";
import ResizeMixin from "@/mixins/ResizeHandle";
export default {
  components: {
    Header,
    Aside
  },
  mixins: [ResizeMixin],
  data() {
    return {};
  },
  computed: {
    ...mapState({
      sidebar: state => state.app.sidebar,
      device: state => state.app.device
    }),
    currentPath() {
      return this.$route.path;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        mobile: this.device === "mobile"
      };
    }
  },
  methods: {
    handleClickOutside() {
      this.$store.dispatch("app/closeSideBar", { withoutAnimation: false });
    }
  }
};
</script>




<style lang="scss" scoped>
.home,
.home-container {
  height: 100%;
}
.home-container {
  .drawer-bg {
    background: #000;
    opacity: 0.3;
    width: 100%;
    top: 0;
    height: 100%;
    position: absolute;
    z-index: 999;
  }
}

.inner-container {
  height: 100%;
}

.welcome {
  display: flex;
  height: 100%;
  justify-content: center;
  align-items: center;
  font-size: 40px;
}

// .hideSidebar {
//   .sidebar-container {
//     width: 64px !important;
//   }
// }
</style>