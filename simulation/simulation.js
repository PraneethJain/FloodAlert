const body = document.querySelector("body");

const main = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();

  for (let i = 1; i <= 15; ++i) {
    let header = document.createElement("h1");
    header.textContent = `Flood #${i}`;
    let page = document.createElement("div");
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
    page.append(header, graphs);
    body.appendChild(page);

    const floodData = data[`Flood${i}`];
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

    console.log(waterFlowReadings);

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
  }
};

main();
