<template>
	<div class="dashboard">
		<!-- 当前数据显示模块 -->
		<div class="current-data-card">
			<div class="uv-value">
				<h2>{{ currentUVInt }}</h2>
				<p>紫外线强度</p>
			</div>
			<div class="risk-level" :style="riskLevelStyle">
				<h3>{{ riskLevel }}</h3>
				<p>风险等级</p>
			</div>
		</div>

		<!-- 图表容器 -->
		<div class="chart-container">
			<div class="combined-charts">
				<!-- 紫外线强度图表 -->
				<div class="chart-item">
					<div
						id="uv-line-chart"
						style="width: 100%; height: 600px"
					></div>
				</div>

				<!-- 风险等级图表 -->
				<div class="chart-item">
					<div
						id="risk-pie-chart"
						style="width: 100%; height: 600px"
					></div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as echarts from "echarts";
	import { UVvalue, getCurrentUV } from "../api/index";

	export default {
		data() {
			return {
				uvIntensityData: [],
				riskLevelData: [],
				currentUVValue: 0,
			};
		},
		computed: {
			currentUV() {
				return this.currentUVValue;
			},
			currentUVInt() {
				return Math.round(this.currentUVValue);
			},
			riskLevel() {
				const intensity = this.currentUV;
				if (intensity < 50) return "无风险";
				else if (intensity < 408) return "低风险";
				else if (intensity < 696) return "中风险";
				else if (intensity < 1170) return "高风险";
				else return "极高风险";
			},
			riskLevelStyle() {
				const intensity = this.currentUV;
				if (intensity < 50) return { backgroundColor: "#3498db" };
				else if (intensity < 408) return { backgroundColor: "#2ecc71" };
				else if (intensity < 696) return { backgroundColor: "#f1c40f" };
				else if (intensity < 1170)
					return { backgroundColor: "#e74c3c" };
				else return { backgroundColor: "#9b59b6" };
			},
		},
		mounted() {
			this.fetchCurrentUV();
			this.fetchData();
		},
		methods: {
			async fetchCurrentUV() {
				try {
					const response = await getCurrentUV();
					const { code, data, message } = response.data;
					if (code === 200) {
						this.currentUVValue = data.uvValue;
					} else {
						console.error("请求当前紫外线强度失败:", message);
					}
				} catch (error) {
					console.error("获取当前紫外线强度失败:", error);
				}
			},
			async fetchData() {
				try {
					// 固定请求当天的数据
					const response = await UVvalue({
						selected_date: "today",
					});
					const { code, data, message } = response.data;
					if (code === 200) {
						this.uvIntensityData = data.uvIntensityData;
						this.riskLevelData = data.riskLevelData;
						this.renderCharts();
					} else {
						console.error("请求失败:", message);
					}
				} catch (error) {
					console.error("获取数据失败:", error);
				}
			},
			renderCharts() {
				const uvChart = echarts.init(
					document.getElementById("uv-line-chart")
				);
				const riskChart = echarts.init(
					document.getElementById("risk-pie-chart")
				);

				const uvOption = {
					title: {
						text: `紫外线强度随时间变化折线图 (今日)`,
					},
					tooltip: { trigger: "axis" },
					xAxis: {
						type: "category",
						data: this.uvIntensityData.map((item) => item[0]),
					},
					yAxis: { type: "value" },
					series: [
						{
							data: this.uvIntensityData.map((item) => item[1]),
							type: "line",
							smooth: true,
							areaStyle: {},
						},
					],
				};

				const riskOption = {
					title: {
						text: `紫外线风险等级时间占比饼状图 (今日)`,
					},
					tooltip: {
						trigger: "item",
						formatter: "{a} <br/>{b}: {c} ({d}%)",
					},
					series: [
						{
							name: "风险等级占比",
							type: "pie",
							radius: "50%",
							data: this.riskLevelData.map((item) => ({
								value: item[1],
								name: item[0],
							})),
						},
					],
				};

				uvChart.setOption(uvOption);
				riskChart.setOption(riskOption);

				window.addEventListener("resize", () => {
					uvChart.resize();
					riskChart.resize();
				});
			},
		},
	};
</script>

<style scoped>
	.dashboard {
		display: grid;
		grid-template-columns: 1fr;
		gap: 2rem;
		padding: 2rem;
		background-color: #f0f2f5;
		min-height: 100vh;
	}

	.current-data-card {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
		gap: 2rem;
		background: white;
		padding: 2rem;
		border-radius: 15px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
		min-height: auto;
	}

	.uv-value,
	.risk-level {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		border-radius: 10px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
		transition: transform 0.3s ease;
	}

	.uv-value:hover,
	.risk-level:hover {
		transform: translateY(-5px);
	}

	.uv-value h2 {
		font-size: 3.5rem;
		font-weight: 700;
		color: #2c3e50;
		margin-bottom: 0.5rem;
	}

	.uv-value p {
		font-size: 1.2rem;
		color: #7f8c8d;
	}

	.risk-level {
		color: white;
		text-align: center;
	}

	.risk-level h3 {
		font-size: 2.5rem;
		margin-bottom: 0.5rem;
	}

	.risk-level p {
		font-size: 1.2rem;
	}

	.chart-container {
		background: white;
		padding: 1.5rem;
		border-radius: 15px;
		box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
	}

	.combined-charts {
		display: flex;
		gap: 2rem;
		margin-bottom: 1rem;
	}

	.chart-item {
		flex: 1;
	}

	.button-group {
		display: flex;
		gap: 0.5rem;
		justify-content: center;
		margin-top: 1rem;
	}

	.button-group button {
		padding: 8px 16px;
		font-size: 14px;
		border: none;
		border-radius: 4px;
		background-color: #3498db;
		color: white;
		cursor: pointer;
		transition: background-color 0.3s ease;
	}

	.button-group button:hover {
		background-color: #2980b9;
	}

	@media (max-width: 768px) {
		.current-data-card {
			grid-template-columns: 1fr;
		}
		.uv-value h2 {
			font-size: 2.5rem;
		}
		.risk-level h3 {
			font-size: 2rem;
		}
		.combined-charts {
			flex-direction: column;
		}
	}
</style>
