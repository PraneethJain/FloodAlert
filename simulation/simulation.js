const body = document.querySelector("body");

const main = async () => {
  const response = await fetch("./data.json");
  const data = await response.json();

  let header = document.createElement("h1");
  header.textContent = "Flood #3";
  let page = document.createElement("div");
  let graph_container = document.createElement("div");
  graph_container.classList.add("container");
  let canvas1 = document.createElement("canvas");
  let canvas2 = document.createElement("canvas");
  let canvas3 = document.createElement("canvas");
  let canvas4 = document.createElement("canvas");

  graph_container.append(canvas1, canvas2, canvas3, canvas4);
  page.append(header, graph_container);
  body.appendChild(page);

  const floodData = data["Flood11"];
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
  data2.map(eval).forEach(([temp, press, moist]) => {
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

main();
