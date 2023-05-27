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

const ctx = document.getElementById("linechart");
const data = {
  labels: [
    "Day 1",
    "Day 2",
    "Day 3",
    "Day 4",
    "Day 5",
    "Day 6",
    "Day 7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ],
  datasets: [
    {
      label: "Percent",
      data: [17, 5, 32, 12, 7, 59, 90],
      borderColor: "rgba(255, 255, 255, 0.8)",
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      pointStyle: "circle",
      pointRadius: 10,
      pointHoverRadius: 15,
    },
  ],
};

let c = new Chart(ctx, {
  type: "line",
  data: data,
  options: {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: () => "Flood chances",
        color: "rgba(255, 255, 255, 1)", // Title Color
      },
    },
    color: "rgba(255, 255, 255, 1)", // Legend Color
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
    if (feed.field1) ultrasonicReadings.push(feed.field1);
    if (feed.field2) waterLevelReadings.push(feed.field2);
    if (feed.field3) waterFlowReadings.push(feed.field3);
    if (feed.field4) soilMoistureReadings.push(feed.field4);
    if (feed.field5) temperatureReadings.push(feed.field5);
    if (feed.field6) pressureReadings.push(feed.field6);
    if (feed.field7) humidityReadings.push(feed.field7);
    if (feed.field8) probabilities.push(feed.field8);
  });

  addData(c, probabilities);
  updateCircle(probabilities[probabilities.length - 1]);
})();

function addData(chart, arr) {
  let labels = [];
  for (let i = 0; i < arr.length; ++i) labels.push(String(i + 1));
  chart.data.labels = labels;
  chart.data.datasets[0].data = arr;
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
