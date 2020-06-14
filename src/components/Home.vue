<template>
  <el-container class="home_container">
    <el-header>
      <!-- 折叠按钮 -->
      <div class="collapse-btn">
        <i
          :class="!isCollapse ? 'el-icon-s-fold' : 'el-icon-s-unfold'"
          @click="toggleCollapse"
        ></i>
        <span>电商后台管理系统</span>
      </div>

      <el-button type="info" @click="outLogin">退出登录</el-button></el-header
    >

    <el-container>
      <el-aside :width="!isCollapse ? '250px' : '64px'">
        <el-menu
          background-color="#324157"
          text-color="#bfcbd9"
          active-text-color="#20a0ff"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
        >
          <el-submenu
            :index="item.id + ''"
            v-for="item of menuList"
            :key="item.id"
          >
            <template slot="title">
              <i :class="iconList[item.id]"></i>
              <span>{{ item.authName }}</span>
            </template>

            <el-menu-item
              :index="items.id + ''"
              v-for="items in item.children"
              :key="items.id"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ items.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [],
      iconList: {
        '125': 'iconfont icon-users',
        '103': 'iconfont icon-lock_fill',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },
      isCollapse: false
    }
  },
  created() {
    this.getMenuList()
  },
  methods: {
    outLogin() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
    async getMenuList() {
      const { data } = await this.$http.get('menus')
      if (data.meta.status === 200) {
        if (Array.isArray(data.data)) {
          this.menuList = data.data
        }
      } else {
        this.$message.error(data.meta.msg)
      }
    },
    toggleCollapse() {
      this.isCollapse = !this.isCollapse
    }
  }
}
</script>
<style lang="less" scope>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #242f42;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    i {
      cursor: pointer;
    }
    span {
      margin-left: 10px;
    }
  }
}
.el-aside {
  background-color: #324157;
  .el-menu {
    border-right: none;
  }
}
.el-main {
  background-color: #e9edf0;
}
</style>
