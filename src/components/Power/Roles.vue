<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roleList" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 一级 -->
            <el-row
              :class="['bdbottom', index === 0 ? 'bdtop' : '', 'vcenter']"
              v-for="(item, index) in scope.row.children"
              :key="item.id"
            >
              <el-col :span="5">
                <el-tag closable @close="removeRightById(scope.row, item.id)">
                  {{ item.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级 -->
              <el-col :span="19">
                <el-row
                  v-for="(items, i) in item.children"
                  :key="items.id"
                  :class="[i === 0 ? '' : 'bdtop', 'vcenter']"
                >
                  <el-col :span="6">
                    <el-tag
                      closable
                      type="success"
                      @close="removeRightById(scope.row, items.id)"
                      >{{ items.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级 -->
                  <el-col :span="18">
                    <el-tag
                      closable
                      type="warning"
                      v-for="v in items.children"
                      :key="v.id"
                      @close="removeRightById(scope.row, v.id)"
                    >
                      {{ v.authName }}</el-tag
                    >
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"
              >编辑</el-button
            >
            <el-button size="mini" type="danger" icon="el-icon-delete"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-share"
              @click="showSetDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="分配权限" :visible.sync="setDialogVisible" width="50%">
      <el-tree
        :data="rightsList"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defaultCheckedKeys"
        ref="treeRef"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveSetDialogVisible"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  created() {
    this.getRoleList()
  },
  data() {
    return {
      roleList: [],
      rightsList: [],
      treeProps: {
        label: 'authName',
        children: 'children'
      },
      setDialogVisible: false,
      defaultCheckedKeys: [],
      roleId: ''
    }
  },
  methods: {
    async getRoleList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) return this.$message.errror('获取角色失败!')
      this.roleList = res.data
    },
    async removeRightById(row, id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除!')
      } else {
        const { data: res } = await this.$http.delete(
          `roles/${row.id}/rights/${id}`
        )
        if (res.meta.status !== 200) return this.$message.error('删除失败')
        // 解决删除操作更新整个表格造成关闭下拉框
        row.children = res.data
        this.$message.success('删除成功!')
      }
    },
    // 控制分配权限对话框
    async showSetDialog(row) {
      this.roleId = row.id
      this.defaultCheckedKeys = []
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) return this.$message.error('获取权限失败!')
      this.rightsList = res.data
      this.getCheckedId(row, this.defaultCheckedKeys)
      this.setDialogVisible = true
    },
    // 获取当前用户已有的权限
    getCheckedId(node, arr) {
      if (!node.children) {
        return arr.push(node.id)
      }
      node.children.forEach(item => this.getCheckedId(item, arr))
    },
    async saveSetDialogVisible() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        {
          rids: keys.join(',')
        }
      )
      if (res.meta.status !== 200) return this.$message.error('分配权限失败!')
      this.getRoleList()
      this.$message.success('分配权限成功!')
      this.setDialogVisible = false
    }
  }
}
</script>
<style lang="less" scope>
.el-tag {
  margin: 7px;
}
.bdtop {
  border-top: 1px solid #eee;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.vcenter {
  display: flex;
  align-items: center;
}
</style>