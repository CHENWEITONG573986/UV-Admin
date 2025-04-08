<template>
    <panel-head />
    <div class="btns">
        <el-button 
            :icon="Plus" 
            type="primary" 
            @click="open(null)"
            size="small"
        >
            添加
        </el-button>
    </div>
    <el-table :data="tableData.list" style="width: 100%">
        <el-table-column prop="id" label="id" />
        <el-table-column prop="name" label="昵称" />
        <el-table-column
            prop="permissionsName"
            label="菜单权限"
            width="500px"
        />
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
            <el-form-item v-show="false" prop="id">
                <el-input v-model="form.id"></el-input>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input
                    v-model="form.name"
                    placeholder="请填写权限名称"
                ></el-input>
            </el-form-item>
            <el-form-item label="权限" prop="pemissions">
                <el-tree
                    ref="treeRef"
                    style="max-width: 600px"
                    :data="permissionData"
                    node-key="id"
                    show-checkbox
                    :default-checked-keys="defaultKeys"
                    :default-expanded-keys="[2]"
                />
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
import { ref, reactive, onMounted, nextTick } from "vue";
import { userGetMenu, userSetMenu, menuList } from "../../../api/index";
import { Plus } from "@element-plus/icons-vue";
const paginationData = reactive({
    pageNum: 1,
    pageSize: 10,
});

const handleSizeChange = (val) => {
    paginationData.pageSize = val;
    getListData();
};

const handleCurrentChange = (val) => {
    paginationData.pageNum = val;
    getListData();
};

// 列表数据
const tableData = reactive({
    list: [],
    total: 0,
});

const permissionData = ref([]);
const treeRef = ref(null);
onMounted(() => {
    userGetMenu().then(({ data }) => {
        if (data && data.data) {
            // 检查数据格式
            const isValidData = data.data.every(item => item.id);
            if (isValidData) {
                permissionData.value = data.data;
            } else {
                console.error('菜单数据格式不正确，每个节点需包含 id 字段');
            }
        } else {
            console.error('菜单数据加载失败:', data);
        }
    }).catch((error) => {
        console.error('获取菜单数据时发生错误:', error);
    });
    getListData();
});

// 权限数据

const formRef = ref(null);
// 打开弹窗
const open = async(rowData = {}) => {
    dialogFormVisable.value = true;
    //
    nextTick(() => {
        if (rowData) {
            Object.assign(form, { id: rowData.id, name: rowData.name });
             // 检查 rowData.permissions 是否存在
            if (rowData.permissions) {
                treeRef.value.setCheckedKeys(rowData.permissions);
            } else {
                console.error('rowData.permissions 为 undefined');
            }
            if (treeRef.value) {
                console.log(treeRef.value); 
            }else{
                console.log('treeRef.value 为 undefined'); 
            }
        }
    });
};

// 请求列表数据
const getListData = () => {
    menuList(paginationData).then(({ data }) => {
        const { list, total } = data.data;
        const isValidList = list.every(item => item.permissions);
        if (isValidList) {
            tableData.list = list;
            tableData.total = total;
        } else {
            console.error('列表数据中存在 permissions 为 undefined 的项');
        }
    });
};
// 表单数据
const form = reactive({
    name: "",
    permissions: [],
    id: 0,
});

// 控制弹窗是否显示
const dialogFormVisable = ref(false);
// 关闭前的回调
const befreClose = (done) => {
    dialogFormVisable.value = false;
    formRef.value.resetFields();
    nextTick(() => {
        if (treeRef.value) {
            treeRef.value.setCheckedKeys(defaultKeys);
        }
    });
};
const defaultKeys = [4, 5];


const rules = reactive({
    name: [{ required: true, message: "请输入名称", trigger: "blur" }],
});

// 表单提交
const confirm = async (formEl) => {
    if (!formEl) return;
    await formEl.validate((valid, fields) => {
        if (valid) {
            nextTick(() => {
                if (treeRef.value) {
                    const permissions = JSON.stringify(treeRef.value.getCheckedKeys());
                    userSetMenu({
                        name: form.name,
                        permissions: permissions,
                        id: form.id,
                    }).then(({ data }) => {
                        console.log(data);
                        befreClose();
                        getListData();
                    });
                }
            });
        } else {
            console.log("error submit!!", fields);
        }
    });
};
</script>

<style lang="less" scoped>
.btns {
    padding: 10px 0 10px 10px;
    background-color: #fff;
}
</style>
