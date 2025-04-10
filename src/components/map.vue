<template>
	<div class="map-container">
		<el-card>
			<template #header>
				<div class="card-header">地图定位展示</div>
			</template>
			<div id="map" style="height: 400px"></div>
		</el-card>
	</div>
</template>

<script setup>
	import { onMounted } from "vue";
	import * as L from "leaflet";

	onMounted(() => {
		const map = L.map("map").setView([0, 0], 2);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution:
				'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
			maxZoom: 18,
		}).addTo(map);

		// 模拟定位，这里可以替换为实际的定位逻辑
		const location = [30.274158, 120.155079];
		const marker = L.marker(location).addTo(map);
		marker.bindPopup("这是定位点").openPopup();
		map.setView(location, 13);
	});
</script>

<style scoped>
	.map-container {
		padding: 16px;
	}

	.card-header {
		font-size: 18px;
		font-weight: bold;
	}
</style>
