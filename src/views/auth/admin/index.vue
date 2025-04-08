<template>
    <panel-head />
    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />

        <el-table-column prop="permissions_id" label="所属组别">
            <template #default="scope">
                {{ getPermissionsName(scope.row.permissions_id) }}
            </template>
        </el-table-column>

        <el-table-column prop="email" label="邮箱" />

        <el-table-column prop="active" label="状态">
            <template #default="scope">
                <el-tag :type="scope.row.active ? 'success' : 'danger'">{{
                    scope.row.active ? "正常" : "失效"
                }}</el-tag>
            </template>
        </el-table-column>

        <el-table-column prop="join_time" label="创建时间">
            <template #default="scope">
                <div class="flex-box">
                    <el-icon><Clock /></el-icon>
                    <span style="margin-left: 10px">{{
                        scope.row.join_time
                    }}</span>
                </div>
            </template>
        </el-table-column>
        <el-table-column label="操作">
            <template #default="scope">
                <el-button type="primary" @click="open(scope.row)">
                    编辑
                </el-button>
            </template>
        </el-table-column>
    </el-table>
    <div class="pagination-info">
        <el-pagination
            v-model:current-page="paginationData.pageNum"
            :page-size="paginationData.pageSize"
            :background="false"
            size="small"
            layout="total, prev, pager, next"
            :total="tableData.total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
    </div>
    <el-dialog
        v-model="dialogFormVisable"
        :before-close="befreClose"
        title="添加权限"
        width="500"
    >
        <el-form
            ref="formRef"
            label-width="100px"
            label-position="left"
            :model="form"
            :rules="rules"
        >
            <el-form-item label="邮箱" prop="email">
                <el-input v-model="form.email"  />
            </el-form-item>
            <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username"  />
            </el-form-item>
            <el-form-item label="菜单权限" prop="permissions">
                <el-select
                    v-model="form.permissions"
                    placeholder="请选择菜单权限"
                    style="width: 240px"
                >
                    <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id"
                    >

                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="confirm(formRef)"
                    >确认</el-button
                >
            </div>
        </template>
    </el-dialog>
</template>

<script setup>
import { authAdmin, menuSelectList, updataUser } from "../../../api/index";
import { ref, reactive, onMounted } from "vue";
const options = ref([]);
const formRef = ref(null);
const dialogFormVisable = ref(false);

const paginationData = reactive({
    pageNum: 1,
    pageSize: 10,
});
// 列表数据
const tableData = reactive({
    list: [],
    total: 0,
});
const form = reactive({
    email: "",
    username: "",
    permissions: "",
    permissions_id: "",
});
const rules = reactive({
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
    permissions_id: [{ required: true, message: "请选择菜单权限", trigger: "change" }],
    email: [{ required: true, message: "请输入邮箱", trigger: "blur" }],
});

// 提交表单
const confirm = async(formRef)=>{
    if(!formRef) return; 
    await formRef.validate((valid,fields) => {
        if(valid) {
            const{name,email ,permissions_id }=form;
            updataUser({name,permissions_id,email}).then((data)=>{
                console.log(data);
                dialogFormVisable.value = false;
                getListData();})
        } else {
            console.log('error submit!',fields);
        }
    })
}

onMounted(() => {
    getListData();
    menuSelectList().then((data) => {
        options.value = data.data;
        console.log(data, "options");
    });
});
const getListData = () => {
    authAdmin(paginationData).then((data) => {
        console.log(data, "user");
        const { list, total } = data.data.data;
        tableData.list = list;
        tableData.total = total;
    });
}
// 根据权限id获取权限名称
const getPermissionsName = (id) => {
    const data = options.value.find((el) => el.id === id);
    return data ? data.name : "超级管理员";
};
const handleSizeChange = (val) => {
    paginationData.pageSize = val;
    getListData();
};

const handleCurrentChange = (val) => {
    paginationData.pageNum = val;
    getListData();
};

const beforeClose = (done) => {
    dialogFormVisable.value = false;
    done();
};
const open = (rowData) => {
    dialogFormVisable.value = true;
    Object.assign(form, {
        email: rowData.email,
        username: rowData.username,
        permissions_id: rowData.permissions_id,
    });
};
</script>
<style lang="less" scoped>
.flex-box {
    display: flex;
    align-items: center;
}
</style>
