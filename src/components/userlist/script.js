export default {
    data(){
        return{
            tableData:[],
            pagenum:1,
            pagesize:2,
            total:0,
            query:'',
            //添加用户时对话框是否显示
            addUserFormVisible:false, 
            addFormData:{
                username:'',
                password:'',
                email:'',
                mobile:''
            },
            rules: {
                username: [
                  { required: true, message: '请输入用户名', trigger: 'blur' },
                  { min: 3, max: 8, message: '长度在 3 到 8 个字符', trigger: 'blur' }
                ],
                password: [
                  { required: true, message: '请输入密码', trigger: 'blur' },
                  { min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur' }
                ],
                email: [
                  { type: 'email', message: '邮箱地址格式不正确', trigger: 'blur' }
                ],
                mobile: [
                  { type: '', message: '请输入用户名', trigger: 'blur' }
                ]
              }
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
        },
        async handleAddUser(){
            //先进行表单验证
            this.$refs.addUserForm.validate(async(valid)=>{
                if(!valid){
                    return;
                }
                //表单提交
                const data = await this.$axios.post('/users',this.addFormData);
                if(data.data.meta.status === 201){
                    // 重新加载列表
                    this.loadData();
                    // 隐藏窗口
                    this.addUserFormVisible = false;
                    this.$message.success(data.data.meta.msg);
                }else{
                    this.$message.error(data.data.meta.msg);
                }
            })
        }
    }
};