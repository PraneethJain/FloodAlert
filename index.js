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

const readUltrasonic = async () => {
  const response = await fetch(
    "https://api.thingspeak.com/channels/2151430/fields/1.json?results=20"
  );
  const x = await response.json();
  let arr = [];
  for (let i = 0; i < x.feeds.length; ++i) {
    if (x.feeds[i].field1) arr.push(x.feeds[i].field1);
  }
  console.log(arr);
  addData(c, arr);
  setTimeout(readUltrasonic, 5000);
};

(async function test() {
  await readUltrasonic();
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
