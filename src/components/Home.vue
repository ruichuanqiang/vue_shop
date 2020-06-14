<template>
  <div>
    <el-button type="info" @click="outLogin">退出登录</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    outLogin () {
      window.sessionStorage.clear()
      this.$router.push('/login')
    }
  }
}
</script>
<style lang="less" scope>

</style>
