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
            //修改时是否显示对话框
            editUserFormVisible:false,
            editFormData:{
                username:'',
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
              },
              loading:true,
              roleFormVisible:false,
              selectedUser:{
                  username:'',
                  rid:-1
              },
              options:[],
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
            this.loading = true;
            const token = sessionStorage.getItem('token');
            //axios发送请求需携带token
            // this.$axios.defaults.headers.common['Authorization'] = token;
            const res = await this.$axios.get(`users?pagenum=${this.pagenum}&pagesize=${this.pagesize}&query=${this.query}`);
            this.loading = false;
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
            //先进行表单验证(同过$ref获取DOM对象)
            this.$refs.addUserForm.validate(async(valid)=>{
                if(!valid){
                    this.$message.error('Not complete yet!');
                    return;
                }
                //表单提交
                const res = await this.$axios.post('/users',this.addFormData);
                // console.log(res);

                if(res.data.meta.status === 201){
                    // 重新加载列表
                    this.loadData();
                    // 隐藏窗口
                    this.addUserFormVisible = false;
                    this.$message.success(res.data.meta.msg);
                }else{
                    this.$message.error(res.data.meta.msg);
                }
            })
        },
        //delete
        async handleDelete(user){
            this.$confirm('Are you sure you want to delete this user?', 'Warning!', {
                confirmButtonText:'Delete',
                cancelButtonText:'Cancel',
                type:'Warning'
            })
            .then(async()=>{
                const res = await this.$axios.delete(`/users/${user.id}`);
                // reload data after delete
                if(res.data.meta.status===200){
                    this.loadData();
                    this.$message.success('Deleted Successfully');
                }else{
                    this.$message.error('Deleted Failed');    
                }
            })
            .catch(()=>{
                this.$message.info('Cancelled')
            })
        },
        // get users' info
        async hangleGetInfo(user){
            this.editUserFormVisible= true;
            const res = await this.$axios.get(`/users/${user.id}`);
            this.editFormData = res.data.data;
        },
        async handleEdit(){
            this.editUserFormVisible = false;
            //get user's id
            const {id:userId} = this.editFormData;
            const res = await this.$axios.put(`/users/${userId}`,this.editFormData);
            if(res.data.meta.status===200){
                this.$message.success(res.data.meta.msg);
                this.loadData();
            }else{
                this.$message.error(res.data.meta.msg);
            }
        },
        async handleSetRole(){
            // 分析接口，调用接口发送请求
            const {data} = await this.$axios.put(`users/${this.selectedUser.id}/role`,{
                rid: this.selectedUser.rid
            });
            if(data.meta.status===200){
                this.roleFormVisible = false;
                this.$message.success('权限分配成功');
                // this.loadData();
            }else{
                this.$message.error('分配权限失败');
            }
        },
        // open the window
        async handleOpenSetRole(user){
            this.roleFormVisible = true;
            // record the userID
            this.selectedUser.id = user.id;
            this.selectedUser.username = user.username;
            //send request to get all roles
            const {data} = await this.$axios.get('roles');
            this.options = data.data;
            // 根据用户id请求对象，目的为了获取角色id
            const res = this.$axios.get(`user/${user.id}`);
            const data1 = res.data;
            // 获取当前用户id，设置下拉框默认值
            this.selectedUser.rid = data.data.rid;
        }
    }
};