const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const distanceSlider = document.getElementById("distanceSlider");
const distanceValueDisplay = document.getElementById("distanceValue");
const unitToggle = document.getElementById("unitToggle");
const downloadBtn = document.getElementById("downloadBtn");

canvas.width = 950;
canvas.height = 800;

const centerX = canvas.width / 4;
const centerY = canvas.height - 50;

let distance = parseFloat(distanceSlider.value) || 100;
let isMS = false;

const speedsKMH = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

function toMS(kmh) {
  return (kmh * 1000) / 3600;
}

function getIntervalY(maxValue) {
  if (maxValue > 500) return 50;
  if (maxValue > 200) return 20;
  if (maxValue > 100) return 10;
  if (maxValue > 50) return 5;
  if (maxValue > 20) return 2;
  return 1;
}

function getIntervalX(maxTime) {
  if (maxTime > 200) return 50;
  if (maxTime > 100) return 20;
  if (maxTime > 50) return 10;
  if (maxTime > 20) return 5;
  if (maxTime > 10) return 2;
  return 1;
}

function drawGraph() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#fdf6e3";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "black";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(centerX, 0);
  ctx.lineTo(centerX, canvas.height);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, centerY);
  ctx.lineTo(canvas.width, centerY);
  ctx.stroke();

  let minSpeed = isMS ? toMS(Math.min(...speedsKMH)) : Math.min(...speedsKMH);
  let maxSpeed = isMS ? toMS(Math.max(...speedsKMH)) : Math.max(...speedsKMH);
  let maxTime = distance / minSpeed;

  let scaleX = (canvas.width - centerX - 50) / maxTime;
  let scaleY = (centerY - 50) / maxSpeed;

  const xInterval = getIntervalX(maxTime);
  const yInterval = getIntervalY(maxSpeed);

  ctx.strokeStyle = "#ccc";
  ctx.lineWidth = 1;
  ctx.fillStyle = "#444";
  ctx.font = "12px sans-serif";

  for (let t = 0; t <= maxTime + 0.001; t += xInterval) {
    const x = centerX + t * scaleX;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
    ctx.fillText(`${t.toFixed(1)} h`, x - 15, centerY + 15);
  }

  for (let v = 0; v <= maxSpeed + 0.001; v += yInterval) {
    const y = centerY - v * scaleY;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
    ctx.fillText(
      `${v.toFixed(1)} ${isMS ? "m/s" : "km/h"}`,
      centerX - 65,
      y + 4
    );
  }

  const points = [];
  for (let i = 0; i < speedsKMH.length; i++) {
    let speed = speedsKMH[i];
    const speedVal = isMS ? toMS(speed) : speed;
    const time = distance / speedVal;
    const x = centerX + time * scaleX;
    const y = centerY - speedVal * scaleY;

    points.push({ x, y });

    ctx.fillStyle = speed >= 60 ? "red" : "green";
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#333";
    ctx.font = "12px sans-serif";
    ctx.fillText(`${time.toFixed(2)} h`, x + 6, y - 6);

    ctx.strokeStyle = "#666";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, centerY);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(centerX, y);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  drawCurve(ctx, points);
}

function drawCurve(ctx, points) {
  if (points.length < 2) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);

  for (let i = 1; i < points.length - 2; i++) {
    const xc = (points[i].x + points[i + 1].x) / 2;
    const yc = (points[i].y + points[i + 1].y) / 2;
    ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
  }

  const penultimate = points[points.length - 2];
  const last = points[points.length - 1];
  ctx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

distanceSlider.addEventListener("input", () => {
  distance = parseFloat(distanceSlider.value);
  distanceValueDisplay.textContent = distance;
  drawGraph();
});

unitToggle.addEventListener("click", () => {
  isMS = !isMS;
  unitToggle.innerText = isMS ? "Switch to km/h" : "Switch to m/s";
  drawGraph();
});

downloadBtn.addEventListener("click", () => {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = "speed-time-graph.png";
  a.click();
});

drawGraph();
