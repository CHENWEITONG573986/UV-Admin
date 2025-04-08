<template>
    <!-- 使用 Element Plus 的 el-row 组件创建一个登录容器，水平居中并垂直居中 -->
    <el-row class="login-container" justify="center" :align="'middle'">
        <!-- 使用 Element Plus 的 el-card 组件创建一个卡片，最大宽度为 480px -->
        <el-card style="max-width: 480px">
            <!-- 定义卡片的头部内容 -->
            <template #header>
                <div class="card-header">
                    <!-- 动态绑定图片的 src 属性，图片路径通过 imgUrl 变量获取 -->
                    <img :src="imgUrl" alt="" />
                </div>
            </template>
            <!-- 跳转链接区域，使用 Element Plus 的 el-link 组件 -->
            <div class="jump-link">
                <el-link type="primary" @click="handChange">{{
                    // 根据 formType 的值显示不同的文本，点击时调用 handChange 方法
                    formType ? "返回登录" : "注册账号"
                }}</el-link>
            </div>
            <!-- 使用 Element Plus 的 el-form 组件创建表单，绑定表单数据到 loginForm -->
            <el-form
                v-if="!formType"
                ref="loginFormRef"
                :model="loginForm"
                style="max-width: 600px"
                class="demo-ruleForm"
                :rules="rules"
            >
                <!-- 表单项目，对应用户名输入框 -->
                <el-form-item prop="userName">
                    <!-- 使用 Element Plus 的 el-input 组件创建输入框，绑定输入值到 loginForm.userName -->
                    <el-input
                        v-model="loginForm.username"
                        placeholder="用户名"
                        prefix-icon="UserFilled"
                    ></el-input>
                </el-form-item>
                <!-- 表单项目，对应密码输入框 -->
                <el-form-item prop="passWord">
                    <!-- 使用 Element Plus 的 el-input 组件创建密码输入框，绑定输入值到 loginForm.passWord -->
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="密码"
                        prefix-icon="Lock"
                    ></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        :style="{ width: '100%' }"
                        @click="submitFrom(loginFormRef)"
                    >
                        {{ "登录" }}
                    </el-button>
                </el-form-item>
            </el-form>
            <el-form
                v-if="formType"
                ref="registerFormRef"
                :model="loginForm"
                style="max-width: 600px"
                class="demo-ruleForm"
                :rules="rules"
            >
                <!-- 表单项目，对应用户名输入框 --><!-- 表单项目，对应用户名输入框 -->
                <el-form-item prop="email">
                    <!-- 使用 Element Plus 的 el-input 组件创建输入框，绑定输入值到 loginForm.userName -->
                    <el-input
                        v-model="loginForm.email"
                        placeholder="邮箱"
                        prefix-icon="Message"
                    ></el-input>
                </el-form-item>
                <!-- 表单项目，对应用户名输入框 -->
                <el-form-item prop="userName">
                    <!-- 使用 Element Plus 的 el-input 组件创建输入框，绑定输入值到 loginForm.userName -->
                    <el-input
                        v-model="loginForm.username"
                        placeholder="用户名"
                        prefix-icon="UserFilled"
                    ></el-input>
                </el-form-item>
                <!-- 表单项目，对应密码输入框 -->
                <el-form-item prop="passWord">
                    <!-- 使用 Element Plus 的 el-input 组件创建密码输入框，绑定输入值到 loginForm.passWord -->
                    <el-input
                        v-model="loginForm.password"
                        type="password"
                        placeholder="密码"
                        prefix-icon="Lock"
                    ></el-input>
                </el-form-item>
                <!-- 当 formType 为真时显示的表单项目，对应验证码输入框 -->
                <el-form-item prop="validCode">
                    <!-- 使用 Element Plus 的 el-input 组件创建输入框，绑定输入值到 loginForm.validCode -->
                    <el-input
                        v-model="loginForm.captcha"
                        placeholder="验证码"
                        prefix-icon="Lock"
                    >
                        <!-- 定义输入框的追加内容，点击时调用 countdownChange 方法 -->
                        <template #append>
                            <span @click="countdownChange">{{
                                countdown.validText
                            }}</span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button
                        type="primary"
                        :style="{ width: '100%' }"
                        @click="submitFrom(registerFormRef)"
                    >
                        {{ "注册" }}
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </el-row>
</template>

