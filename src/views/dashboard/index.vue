<template>
	<div class="map-container">
		<el-card>
			<template #header>
				<div class="card-header">地图展示</div>
			</template>
			<!-- 使用 ref 绑定地图容器 -->
			<div ref="mapRef" style="height: 400px"></div>
		</el-card>
	</div>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import * as echarts from "echarts";

	const mapRef = ref(null);

	onMounted(() => {
		// 初始化 ECharts 实例
		const myChart = echarts.init(mapRef.value);

		// 指定图表的配置项和数据
		const option = {
			geo: {
				map: "china",
				roam: true, // 开启鼠标缩放和平移漫游
				label: {
					show: true,
					color: "#000",
				},
				itemStyle: {
					areaColor: "#eee",
					borderColor: "#fff",
				},
				emphasis: {
					label: {
						show: true,
					},
					itemStyle: {
						areaColor: "#999",
					},
				},
			},
			series: [],
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	});
</script>

<style scoped>
	.map-container {
		padding: 16px;
		box-sizing: border-box;
	}

	.card-header {
		font-size: 18px;
		font-weight: bold;
	}
</style>
