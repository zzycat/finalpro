<template>
    <el-card class="box-card">
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- searchbox -->
        <el-row class="searchContainer">
            <el-col :span="24">
                <div class="grid-content bg-purple-dark">
                    <el-input
                    v-model="query"
                    placeholder="请输入内容"
                    class="searchInput"
                    clearable>
                    <el-button @click="handleSearch" slot="append" icon="el-icon-search"></el-button>
                    </el-input>
                    <el-button type="success" plain>添加用户</el-button>
                </div>
            </el-col>
        </el-row>

        <!-- table -->
        <el-table
        stripe
        border
        :data="tableData"
        style="width: 100%">
        <el-table-column type='index' width='50'></el-table-column>
        <el-table-column prop="username" label="姓名" width="180"></el-table-column>
        <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
        <el-table-column prop="mobile" label="电话" width="180"></el-table-column>
        <el-table-column label="创建时间" width="180">
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
    <!-- pagenation -->
    <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagenum"
    :page-size="pagesize"
    layout="total, sizes, prev, pager, next, jumper"
    :page-sizes="[2, 4, 6]"
    :total="total">
    </el-pagination>
    </el-card>
</template>

<script>
export default {
    data(){
        return{
            tableData:[],
            pagenum:1,
            pagesize:2,
            total:0,
            query:''
        }
    },
    created(){
            this.loadData();
        },
    methods:{
         // edit data
        async handleChange(user){
            const res = await this.$axios.put(`users/${user.id}/state/${user.mg_state}`);
            // console.log('user.mg_state')
            const data = res.data;
            if(data.meta.status===200){
                this.$message.success('修改成功');
            }else{
                this.$message.error('修改失败');
            }
        },
        handleSearch(){
            this.pagenum = 1;
            this.loadData();
        },
        handleSizeChange(val){
            this.pagesize = val;
            this.pagenum = 1;
            this.loadData();
            console.log(`There are ${val} data in this page`)
        },
        handleCurrentChange(val){
            //execut when the current page is changed
            //change the current page and get the new data
            this.pagenum = val;
            this.loadData();
            console.log(`current page: ${val}`);
        },
        // 获取列表数据
        async loadData(){
            const token = sessionStorage.getItem('token');
            //axios发送请求需携带token
            this.$axios.defaults.headers.common['Authorization'] = token;
            const res = await this.$axios.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.query}`);
            // 获取服务器返回的数据
            const data = res.data;
            if(data.meta.status===200){
                this.total = data.data.total;
                this.tableData = data.data.users;
            }else{
                this.$message.error('No data.');
            }
        }
    }
};
</script>

<style scoped>
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