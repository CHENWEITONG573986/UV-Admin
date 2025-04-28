<template>
	<div class="map-container">
		<div class="map-header">
			<h3>设备位置</h3>
			<div class="map-controls">
				<el-switch
					v-model="showTraffic"
					active-text="交通流量"
					@change="toggleTrafficLayer"
				></el-switch>
				<el-switch
					v-model="showSatellite"
					active-text="卫星图层"
					@change="toggleSatelliteLayer"
				></el-switch>
			</div>
		</div>
		<div id="amap-container" class="amap-container"></div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			map: null,
			marker: null,
			infoWindow: null,
			trafficLayer: null,
			satelliteLayer: null,
			showTraffic: true,
			showSatellite: false,
		};
	},
	mounted() {
		// 动态加载高德地图脚本
		this.loadAMapScript().then(() => {
			this.initMap();
		});
	},
	watch: {
		deviceLocation: {
			handler(newVal) {
				if (this.map && this.marker) {
					this.updateDeviceLocation(newVal.longitude, newVal.latitude);
				}
			},
			deep: true
		}
	},
	props: {
		deviceLocation: {
			type: Object,
			default: () => ({
				longitude: 116.397428,
				latitude: 39.90923,
			}),
		},
	},
	methods: {
		// 加载高德地图脚本
		loadAMapScript() {
			return new Promise((resolve, reject) => {
				if (window.AMap) {
					resolve();
					return;
				}

				const script = document.createElement("script");
				script.type = "text/javascript";
				// 高德地图API密钥，加载完整的UI库和插件库
				script.src = "https://webapi.amap.com/maps?v=2.0&key=8757059bc21b0fe613058c7ebbc82239&plugin=AMap.Scale,AMap.ToolBar,AMap.MapType,AMap.HawkEye,AMap.Geolocation,AMap.TileLayer.Traffic";
				script.onerror = reject;
				script.onload = () => {
					// 加载UI库
					const uiScript = document.createElement("script");
					uiScript.type = "text/javascript";
					uiScript.src = "https://webapi.amap.com/ui/1.1/main.js?v=1.1.1";
					uiScript.onerror = reject;
					uiScript.onload = resolve;
					document.head.appendChild(uiScript);
				};
				document.head.appendChild(script);
			});
		},
		
		// 初始化地图
		initMap() {
			try {
				// 创建地图实例
				this.map = new AMap.Map('amap-container', {
					zoom: 13,  // 初始缩放级别
					center: [this.deviceLocation.longitude, this.deviceLocation.latitude],  // 初始中心点坐标
					viewMode: '3D',  // 设置地图为3D模式
					mapStyle: 'amap://styles/normal',  // 设置地图样式
					resizeEnable: true,  // 是否监控地图容器尺寸变化
				});

				// 添加标准图层
				const standardLayer = new AMap.TileLayer();
				
				// 添加实时交通图层
				this.trafficLayer = new AMap.TileLayer.Traffic({
					zIndex: 10,
					opacity: 0.7,
				});
				
				// 根据初始状态添加图层
				const layers = [standardLayer];
				
				if (this.showTraffic) {
					layers.push(this.trafficLayer);
				}
				
				if (this.showSatellite) {
					this.satelliteLayer = new AMap.TileLayer.Satellite();
					layers.push(this.satelliteLayer);
				}
				
				// 将图层添加到地图
				this.map.add(layers);

				// 添加地图控件
				// 工具条控件
				this.map.addControl(new AMap.ToolBar());
				// 比例尺控件
				this.map.addControl(new AMap.Scale());
				// 地图类型切换控件
				this.map.addControl(new AMap.MapType({
					defaultType: 0, // 默认显示普通地图
					showRoad: true, // 显示路网
				}));

				// 创建标记
				this.marker = new AMap.Marker({
					position: [this.deviceLocation.longitude, this.deviceLocation.latitude],
					title: '设备位置',
					icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_b.png',
					// 设置标记动画效果
					animation: 'AMAP_ANIMATION_BOUNCE',
					// 设置标记可拖拽
					draggable: true,
				});

				// 将标记添加到地图
				this.map.add(this.marker);

				// 添加信息窗体
				this.infoWindow = new AMap.InfoWindow({
					content: `<div style="padding:10px;">
						<h4 style="margin:0 0 5px 0;">设备位置信息</h4>
						<p style="margin:0;">经度: ${this.deviceLocation.longitude}</p>
						<p style="margin:0;">纬度: ${this.deviceLocation.latitude}</p>
					</div>`,
					offset: new AMap.Pixel(0, -30),
				});

				// 绑定标记点击事件
				this.marker.on('click', () => {
					this.infoWindow.open(this.map, this.marker.getPosition());
				});

				// 地图加载完成事件
				this.map.on('complete', () => {
					console.log('地图加载完成');
				});

			} catch (error) {
				console.error('地图初始化失败:', error);
			}
		},
		
		// 更新设备位置
		updateDeviceLocation(longitude, latitude) {
			if (!this.map || !this.marker) return;
			
			const position = [longitude, latitude];
			this.marker.setPosition(position);
			this.map.setCenter(position);
			
			// 更新信息窗体内容
			if (this.infoWindow) {
				this.infoWindow.setContent(`<div style="padding:10px;">
					<h4 style="margin:0 0 5px 0;">设备位置信息</h4>
					<p style="margin:0;">经度: ${longitude}</p>
					<p style="margin:0;">纬度: ${latitude}</p>
				</div>`);
			}
		},
		
		// 切换交通流量图层
		toggleTrafficLayer(value) {
			if (!this.map || !this.trafficLayer) return;
			
			if (value) {
				this.map.add(this.trafficLayer);
			} else {
				this.map.remove(this.trafficLayer);
			}
		},
		
		// 切换卫星图层
		toggleSatelliteLayer(value) {
			if (!this.map) return;
			
			if (value) {
				if (!this.satelliteLayer) {
					this.satelliteLayer = new AMap.TileLayer.Satellite();
				}
				this.map.add(this.satelliteLayer);
			} else if (this.satelliteLayer) {
				this.map.remove(this.satelliteLayer);
			}
		},
	},
	beforeUnmount() {
		// 销毁地图实例
		if (this.map) {
			this.map.destroy();
		}
	},
};
</script>

<style scoped>
.map-container {
	background: white;
	padding: 1.5rem;
	border-radius: 15px;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	margin-bottom: 2rem;
}

.map-header {
	margin-bottom: 1rem;
	display: flex;
	justify-content: space-between;
	align-items: center;
}

.map-header h3 {
	font-size: 1.5rem;
	color: #2c3e50;
	margin: 0;
}

.map-controls {
	display: flex;
	gap: 1rem;
}

.amap-container {
	width: 100%;
	height: 400px;
	border-radius: 8px;
	overflow: hidden;
	position: relative;
	z-index: 1;
}

/* 确保高德地图控件正确显示 */
.amap-logo, .amap-copyright {
	opacity: 0.8 !important;
}
</style>