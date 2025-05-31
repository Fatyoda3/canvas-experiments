// speed-time-distance.js
const canvas = document.querySelector('#canvas1');
const ctx = canvas.getContext('2d');
const input = document.querySelector('#distance');
const updateBtn = document.querySelector('#update');
const downloadBtn = document.querySelector('#download');

let distance = parseFloat(input.value);
let unit = 'km/h';

const speeds = [10, 20, 30, 40, 50, 60, 80, 100];

function formatTime(time) {
  return time < 1 ? `${(time * 60).toFixed(1)} min` : `${time.toFixed(2)} hr`;
}

function drawPaperBackground() {
  const lineSpacing = 20;
  ctx.fillStyle = '#fffef8';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;
  for (let y = 0; y < canvas.height; y += lineSpacing) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  ctx.strokeStyle = '#ccc';
  ctx.lineWidth = 1;
  for (let x = 0; x < canvas.width; x += 100) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
}

function drawGraph(dist) {
  drawPaperBackground();

  const originX = 80;
  const originY = canvas.height - 80;

  ctx.strokeStyle = 'black';
  ctx.lineWidth = 2;

  // axes
  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(originX, 40);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(originX, originY);
  ctx.lineTo(canvas.width - 40, originY);
  ctx.stroke();

  // draw speed lines
  speeds.forEach(speed => {
    const time = dist / speed;
    const x = originX + time * 120;
    const y = originY - speed * 2;

    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = speed >= 60 ? 'red' : 'green';
    ctx.moveTo(originX, originY);
    ctx.lineTo(x, y);
    ctx.stroke();

    ctx.fillStyle = 'black';
    ctx.font = '12px sans-serif';
    ctx.fillText(`${speed} ${unit}`, originX - 60, y + 4);
    ctx.fillText(`${formatTime(time)}`, x + 5, y + 4);

    // dot
    ctx.beginPath();
    ctx.fillStyle = speed >= 60 ? 'red' : 'green';
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'black';
  ctx.font = '14px sans-serif';
  ctx.fillText('Speed vs Time Graph', originX + 150, 30);
  ctx.fillText('Time (h)', canvas.width - 80, originY + 30);
  ctx.fillText('Speed (' + unit + ')', originX - 60, 50);
}

updateBtn.addEventListener('click', () => {
  distance = parseFloat(input.value);
  drawGraph(distance);
});

downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.href = canvas.toDataURL();
  link.download = 'speed_time_graph.png';
  link.click();
});

const unitToggle = document.createElement('button');
unitToggle.textContent = 'Switch to m/s';
document.getElementById('controls').appendChild(unitToggle);

unitToggle.addEventListener('click', () => {
  if (unit === 'km/h') {
    unit = 'm/s';
    for (let i = 0; i < speeds.length; i++) {
      speeds[i] = parseFloat((speeds[i] / 3.6).toFixed(2));
    }
    unitToggle.textContent = 'Switch to km/h';
  } else {
    unit = 'km/h';
    for (let i = 0; i < speeds.length; i++) {
      speeds[i] = parseFloat((speeds[i] * 3.6).toFixed(0));
    }
    unitToggle.textContent = 'Switch to m/s';
  }
  drawGraph(distance);
});

function resizeCanvas() {
  canvas.width = Math.min(window.innerWidth * 0.95, 1000);
  canvas.height = Math.min(window.innerHeight * 0.75, 700);
}

resizeCanvas();
drawGraph(distance);

window.addEventListener('resize', () => {
  resizeCanvas();
  drawGraph(distance);
});
