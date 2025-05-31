const canvas = document.querySelector("#canvas1");
const c = canvas.getContext("2d");
const rangeBar = document.querySelector("#bar");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Particle {
  constructor(angle, radius, height, size, colorGroup) {
    this.angle = angle;
    this.radius = radius;
    this.height = height;
    this.size = size;
    this.colorGroup = colorGroup;
  }
}

class HelixLine {
  constructor(centerX, centerY, rotation, particleCount) {
    this.centerX = centerX;
    this.centerY = centerY;
    this.rotation = rotation;
    this.radius = 150 + Math.random() * 150; // Random radius for helix shape
    this.height = 200 + Math.random() * 300; // Random height
    this.colorGroups = {};
    this.createParticles(particleCount);
  }

  randomColor() {
    const r = 100 + Math.floor(Math.random() * 155);
    const g = 50 + Math.floor(Math.random() * 150);
    const b = 150 + Math.floor(Math.random() * 105);
    return `rgb(${r},${g},${b})`;
  }

  createParticles(particleCount) {
    this.colorGroups = {};
    const colorCount = 5;
    const colors = Array.from({ length: colorCount }, () => this.randomColor());

    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 4;
      const height = (i / particleCount) * this.height - this.height / 2;
      const size = 2 + Math.random() * 4;
      const colorGroup = i % colorCount;

      const p = new Particle(angle, this.radius, height, size, colorGroup);
      if (!this.colorGroups[colorGroup]) {
        this.colorGroups[colorGroup] = {
          color: colors[colorGroup],
          particles: [],
        };
      }
      this.colorGroups[colorGroup].particles.push(p);
    }
  }

  draw(time) {
    for (const group of Object.values(this.colorGroups)) {
      c.beginPath();
      c.fillStyle = group.color;
      c.shadowColor = group.color;
      c.shadowBlur = 10;

      for (const p of group.particles) {
        const angle = p.angle + time;
        const x0 = Math.cos(angle) * p.radius;
        const y0 = p.height + Math.sin(angle * 2) * 20;

        const x = this.centerX + (x0 * Math.cos(this.rotation) - y0 * Math.sin(this.rotation));
        const y = this.centerY + (x0 * Math.sin(this.rotation) + y0 * Math.cos(this.rotation));

        c.moveTo(x + p.size, y);
        c.arc(x, y, p.size, 0, Math.PI * 2);
      }

      c.fill();
    }
  }

  cycleColors() {
    for (const group of Object.values(this.colorGroups)) {
      group.color = this.randomColor();
    }
  }
}

let helixLines = [];
let time = 0;
let particleCount = parseInt(rangeBar.value);
const count = 5;

function createHelices() {
  helixLines = [];
  for (let i = 0; i < count; i++) {
    const centerX = Math.random() * canvas.width * 0.8 + canvas.width * 0.1;
    const centerY = Math.random() * canvas.height * 0.8 + canvas.height * 0.1;
    const rotation = Math.random() * Math.PI * 2;
    helixLines.push(new HelixLine(centerX, centerY, rotation, particleCount));
  }
}

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  time += 0.015;

  for (const helix of helixLines) {
    helix.draw(time);
  }

  requestAnimationFrame(animate);
}

rangeBar.addEventListener("input", (e) => {
  particleCount = parseInt(e.target.value);
  for (const helix of helixLines) {
    helix.createParticles(particleCount);
  }
});

canvas.addEventListener("click", () => {
  for (const helix of helixLines) {
    helix.cycleColors();
  }
});

setInterval(() => {
  for (const helix of helixLines) {
    helix.cycleColors();
  }
}, 5000); // Every 5 seconds

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  createHelices();
});

createHelices();
animate();
