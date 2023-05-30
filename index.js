let progressBar = document.querySelector(".circular-progress");
let valueContainer = document.querySelector(".value-container");
let goButton = document.querySelector(".go");

const updateCircle = (val) => {
  let currentIndex = 0;
  let progressValue = 0;
  let progressEndValue = val;
  let speed = 100 / Math.log(progressEndValue);
  let delay = 2000;

  let progress;

  function updateProgress() {
    progressValue++;
    valueContainer.textContent = `${progressValue}%`;
    progressBar.style.background = `conic-gradient(
          ${getProgressColor(progressValue)} ${progressValue * 3.6}deg,
          #cadcff ${progressValue * 3.6}deg
      )`;

    if (progressValue == progressEndValue) {
      clearInterval(progress);

      setTimeout(() => {
        currentIndex++;
        if (currentIndex >= 1) {
          return;
        }

        progressValue = 0;
        progressEndValue = val;
        speed = 100 / Math.log(progressEndValue);
        progress = setInterval(updateProgress, speed);
      }, delay);
    }
  }

  function getProgressColor(value) {
    const colorStart = [7, 127, 212];
    const colorGreen = [19, 147, 228];
    const colorMiddle = [60, 173, 244];
    const colorEnd = [128, 201, 249];
    let color;
    if (value < 40) {
      color = interpolateColors(colorStart, colorGreen, value / 40);
    } else if (value < 50) {
      color = interpolateColors(colorGreen, colorMiddle, (value - 40) / 10);
    } else {
      color = interpolateColors(colorMiddle, colorEnd, (value - 50) / 50);
    }

    return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
  }

  function interpolateColors(color1, color2, ratio) {
    const r = Math.round(color1[0] * (1 - ratio) + color2[0] * ratio);
    const g = Math.round(color1[1] * (1 - ratio) + color2[1] * ratio);
    const b = Math.round(color1[2] * (1 - ratio) + color2[2] * ratio);
    return [r, g, b];
  }

  progress = setInterval(updateProgress, speed);
};

const probabilities_ctx = document.getElementById("probabilities");
const ultrasonic_ctx = document.getElementById("ultrasonic");
const water_level_ctx = document.getElementById("water-level");
const water_flow_ctx = document.getElementById("water-flow");
const humidity_ctx = document.getElementById("humidity");

const data = {
  datasets: [
    {
      label: "Height (cm)",
      borderColor: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      pointStyle: "circle",
      pointRadius: 10,
      pointHoverRadius: 15,
    },
  ],
};

let floodProbability = new Chart(probabilities_ctx, {
  type: "doughnut",
  data: {
    labels: [
      "Ultrasonic",
      "Water Level",
      "Soil Moisture",
      "Water Flow",
      "Temperature",
      "Pressure",
      "Humidity",
    ],
    datasets: [
      {
        data: [100, 30, 30, 40, 8, 5, 15],
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
      title: {
        display: true,
        text: () => "Flood Factors",
        color: "rgba(255, 255, 255, 1)", // Title Color
      },
    },
    color: "rgba(255, 255, 255, 1)", // Legend Color
    scales: {
      x: {
        display: false,
      },
      y: {
        display: false,
      },
    },
  },
});

let ultrasonicChart = new Chart(ultrasonic_ctx, {
  type: "line",
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "Ultrasonic",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
    },
  },
});

let waterLevelChart = new Chart(water_level_ctx, {
  type: "bar",
  data: {
    datasets: [
      {
        label: "Water Level (cm)",
        backgroundColor: "rgba(6, 128, 213, 0.6)",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "Water Level",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
    },
  },
});

let waterFlowChart = new Chart(water_flow_ctx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Interpolated Water Flow Rate (L/min)",
        borderColor: "rgba(6, 128, 253, 0.7)",
        fill: false,
        tension: 0.4,
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "Water Flow Rate",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
    },
  },
});

let humidityChart = new Chart(humidity_ctx, {
  type: "line",
  data: {
    datasets: [
      {
        label: "Humidity (%)",
        yAxisID: "y1",
      },
      {
        label: "Temperature (C)",
        yAxisID: "y2",
      },
    ],
  },
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "Humidity",
        color: "rgba(255, 255, 255, 1)",
      },
    },
    color: "rgba(255, 255, 255, 1)",
    scales: {
      x: {
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "left",
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        ticks: {
          color: "rgba(255, 255, 255, 1)",
        },
        grid: {
          drawOnChartArea: false,
        },
      },
    },
  },
});

let ultrasonicReadings = [];
let waterLevelReadings = [];
let waterFlowReadings = [];
let soilMoistureReadings = [];
let temperatureReadings = [];
let pressureReadings = [];
let humidityReadings = [];
let probabilities = [];
(async function test() {
  const response = await fetch(
    "https://api.thingspeak.com/channels/2151430/feeds.json?results=60"
  );
  const data = await response.json();

  data.feeds.forEach((feed) => {
    let time = new Date(feed.created_at);
    console.log(time);
    if (feed.field1) ultrasonicReadings.push([feed.field1, time]);
    if (feed.field2) waterLevelReadings.push([feed.field2, time]);
    if (feed.field3) waterFlowReadings.push([feed.field3, time]);
    if (feed.field4) soilMoistureReadings.push([feed.field4, time]);
    if (feed.field5) temperatureReadings.push([feed.field5, time]);
    if (feed.field6) pressureReadings.push([feed.field6, time]);
    if (feed.field7) humidityReadings.push([feed.field7, time]);
    if (feed.field8) probabilities.push([feed.field8, time]);
  });

  // ultrasonicReadings = [32, 35, 37, 31, 40, 45];
  // waterLevelReadings = [32, 35, 37, 31, 40, 45];
  // waterFlowReadings = [32, 35, 37, 31, 40, 45];
  // humidityReadings = [32, 35, 37, 31, 40, 45];
  // addData(floodProbability, probabilities);
  const dataPoints = 10;
  addData(ultrasonicChart, ultrasonicReadings.slice(-dataPoints));
  addData(waterLevelChart, waterLevelReadings.slice(-dataPoints));
  addData(waterFlowChart, waterFlowReadings.slice(-dataPoints));
  addData(humidityChart, humidityReadings.slice(-dataPoints));
  addData(humidityChart, temperatureReadings.slice(-dataPoints), 1);
  updateCircle(71);
})();

function addData(chart, arr, datasetID = 0) {
  let labels_arr = [];
  for (let i = 0; i < arr.length; ++i)
    labels_arr.push(arr[i][1].toLocaleTimeString());
  chart.data.labels = labels_arr;
  data_arr = [];
  for (let i = 0; i < arr.length; ++i) data_arr.push(arr[i][0]);
  chart.data.datasets[datasetID].data = data_arr;
  chart.update();
}

function removeData(chart) {
  chart.data.labels.pop();
  chart.data.datasets.forEach((dataset) => {
    dataset.data.pop();
  });
  chart.update();
}

const setUp = () => {
  goButton.classList.add("up");
  goButton.setAttribute("href", "#landingPage");
};

const setDown = () => {
  goButton.classList.remove("up");
  goButton.setAttribute("href", "#dataPage");
};

goButton.addEventListener("click", () => {
  if (goButton.classList.contains("up")) setTimeout(setDown, 400);
  else setTimeout(setUp, 400);
});
