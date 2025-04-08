const state = {
  isCollapse: false,
  selectMenu:[]
}
const mutations = {
  collapseMenu(state) {
    state.isCollapse = !state.isCollapse
  },
  addMenu(state,payload) {
    if(state.selectMenu.findIndex(item => item.path === payload.path) === -1) {
      state.selectMenu.push(payload)
    }
  },
  closeMenu(state, payload) {
    // 找到点击数据的索引
    const index = state.selectMenu.findIndex(val => val.name === payload.name); 
    // 根据索引从selectMenu数组中移除对应的菜单项
    state.selectMenu.splice(index, 1);
  }
}
export default {
  state,
  mutations
}