<template>
  <div>
    <h3>Welcome</h3>
  </div>
</template>

<script>
export default {
  mounted() {
    const token = window.sessionStorage.getItem('token');
    if(!token) {
      this.$router.replace('/login')
    }
  }
}
</script>
