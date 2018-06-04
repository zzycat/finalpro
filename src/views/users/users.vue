<template>
  <el-card class="box-card">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <el-row class="searchContainer">
      <el-col :span="24"><div class="grid-content bg-purple-dark">
        <el-input
          v-model="searchKey"
          placeholder="请输入内容"
          class="searchInput"
          clearable>
          <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
        </el-input>

        <el-button type="success" plain>添加用户</el-button>
      </div></el-col>
    </el-row>
    <!-- 表格 -->
    <el-table
      stripe
      border
      :data="tableData"
      style="width: 100%">
      <el-table-column
        type="index"
        width="50">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱"
        width="180">
      </el-table-column>
      <el-table-column
        prop="mobile"
        label="电话">
      </el-table-column>
      <el-table-column
        label="创建时间">
        <template slot-scope="scope">
          {{ scope.row.create_time | fmtDate('YYYY-MM-DD') }}
        </template>
      </el-table-column>
      <el-table-column
        label="用户状态">
        <template slot-scope="scope">
          <!-- 获取的是当前行的索引 ，从0开始 -->
          <!-- {{ scope.$index }} -->
          <!-- 获取的是当前行绑定的数据 对象 -->
          <!-- {{ scope.row }} -->
          <!-- {{ scope.row.mg_state }} -->
          <el-switch
            @change="handleChange(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
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
            type="success"
            icon="el-icon-check"
            size="mini"
            plain>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页组件 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6]"
      :page-size="pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      // 分页数据
      pagenum: 1,
      pagesize: 2,
      total: 0,
      // 搜索的数据
      searchKey: ''
    };
  },
  // 组件创建完毕，能够访问data中的成员
  created() {
    // 获取列表数据
    this.loadData();
  },
  methods: {
    // 开关状态改变的时候执行
    async handleChange(user) {
      // console.log(user);
      // 用不用自己手工来写token
      // 不用，因为loadData的时候，已经给this.$http.设置了请求头，携带了token
      const res = await this.$axios.put(`users/${user.id}/state/${user.mg_state}`);
      const data = res.data;
      if (data.meta.status === 200) {
        this.$message.success('用户状态修改成功');
      } else {
        this.$message.error('用户状态修改失败');
      }
    },
    // 搜索功能
    handleSearch() {
      // 让页码为1
      this.pagenum = 1;
      this.loadData();
    },
    // 分页使用的方法
    handleSizeChange(val) {
      // 当界面上选择每页多少条数据后执行
      this.pagesize = val;
      this.pagenum = 1;
      this.loadData();
      console.log(`每页 ${val} 条`);
    },
    handleCurrentChange(val) {
      // 当页码发生变化的时候执行
      // 修改当前页码，重新获取数据列表
      this.pagenum = val;
      this.loadData();
      console.log(`当前页: ${val}`);
    },
    // 获取列表数据
    async loadData() {
      // 获取登录以后的token
      const token = sessionStorage.getItem('token');
      // axios发送请求的时候需要携带token
      this.$http.defaults.headers.common['Authorization'] = token;

      const res = await this.$axios.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.searchKey}`);
      // 获取服务器返回的数据
      const data = res.data;
      if (data.meta.status === 200) {
        // 设置总共多少条数据
        this.total = data.data.total;

        this.tableData = data.data.users;
      } else {
        this.$message.error('获取数据失败');
      }
    }
  }
};
</script>

<style >
  .box-card {
    width: 100%;
    height: 100%;
  }
  .searchContainer {
    margin-top: 15px;
    margin-bottom: 15px;
  }
  .searchInput {
    width: 300px;
  }
</style>
