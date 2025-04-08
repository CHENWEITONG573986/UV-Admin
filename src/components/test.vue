<template>
	<el-card class="dashboard-card">
		<div class="dashboard-container">
			<div class="gauge-wrapper" ref="uvRef">
				<div class="gauge-chart"></div>
				<div class="gauge-name">紫外线等级</div>
			</div>
			<div class="gauge-wrapper" ref="tempRef">
				<div class="gauge-chart"></div>
				<div class="gauge-name">温度</div>
			</div>
			<div class="gauge-wrapper" ref="humidityRef">
				<div class="gauge-chart"></div>
				<div class="gauge-name">湿度</div>
			</div>
			<div class="gauge-wrapper" ref="pressureRef">
				<div class="gauge-chart"></div>
				<div class="gauge-name">气压</div>
			</div>
			<div class="gauge-wrapper" ref="speedRef">
				<div class="gauge-chart"></div>
				<div class="gauge-name">速度</div>
			</div>
		</div>
	</el-card>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import * as echarts from "echarts";

	const uvRef = ref(null);
	const tempRef = ref(null);
	const humidityRef = ref(null);
	const pressureRef = ref(null);
	const speedRef = ref(null);

	const createTemperatureGauge = (element) => {
		const myChart = echarts.init(element.querySelector(".gauge-chart"));
		const option = {
			series: [
				{
					type: "gauge",
					center: ["50%", "60%"],
					startAngle: 200,
					endAngle: -20,
					min: 0,
					max: 60,
					splitNumber: 12,
					itemStyle: {
						color: "#FFAB91",
					},
					progress: {
						show: true,
						width: 30,
					},
					pointer: {
						show: false,
					},
					axisLine: {
						lineStyle: {
							width: 30,
						},
					},
					axisTick: {
						distance: -45,
						splitNumber: 5,
						lineStyle: {
							width: 2,
							color: "#999",
						},
					},
					splitLine: {
						distance: -52,
						length: 14,
						lineStyle: {
							width: 3,
							color: "#999",
						},
					},
					axisLabel: {
						distance: -20,
						color: "#999",
						fontSize: 20,
					},
					anchor: {
						show: false,
					},
					title: {
						show: false,
					},
					detail: {
						valueAnimation: true,
						width: "60%",
						lineHeight: 40,
						borderRadius: 8,
						offsetCenter: [0, "-15%"],
						fontSize: 60,
						fontWeight: "bolder",
						formatter: "{value} °C",
						color: "inherit",
					},
					data: [
						{
							value: 20,
						},
					],
				},
				{
					type: "gauge",
					center: ["50%", "60%"],
					startAngle: 200,
					endAngle: -20,
					min: 0,
					max: 60,
					itemStyle: {
						color: "#FD7347",
					},
					progress: {
						show: true,
						width: 8,
					},
					pointer: {
						show: false,
					},
					axisLine: {
						show: false,
					},
					axisTick: {
						show: false,
					},
					splitLine: {
						show: false,
					},
					axisLabel: {
						show: false,
					},
					detail: {
						show: false,
					},
					data: [
						{
							value: 20,
						},
					],
				},
			],
		};

		myChart.setOption(option);

		const intervalId = setInterval(() => {
			const random = +(Math.random() * 60).toFixed(2);
			myChart.setOption({
				series: [
					{
						data: [
							{
								value: random,
							},
						],
					},
					{
						data: [
							{
								value: random,
							},
						],
					},
				],
			});
		}, 2000);

		return () => clearInterval(intervalId);
	};

	const createSpeedGauge = (element) => {
		const myChart = echarts.init(element.querySelector(".gauge-chart"));
		const option = {
			series: [
				{
					type: "gauge",
					axisLine: {
						lineStyle: {
							width: 30,
							color: [
								[0.3, "#67e0e3"],
								[0.7, "#37a2da"],
								[1, "#fd666d"],
							],
						},
					},
					pointer: {
						itemStyle: {
							color: "auto",
						},
					},
					axisTick: {
						distance: -30,
						length: 8,
						lineStyle: {
							color: "#fff",
							width: 2,
						},
					},
					splitLine: {
						distance: -30,
						length: 30,
						lineStyle: {
							color: "#fff",
							width: 4,
						},
					},
					axisLabel: {
						color: "inherit",
						distance: 40,
						fontSize: 20,
					},
					detail: {
						valueAnimation: true,
						formatter: "{value} km/h",
						color: "inherit",
					},
					data: [
						{
							value: 70,
						},
					],
				},
			],
		};

		myChart.setOption(option);

		const intervalId = setInterval(() => {
			myChart.setOption({
				series: [
					{
						data: [
							{
								value: +(Math.random() * 100).toFixed(2),
							},
						],
					},
				],
			});
		}, 2000);

		return () => clearInterval(intervalId);
	};

	const createUVGauge = (element) => {
		const myChart = echarts.init(element.querySelector(".gauge-chart"));
		const option = {
			series: [
				{
					type: "gauge",
					startAngle: 180,
					endAngle: 0,
					center: ["50%", "75%"],
					radius: "90%",
					min: 0,
					max: 1,
					splitNumber: 8,
					axisLine: {
						lineStyle: {
							width: 6,
							color: [
								[0.25, "#FF6E76"],
								[0.5, "#FDDD60"],
								[0.75, "#58D9F9"],
								[1, "#7CFFB2"],
							],
						},
					},
					pointer: {
						icon: "path://M12.8,0.7l12,40.1H0.7L12.8,0.7z",
						length: "12%",
						width: 20,
						offsetCenter: [0, "-60%"],
						itemStyle: {
							color: "auto",
						},
					},
					axisTick: {
						length: 12,
						lineStyle: {
							color: "auto",
							width: 2,
						},
					},
					splitLine: {
						length: 20,
						lineStyle: {
							color: "auto",
							width: 5,
						},
					},
					axisLabel: {
						color: "#464646",
						fontSize: 20,
						distance: -60,
						rotate: "tangential",
						formatter: function (value) {
							if (value === 0.875) {
								return "Grade A";
							} else if (value === 0.625) {
								return "Grade B";
							} else if (value === 0.375) {
								return "Grade C";
							} else if (value === 0.125) {
								return "Grade D";
							}
							return "";
						},
					},
					title: {
						offsetCenter: [0, "-10%"],
						fontSize: 20,
					},
					detail: {
						fontSize: 30,
						offsetCenter: [0, "-35%"],
						valueAnimation: true,
						formatter: function (value) {
							return Math.round(value * 100) + "";
						},
						color: "inherit",
					},
					data: [
						{
							value: 0.7,
							name: "Grade Rating",
						},
					],
				},
			],
		};

		myChart.setOption(option);

		const intervalId = setInterval(() => {
			const random = +(Math.random() * 1).toFixed(2);
			myChart.setOption({
				series: [
					{
						data: [
							{
								value: random,
							},
						],
					},
				],
			});
		}, 2000);

		return () => clearInterval(intervalId);
	};

	const createHumidityGauge = (element) => {
		const myChart = echarts.init(element.querySelector(".gauge-chart"));
		const option = {
			series: [
				{
					type: "gauge",
					startAngle: 180,
					endAngle: 0,
					min: 0,
					max: 100,
					splitNumber: 10, // 调整分割数量为 10，以显示 0 到 100 的整数刻度
					itemStyle: {
						color: "#58D9F9",
						shadowColor: "rgba(0,138,255,0.45)",
						shadowBlur: 10,
						shadowOffsetX: 2,
						shadowOffsetY: 2,
					},
					progress: {
						show: true,
						roundCap: true,
						width: 18,
					},
					pointer: {
						icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
						length: "75%",
						width: 16,
						offsetCenter: [0, "5%"],
					},
					axisLine: {
						roundCap: true,
						lineStyle: {
							width: 18,
						},
					},
					axisTick: {
						splitNumber: 2,
						lineStyle: {
							width: 2,
							color: "#999",
						},
					},
					splitLine: {
						length: 12,
						lineStyle: {
							width: 3,
							color: "#999",
						},
					},
					axisLabel: {
						distance: 30,
						color: "#999",
						fontSize: 20,
						formatter: (value) => {
							if (Number.isInteger(value) && value % 10 === 0) {
								return `${value}%`;
							}
							return "";
						},
					},
					title: {
						show: false,
					},
					detail: {
						backgroundColor: "#fff",
						borderColor: "#999",
						borderWidth: 2,
						width: "60%",
						lineHeight: 40,
						height: 40,
						borderRadius: 8,
						offsetCenter: [0, "35%"],
						valueAnimation: true,
						formatter: function (value) {
							return "{value|" + value.toFixed(0) + "}{unit|%}";
						},
						rich: {
							value: {
								fontSize: 50,
								fontWeight: "bolder",
								color: "#777",
							},
							unit: {
								fontSize: 20,
								color: "#999",
								padding: [0, 0, -20, 10],
							},
						},
					},
					data: [
						{
							value: 60,
						},
					],
				},
			],
		};

		myChart.setOption(option);

		const intervalId = setInterval(() => {
			const random = +(Math.random() * 100).toFixed(2);
			myChart.setOption({
				series: [
					{
						data: [
							{
								value: random,
							},
						],
					},
				],
			});
		}, 2000);

		return () => clearInterval(intervalId);
	};

	const createPressureGauge = (element) => {
		const myChart = echarts.init(element.querySelector(".gauge-chart"));
		const option = {
			series: [
				{
					type: "gauge",
					min: 0,
					max: 100,
					splitNumber: 10,
					radius: "80%",
					axisLine: {
						lineStyle: {
							color: [[1, "#f00"]],
							width: 3,
						},
					},
					splitLine: {
						distance: -18,
						length: 18,
						lineStyle: {
							color: "#f00",
						},
					},
					axisTick: {
						distance: -12,
						length: 10,
						lineStyle: {
							color: "#f00",
						},
					},
					axisLabel: {
						distance: -50,
						color: "#f00",
						fontSize: 25,
					},
					anchor: {
						show: true,
						size: 20,
						itemStyle: {
							borderColor: "#000",
							borderWidth: 2,
						},
					},
					pointer: {
						offsetCenter: [0, "10%"],
						icon: "path://M2090.36389,615.30999 L2090.36389,615.30999 C2091.48372,615.30999 2092.40383,616.194028 2092.44859,617.312956 L2096.90698,728.755929 C2097.05155,732.369577 2094.2393,735.416212 2090.62566,735.56078 C2090.53845,735.564269 2090.45117,735.566014 2090.36389,735.566014 L2090.36389,735.566014 C2086.74736,735.566014 2083.81557,732.63423 2083.81557,729.017692 C2083.81557,728.930412 2083.81732,728.84314 2083.82081,728.755929 L2088.2792,617.312956 C2088.32396,616.194028 2089.24407,615.30999 2090.36389,615.30999 Z",
						length: "115%",
						itemStyle: {
							color: "#000",
						},
					},
					detail: {
						valueAnimation: true,
						precision: 1,
					},
					title: {
						offsetCenter: [0, "-50%"],
					},
					data: [
						{
							value: 58.46,
							name: "PLP",
						},
					],
				},
				{
					type: "gauge",
					min: 0,
					max: 60,
					splitNumber: 6,
					axisLine: {
						lineStyle: {
							color: [[1, "#000"]],
							width: 3,
						},
					},
					splitLine: {
						distance: -3,
						length: 18,
						lineStyle: {
							color: "#000",
						},
					},
					axisTick: {
						distance: 0,
						length: 10,
						lineStyle: {
							color: "#000",
						},
					},
					axisLabel: {
						distance: 10,
						fontSize: 25,
						color: "#000",
					},
					pointer: {
						show: false,
					},
					title: {
						show: false,
					},
					anchor: {
						show: true,
						size: 14,
						itemStyle: {
							color: "#000",
						},
					},
				},
			],
		};

		myChart.setOption(option);

		const intervalId = setInterval(() => {
			myChart.setOption({
				series: [
					{
						type: "gauge",
						data: [
							{
								value: +(Math.random() * 100).toFixed(2),
								name: "PLP",
							},
						],
					},
				],
			});
		}, 2000);

		return () => clearInterval(intervalId);
	};

	onMounted(() => {
		const destroyTemperatureInterval = createTemperatureGauge(
			tempRef.value
		);
		const destroySpeedInterval = createSpeedGauge(speedRef.value);
		const destroyUVInterval = createUVGauge(uvRef.value);
		createHumidityGauge(humidityRef.value, "湿度", 60, "%", ["50%", "50%"]);
		createPressureGauge(pressureRef.value, "气压", 1013, "hPa", [
			"50%",
			"50%",
		]);

		return () => {
			destroyTemperatureInterval();
			destroySpeedInterval();
			destroyUVInterval();
		};
	});
</script>

<style scoped>
	.dashboard-card {
		background-color: white;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
	}

	.dashboard-container {
		display: flex;
		flex-wrap: wrap;
		gap: 20px;
		justify-content: flex-start;
	}

	.gauge-wrapper {
		/* 让小容器根据内容自适应宽度和高度 */
		width: calc((100% - 105px) / 3);
		min-width: 250px;
		height: 500px;
		display: flex;
		flex-direction: column;
		align-items: center;
		border: 1px solid #e0e0e0;
		border-radius: 8px;
		box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
		padding: 10px;
	}

	.gauge-chart {
		/* 让仪表盘容器占满小容器的剩余高度 */
		width: 100%;
		flex: 1;
	}

	.gauge-name {
		font-size: 18px;
		font-weight: bold;
		margin-top: 10px;
	}
</style>
