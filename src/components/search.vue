<template>
	<div class="search-container">
		<el-radio-group v-model="queryType">
			<el-radio :label="'deviceId'">设备号查询</el-radio>
			<el-radio :label="'userId'">用户号查询</el-radio>
		</el-radio-group>
		<el-input
			v-model="searchQuery"
			placeholder="请输入搜索内容"
			suffix-icon="ElIconSearch"
			@keyup.enter="handleSearch"
		>
			<template #append>
				<el-button @click="handleSearch">搜索</el-button>
			</template>
		</el-input>
	</div>
</template>

<script setup>
	import { ref } from "vue";

	const queryType = ref("deviceId");
	const searchQuery = ref("");

	const handleSearch = () => {
		if (queryType.value === "deviceId") {
			// 这里可以添加设备号查询的实际逻辑
			console.log("按设备号搜索，内容:", searchQuery.value);
		} else {
			// 这里可以添加用户号查询的实际逻辑
			console.log("按用户号搜索，内容:", searchQuery.value);
		}
	};
</script>

<style scoped>
	.search-container {
		background-color: white;
		padding: 16px;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}
</style>
