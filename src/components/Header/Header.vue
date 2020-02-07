<template>
  <el-header>
    <div>
      <img style="width:60px;height:60px" src="../../assets/logo.jpg" alt />
      <span>购物街后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$confirm("确定退出登录吗?", "退出登录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch('logout')
          this.$router.replace('/login')
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消退出"
          });
        });
    }
  }
};
</script>

<style lang="scss" scoped>
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
</style>