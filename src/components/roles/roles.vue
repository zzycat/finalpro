<template>
  <el-card class="box-card">
    <my-breadcrumb level1="权限管理" level2="角色列表"></my-breadcrumb>
    <el-row class="row">
      <el-col :span="24">
        <el-button>添加角色</el-button>
      </el-col>
    </el-row>

    <el-table
      height="500"
      :data="tableData"
      v-loading="loading"
      stripe
      border
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <!-- 展开之后，显示一级权限 -->
          <el-row
            class="level1"
            v-for="item in scope.row.children"
            :key="item.id">
            <el-col :span="4">
              <!-- 显示一级权限的名称 -->
              <el-tag
                @close="handleClose(scope.row, item)"
                closable>
                {{ item.authName }}
              </el-tag>
            </el-col>
            <el-col :span="20">
              <!-- 显示二、三级权限 -->
              <el-row
                v-for="item1 in item.children"
                :key="item1.id">
                <!-- 显示二级权限 -->
                <el-col :span="4">
                  <el-tag
                    @close="handleClose(scope.row, item1)"
                    type="success"
                    closable>
                    {{ item1.authName }}
                  </el-tag>
                </el-col>
                <!-- 显示三级权限 -->
                <el-col :span="20">
                  <el-tag
                    @close="handleClose(scope.row, item2)"
                    class="level3"
                    v-for="item2 in item1.children"
                    :key="item2.id"
                    closable
                    type="warning">
                    {{ item2.authName }}
                  </el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
          <!-- 如果当前角色没有权限的时候 -->
          <el-row v-if="scope.row.children.length === 0">
            <el-col :span="24">
              当前角色没有分配权限
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column
        type="index"
        width="40">
      </el-table-column>
      <el-table-column
        prop="roleName"
        label="角色名称"
        width="180">
      </el-table-column>
      <el-table-column
        prop="roleDesc"
        label="角色描述"
        width="180">
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            plain>
          </el-button>
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            plain>
          </el-button>
          <el-button
            @click="handleShowSetRightsDialog(scope.row)"
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightsDialogVisible">
      <el-tree
        ref="tree"
        default-expand-all
        show-checkbox
        :data="treeData"
        :props="defaultProps"
        node-key="id"
        :default-checked-keys="checkedKeys">
      </el-tree>

      <div slot="footer" class="dialog-footer">
        <el-button @click="setRightsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleSetRights">确 定</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      loading: true,
      setRightsDialogVisible: false,
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      // tree默认选中的节点的id
      checkedKeys: [],
      // 点击分配权限的时候，记录当前的角色
      currentRoleId: -1
    };
  },
  created() {
    this.loadData();
  },
  methods: {
    // 加载角色列表
    async loadData() {
      // 响应对象 res = { data, status }
      // 服务器返回的响应数据在 res.data
      // res.data = { data: [], meta: {} }
      const { data: resData } = await this.$axios.get('roles');
      const { data, meta } = resData;

      this.loading = false;
      if (meta.status === 200) {
        // 成功
        this.tableData = data;
      } else {
        this.$message.error(meta.msg);
      }
    },
    // 删除角色对应的权限
    async handleClose(role, rights) {
      // data是响应对象res的data属性，获取的是服务器返回的数据
      const { data: resData } = await this.$axios.delete(`roles/${role.id}/rights/${rights.id}`);

      const { data, meta } = resData;
      // const {meta} = data;
      if (meta.status === 200) {
        // 删除成功？
        this.$message.success('删除成功');
        // 重新绑定当前角色下的所有权限
        role.children = data;
      } else {
        // 删除失败
        this.$message.error(meta.msg);
      }
    },
    // 显示权限的对话框
    async handleShowSetRightsDialog(role) {
      // 获取当前的角色id，分配权限的时候使用
      this.currentRoleId = role.id;

      this.setRightsDialogVisible = true;
      // 获取tree的数据
      const { data: resData } = await this.$axios.get('rights/tree');
      const { data } = resData;
      this.treeData = data;

      // 获取当前角色的所有权限
      // role.children
      function getCheckedKeys(children) {
        const arr = [];
        (function fn(list) {
          list.forEach((item) => {
            arr.push(item.id);
            // 递归调用
            if (item.children) {
              fn(item.children);
            }
          });
        })(children);
        return arr;
      }
      this.checkedKeys = getCheckedKeys(role.children);
      // var arr = [];
      // // 权限的id，存储到checkedKeys
      // role.children.forEach((item1) => {
      //   // item1 一级权限对象
      //   arr.push(item1.id);

      //   // 遍历二级权限
      //   item1.children.forEach((item2) => {
      //     // item2 二级权限
      //     arr.push(item2.id);

      //     // 遍历三级权限
      //     item2.children.forEach((item3) => {
      //       // item3 三级权限
      //       arr.push(item3.id);
      //     });
      //   });
      // });
      // this.checkedKeys = arr;
    },
    // 设置当前角色的权限  roleId , rightsIds
    async handleSetRights() {
      // this.currentRoleId 当前角色的id
      // 调用tree内部封装的方法
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      const rightsIds = arr1.concat(arr2).join(',');
      // 发送请求
      const { data: resData } = await this.$axios.post(`roles/${this.currentRoleId}/rights`, {
        rids: rightsIds
      });

      if (resData.meta.status === 200) {
        this.$message.success('分配权限成功');
        this.setRightsDialogVisible = false;
        // 刷新
        this.loadData();
        // 其实，只要刷新当前角色的children属性就可以
      } else {
        this.$message.error(resData.meta.msg);
      }
    }
  }
};
</script>

<style scoped>
.row {
  margin-top: 15px;
  margin-bottom: 15px;
}
.level1 {
  margin-bottom: 15px;
}

.level3 {
  margin-right: 5px;
  margin-bottom: 5px;
}
</style>
