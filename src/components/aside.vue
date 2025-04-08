<template>
  <el-menu
    :style="{ width: !isCollapse ?'230px':'64px' }"
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="aside-container"
    default-active="2"
    text-color="#fff"
    @open="handleOpen"
    @close="handleClose"
    :collapse="isCollapse"
  >
    <p class="logo-lg">{{ isCollapse ? '光盾' : '光盾守卫'}}</p>
    <ThreeMenu :index="1" :menuData="menuData" />
  </el-menu>
</template>

<script setup>
// 引入 Vue 的 reactive 和 computed 函数
// reactive 用于创建响应式对象，computed 用于创建计算属性
import { reactive, computed } from "vue";
// 引入自定义的三级菜单组件
import ThreeMenu from "./treeMenu.vue";
// 引入 Vue Router 的 useRouter 函数，用于获取路由实例
import { useRouter } from "vue-router";
// 引入 Vuex 的 useStore 函数，用于获取 store 实例
import { useStore } from "vuex";

// 获取路由实例
const router = useRouter();
// 使用 reactive 创建响应式对象 menuData，存储路由配置中第一个路由的子路由信息
const menuData = reactive(router.options.routes[0].children);
// 获取 store 实例
const store = useStore();
// 创建计算属性 isCollapse，从 store 中获取菜单是否折叠的状态
const isCollapse = computed(() => store.state.menu.isCollapse);

// 菜单项展开时的处理函数，打印展开菜单项的 key 和 keyPath
const handleOpen = (key, keyPath) => {
  console.log(key, keyPath);
};
// 菜单项关闭时的处理函数，打印关闭菜单项的 key 和 keyPath
const handleClose = (key, keyPath) => {
  console.log(key, keyPath);
};
</script>

<style lang="less" scoped>
.aside-container {
  height: 100%;
  .logo-lg {
    font-size: 20px;
    text-align: center;
    line-height: 50px;
    color: #fff;
  }
}
</style>
