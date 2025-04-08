<template>
  <!-- 头部容器，使用 flex 布局，将内容左右分布 -->
  <div class="header-container">
    <!-- 头部左侧区域，使用 flex 布局 -->
    <div class="header-left flex-box">
      <!-- 折叠菜单图标，点击时触发 store 中的 collapseMenu 方法 -->
      <el-icon class="icon" size="20" @click="store.commit('collapseMenu')">
        <!-- Fold 图标组件 -->
        <Fold />
      </el-icon>
      <!-- 菜单项列表，使用 flex 布局 -->
      <ul class="flex-box">
        <!-- 遍历 selectMenu 数组，生成菜单项 -->
        <!-- 根据当前路由路径判断是否为选中状态 -->
        <li 
          v-for="(item, index) in selectMenu"
          :key="item.path"
          :class="{selected: route.path == item.path}"
          class="tab flex-box">
          <!-- 菜单项图标 -->
          <el-icon  size="12"><component :is="item.icon" /></el-icon>
          <!-- 路由链接，点击后跳转到对应路径 -->
          <router-link class="text flex-box" :to="{path:item.path}">
            {{ item.name }}
          </router-link>
          <!-- 关闭菜单项图标，点击时触发 closeTab 方法 -->
          <el-icon size="12" class="close" @click="closeTab(item, index)"><Close /></el-icon>
        </li>
      </ul>
    </div>
    <!-- 头部右侧区域 -->
    <div class="header-right">
      <!-- 下拉菜单组件 -->
      <el-dropdown @command="handleClick">
        <!-- 下拉菜单触发区域，使用 flex 布局 -->
        <div class="el-dropdown-link flex-box">
          <!-- 用户头像 -->
          <el-avatar
            src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          />
          <!-- 用户名称 -->
          <p class="user-namea">admin</p>
        </div>
        <!-- 下拉菜单内容 -->
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command='logout'>退出</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup>
// 引入 Vue 的 computed 函数，用于创建计算属性
import { computed } from "vue";
// 引入 Vuex 的 useStore 函数，用于获取 store 实例
import { useStore } from "vuex";
// 引入 Vue Router 的 useRoute 和 useRouter 函数，分别用于获取当前路由信息和路由实例
import { useRoute, useRouter } from "vue-router";

// 获取当前路由信息
const route = useRoute();
// 获取 store 实例
const store = useStore();
// 创建计算属性 selectMenu，获取 store 中 menu 模块下的 selectMenu 状态
const selectMenu =  computed(() => store.state.menu.selectMenu);
// 获取路由实例
const router = useRouter();

// 关闭菜单项的方法
const closeTab = (item, index) => {
  // 提交 store 中的 closeMenu 方法，删除对应的菜单项
  store.commit("closeMenu", item);
  // 如果关闭的不是当前页面，则直接返回
  if(route.path != item.path) return;
  // 如果关闭的是当前页面
  const selectMenuData = selectMenu.value;
  // 如果关闭的是最后一个菜单项
  if(index === selectMenuData.length) {
    // 如果没有其他菜单项，跳转到根路径
    if(!selectMenuData.length) {
      router.push('/')
    } else {
      // 跳转到上一个菜单项的路径
      router.push({path:selectMenuData[index - 1].path})
    }
  } else {
    // 跳转到下一个菜单项的路径
    router.push({path:selectMenuData[index + 1].path})
  }
};

// 处理下拉菜单点击事件的方法
const handleClick = (command) => {
  // 提交 store 中的 logout 方法，进行退出登录操作
  if(command === 'logout') {
    localStorage.removeItem('pz_token')
    localStorage.removeItem('pz_userInfo')
    window.location.href = window.location.origin
  }
  store.commit("logout");
};

</script>

<style lang="less" scoped>
// 定义 flex 布局的公共类
.flex-box {
  display: flex;
  align-items: center;
  height: 100%;
}

// 头部容器样式
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  background-color: #fff;
  padding-right: 25px;

  // 头部左侧区域样式
  .header-left {
    height: 100%;

    // 折叠菜单图标样式
    .icon {
      width: 45px;
      height: 100%;
    }

    // 折叠菜单图标悬停样式
    .icon:hover {
      background-color: #f5f5f5;
      cursor: pointer;
    }

    // 菜单项样式
    .tab {
      height: 100%;
      padding: 0 10px;

      // 菜单项文本样式
      .text {
        margin: 0 5px;
      }

      // 关闭菜单项图标样式，默认隐藏
      .close {
        visibility: hidden;
      }

      // 选中菜单项样式
      &.selected {
        a {
          color: #409eff;
        }
        i {
          color: #409eff;
        }
        background-color: #f5f5f5;
      }
    }

    // 菜单项悬停样式
    .tab:hover {
      background-color: #f5f5f5;
      cursor: pointer;

      // 悬停时显示关闭菜单项图标
      .close {
        visibility: inherit;
        cursor: pointer;
        color: #000;
      }
    }
  }

  // 头部右侧区域样式
  .header-right {
    // 用户名称样式
    .user-namea {
      margin-left: 10px;
    }
  }

  // 路由链接样式
  a {
    height: 100%;
    color: #333;
    font-size: 15px;
  }
}
</style>