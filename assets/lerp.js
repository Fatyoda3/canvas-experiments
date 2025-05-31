const grid = document.getElementById("grid");
const CANVAS_SIZE = 180;
const BOX_COUNT = 10;
const FPS = 30;
const FRAME_DURATION = 1000 / FPS;

class LineAnimator {
  constructor(canvas, shape) {
    this.canvas = canvas;
    this.c = canvas.getContext("2d");
    this.c.lineCap = "round";

    this.width = canvas.width;
    this.height = canvas.height;

    this.shape = shape; // 'L', 'X', 'W', or 'random'

    this.colorA = this.randomColor();
    this.colorB = this.randomColor();

    this.lineWidthA = 2 + Math.random() * 3;
    this.lineWidthB = 2 + Math.random() * 3;

    this.tA = 0;
    this.tB = 0;

    this.speedA = 0.005 + Math.random() * 0.02;
    this.speedB = 0.005 + Math.random() * 0.02;

    this.initShapePoints();
  }

  randomColor() {
    const r = 100 + Math.floor(Math.random() * 155);
    const g = 100 + Math.floor(Math.random() * 155);
    const b = 100 + Math.floor(Math.random() * 155);
    return `rgb(${r},${g},${b})`;
  }

  lerp(p1, p2, t) {
    return {
      x: p1.x + (p2.x - p1.x) * t,
      y: p1.y + (p2.y - p1.y) * t,
    };
  }

  distance(p1, p2) {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
  }

  drawLine(p1, p2, color, width) {
    const ctx = this.c;
    ctx.strokeStyle = color;
    ctx.lineWidth = width;

    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();
  }

  drawCircle(p, color) {
    const ctx = this.c;
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(p.x, p.y, 7, 0, Math.PI * 2);
    ctx.fill();
  }

  initShapePoints() {
    const w = this.width;
    const h = this.height;
    const margin = 20;

    switch(this.shape) {
      case 'L':
        // L shape: two lines forming a right angle
        this.pointsA = { p1: {x: margin, y: h - margin}, p2: {x: margin, y: margin} };
        this.pointsB = { p1: {x: margin, y: h - margin}, p2: {x: w - margin, y: h - margin} };
        break;

      case 'X':
        // X shape: two diagonal crossing lines
        this.pointsA = { p1: {x: margin, y: margin}, p2: {x: w - margin, y: h - margin} };
        this.pointsB = { p1: {x: w - margin, y: margin}, p2: {x: margin, y: h - margin} };
        break;

      case 'W':
        // W shape: 4 points connected by 3 lines, but we animate 2 lines: left and right strokes of W
        // We'll animate line from bottom-left to top-middle and top-middle to bottom-right separately
        const topY = margin + 20;
        const bottomY = h - margin;
        const leftX = margin;
        const midX = w / 2;
        const rightX = w - margin;

        this.pointsA = { p1: {x: leftX, y: bottomY}, p2: {x: midX, y: topY} };
        this.pointsB = { p1: {x: midX, y: topY}, p2: {x: rightX, y: bottomY} };
        break;

      default:
        // Random lines inside the canvas
        this.pointsA = this.randomPoints();
        this.pointsB = this.randomPoints();
        break;
    }
  }

  randomPoints() {
    return {
      p1: {
        x: 20 + Math.random() * (this.width - 40),
        y: 20 + Math.random() * (this.height - 40),
      },
      p2: {
        x: 20 + Math.random() * (this.width - 40),
        y: 20 + Math.random() * (this.height - 40),
      },
    };
  }

  update() {
    this.c.clearRect(0, 0, this.width, this.height);

    this.tA += this.speedA;
    if (this.tA > 1) this.tA = 0;
    this.tB += this.speedB;
    if (this.tB > 1) this.tB = 0;

    const lerpA = this.lerp(this.pointsA.p1, this.pointsA.p2, this.tA);
    const lerpB = this.lerp(this.pointsB.p1, this.pointsB.p2, this.tB);

    this.drawLine(this.pointsA.p1, this.pointsA.p2, this.colorA, this.lineWidthA);
    this.drawLine(this.pointsB.p1, this.pointsB.p2, this.colorB, this.lineWidthB);

    const overlap = this.distance(lerpA, lerpB) < 15;

    this.drawCircle(lerpA, overlap ? "red" : this.colorA);
    this.drawCircle(lerpB, overlap ? "red" : this.colorB);
  }
}

const shapes = ['L', 'X', 'W', 'random', 'random', 'L', 'X', 'W', 'random', 'random'];
const animators = [];

for (let i = 0; i < BOX_COUNT; i++) {
  const canvas = document.createElement("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  grid.appendChild(canvas);

  animators.push(new LineAnimator(canvas, shapes[i]));
}

let lastTime = 0;
function animate(time = 0) {
  if (time - lastTime > FRAME_DURATION) {
    animators.forEach(anim => anim.update());
    lastTime = time;
  }
  requestAnimationFrame(animate);
}

animate();