<script setup>
// 引入 Element Plus 的消息提示组件
import { ElMessage } from "element-plus";
// 引入 Vue 的 ref 和 reactive 函数
import { ref, reactive } from "vue";
import { getCode,register,login } from "../../api/index";
import { Lock, UserFilled, Message } from "@element-plus/icons-vue";
import { useRouter } from 'vue-router'
// 获取图片的完整 URL，使用 import.meta.url 确保路径的正确性
const imgUrl = new URL("../../../public/login-head.png", import.meta.url).href;
const router = useRouter();
// 使用 reactive 创建响应式对象 loginForm，存储表单数据
const loginForm = reactive({
    username: "",
    email: "",
    password: "",
    captcha: "",
});
const loginFormRef = ref(null);
const registerFormRef = ref(null);
// 使用 ref 创建响应式变量 formType，用于切换表单类型
const formType = ref(0);
// 切换表单类型的方法
const handChange = () => {
    // 切换 formType 的值
    formType.value = formType.value ? 0 : 1;
};

const validateEmail = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入邮箱"));
    } else {
        const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        emailReg.test(value) ? callback() : callback(new Error("邮箱格式有误"));
    }
};

const validateUser = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入账号"));
    } else {
        const phoneReg =
            /^[a-zA-Z0-9_]{3,20}$/;
        phoneReg.test(value)
            ? callback()
            : callback(new Error("用户名格式有误"));
    }
};

const validatePass = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入密码"));
    } else {
        const passReg = /^[a-zA-Z0-9_-]{4,16}$/;
        passReg.test(value) ? callback() : callback(new Error("密码格式有误"));
    }
};
const validateCode = (rule, value, callback) => {
    if (value === "") {
        callback(new Error("请输入验证码"));
    } else {
        const passReg = /^[a-zA-Z0-9_-]{4}$/;
        passReg.test(value) ? callback() : callback(new Error("密码格式有误"));
    }
}

// 定义表单验证规则
const rules = reactive({
    email: [{ validator: validateEmail, trigger: "blur" }],
    username: [{ validator: validateUser, trigger: "blur" }],
    password: [{ validator: validatePass, trigger: "blur" }],
    captcha: [{ validator: validateCode, trigger: "blur" }],
});

// 使用 reactive 创建响应式对象 countdown，存储验证码倒计时相关信息
const countdown = reactive({
    validText: "获取验证码",
    time: 60,
});
// 标志位，用于防止重复点击获取验证码
let flag = false;
// 定时器 ID
let timer;

// 验证码倒计时方法
const countdownChange = () => {
    // 如果标志位为真，说明正在倒计时，直接返回
    if (flag) return;
    // 手机号正则表达式
    const emailReg = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    // 检查用户名（手机号）是否为空
    if (!loginForm.email) {
        // 显示警告消息
        return ElMessage({
            message: "请输入邮箱",
            type: "warning",
        });
    }
    // 检查手机号格式是否正确
    if (!emailReg.test(loginForm.email)) {
        // 显示警告消息
        return ElMessage({
            message: "邮箱格式有误",
            type: "warning",
        });
    }
    // 设置标志位为真，防止重复点击
    flag = true;
    // 调用获取验证码的接口
    getCode({ tel: loginForm.email }).then(({ data }) => {
        ElMessage({
            message: "发送成功",
            type: "success",
        });
    });
    // 启动倒计时定时器
    timer = setInterval(() => {
        // 如果倒计时时间大于 0
        if (countdown.time > 0) {
            // 时间减 1
            countdown.time--;
            // 更新显示的文本为剩余时间
            countdown.validText = `${countdown.time}`;
        } else {
            // 倒计时结束，重置时间和显示文本
            countdown.time = 60;
            countdown.validText = "获取验证码";
            flag = false;
            clearInterval(timer);
        }
    }, 1000);
};

const submitFrom = async (formEl) => {
    if (!formEl) {console.log(loginForm, "submit!"); return};
    try {
        // 使用 await 等待表单校验完成
        await formEl.validate();
        console.log(loginForm, "submit!");
        // 这里可以添加实际的提交逻辑，比如调用接口
        // 注册页面
        if(formType.value) {
            register(loginForm).then(({data}) => {
                console.log(data);
                if(data.code === 200) {
                    ElMessage({
                        message: "注册成功",
                        type: "success",
                    });
                    handChange();
                }
            })
        }
        // 登录页面
        else {
            login(loginForm).then(({data}) => {
                if(data.code === 200) {
                    ElMessage.success("登录成功");
                    console.log(data);
                    localStorage.setItem("pz_token", data.data.token);
                    localStorage.setItem("pz_userInfo", JSON.stringify(data.data.userInfo));
                    router.push("/");
                }
            })
        }
    } catch (error) {
        console.log("error submit!", error);
    }
};
</script>

<style lang="less" scoped>
:deep(.el-card__header) {
    padding: 0;
}
.login-container {
    height: 100%;
    .card-header {
        background-color: #899fe1;
        img {
            width: 430px;
        }
    }
    .jump-link {
        text-align: right;
        margin-bottom: 10px;
    }
}
</style>