let dataPage = document.querySelector(".dataPage");
let progressBar = document.querySelector(".circular-progress");
let valueContainer = document.querySelector(".value-container");

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


const fetchData = async () => {
  const response = await fetch("./simulation/demo.json");
  const data = await response.json();
  const floodData = data["Demo"];
  // console.log(floodData);

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

  // console.log(ultrasonicReadings);
  // console.log(temperatureReadings);
  // console.log(pressureReadings);
  // console.log(moistureReadings);
  // console.log(waterLevelReadings);
  // console.log(soilMoistureReadings);
  // console.log(waterFlowReadings);

  let graphs = document.createElement("div");
  graphs.classList.add("graphs");
  let canvas1 = document.createElement("canvas");
  let canvas2 = document.createElement("canvas");
  let canvas3 = document.createElement("canvas");
  let canvas4 = document.createElement("canvas");
  let c1 = document.createElement("div");
  let c2 = document.createElement("div");
  let c3 = document.createElement("div");
  let c4 = document.createElement("div");
  c1.classList.add("c");
  c2.classList.add("c");
  c3.classList.add("c");
  c4.classList.add("c");
  c1.appendChild(canvas1);
  c2.appendChild(canvas2);
  c3.appendChild(canvas3);
  c4.appendChild(canvas4);

  graphs.append(c1, c2, c3, c4);
  dataPage.appendChild(graphs);
  new Chart(canvas1, {
    type: "line",
    data: {
      labels: new Array(
        Math.min(waterLevelReadings.length, ultrasonicReadings.length)
      ).fill(0),
      datasets: [
        {
          label: "Water Level Readings",
          data: waterLevelReadings,
          yAxisID: "y1",
        },
        {
          label: "Ultrasonic Readings",
          data: ultrasonicReadings,
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "left",
          grid: {
            display: false,
          },
        },
        y2: {
          type: "linear",
          display: true,
          position: "right",
          grid: {
            display: false,
          },
        },
      },
    },
  });

  new Chart(canvas2, {
    type: "line",
    data: {
      labels: new Array(
        Math.min(soilMoistureReadings.length, moistureReadings.length)
      ).fill(0),
      datasets: [
        {
          label: "Soil Moisture Readings",
          data: soilMoistureReadings,
          yAxisID: "y1",
        },
        {
          label: "Air Moisture Readings",
          data: moistureReadings,
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "left",
          grid: {
            display: false,
          },
        },
        y2: {
          type: "linear",
          display: true,
          position: "right",
          grid: {
            display: false,
          },
        },
      },
    },
  });

  new Chart(canvas3, {
    type: "line",
    data: {
      labels: new Array(
        Math.min(temperatureReadings.length, pressureReadings.length)
      ).fill(0),
      datasets: [
        {
          label: "Temperature Readings",
          data: temperatureReadings,
          yAxisID: "y1",
        },
        {
          label: "Pressure Readings",
          data: pressureReadings,
          yAxisID: "y2",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "left",
          grid: {
            display: false,
          },
        },
        y2: {
          type: "linear",
          display: true,
          position: "right",
          grid: {
            display: false,
          },
        },
      },
    },
  });

  new Chart(canvas4, {
    type: "line",
    data: {
      labels: new Array(waterFlowReadings.length).fill(0),
      datasets: [
        {
          label: "Water Flow Readings",
          data: waterFlowReadings,
          yAxisID: "y",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      stacked: false,
      scales: {
        x: {
          ticks: {
            display: false,
          },
          grid: {
            display: false,
          },
        },
        y: {
          type: "linear",
          display: true,
          position: "left",
          grid: {
            display: false,
          },
        },
      },
    },
  });
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
