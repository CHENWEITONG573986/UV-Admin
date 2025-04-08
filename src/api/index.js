import request from "../utils/request";

// 获取验证码
export const getCode = (data) => {
	return request.post("/get/code", data);
};
// 注册用户
export const register = (data) => {
	return request.post("/user/auth", data);
};
// 登录
export const login = (data) => {
	return request.post("/login", data);
};
// 权限管理列表
export const authAdmin = (params) => {
	return request.get("/auth/admin", { params });
};
// 菜单权限数据
export const userGetMenu = () => {
	return request.get("/user/getmenu");
};
// 权限权限修改
export const userSetMenu = (data) => {
	return request.post("/user/setmenu", data);
};
// 菜单权限列表
export const menuList = (params) => {
	return request.get("/menu/list", { params });
};
// 权限下拉列表
export const menuSelectList = () => {
	return request.get("/menu/selectlist");
};
// 用户数据修改
export const updataUser = (data) => {
	return request.post("/user/updata", data);
};
// 紫外线数据读取
export const UVvalue = (data) => {
	return request.post("/UVvalue", data);
};
// 当前紫外线数据读取
export const getCurrentUV = (data) => {
	return request.get("/getCurrentUV", data);
};
