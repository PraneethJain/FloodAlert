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

const fetchData = async () => {
  const response = await fetch("./simulation/demo.json");
  const data = await response.json();
  const floodData = data["Demo"];
  console.log(floodData);

  const data1 = floodData["datas"];
  const data2 = floodData["datas2"];
  const data3 = floodData["datas3"];

  let ultrasonicReadings = [];
  let temperatureReadings = [];
  let pressureReadings = [];
  let moistureReadings = [];
  let waterLevelReadings = [];
  let soilMoistureReadings = [];
  let waterFlowReadings = [];

  data1.forEach(([a, b, c]) => {
    waterLevelReadings.push(a);
    soilMoistureReadings.push(b);
    waterFlowReadings.push(c);
  });

  data2
    .map((str) => str.replace(/nan/g, "0"))
    .map(eval)
    .forEach(([temp, press, moist]) => {
      temperatureReadings.push(temp);
      pressureReadings.push(press);
      moistureReadings.push(moist);
    });
  ultrasonicReadings = data3.flat();

  console.log(ultrasonicReadings);
  console.log(temperatureReadings);
  console.log(pressureReadings);
  console.log(moistureReadings);
  console.log(waterLevelReadings);
  console.log(soilMoistureReadings);
  console.log(waterFlowReadings);
};

fetchData();

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

progressBar.addEventListener("click", async (e) => {
  const val = 85 + Math.floor(Math.random() * 11) - 5;
  const res = await fetch(
    `https://api.thingspeak.com/update?api_key=YSQDHI1PZ3YPFENE&field8=${val}`
  );
  const response = await res.json();
  if (response == 0) {
    console.log("Thingspeak Overloaded!");
  } else {
    console.log("Updated value!");
    updateCircle(val);
  }
});
