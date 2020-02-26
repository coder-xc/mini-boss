<template>
  <div id="app">
    <!-- 路由占位符 -->
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
</style>

<script>
import { mapState } from "vuex";
export default {
  name: "app",

  mounted() {
    if (this.token) {
      this.$store.dispatch("saveUser");
    } else {
      this.$router.replace("/login");
    }
  },
  computed: {
    ...mapState({
      token: state => state.adminUser.token
    })
  },
  
};
</script>