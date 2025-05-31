class Line {
  constructor(effect, ctx) {
    this.effect = effect;
    this.ctx = ctx;

    this.radius = 10 + Math.random() * 35; // radius between 3 and 8
    this.diameter = this.radius * 2;

    this.x = Math.random() * (this.effect.width - this.diameter) + this.radius;
    this.y = Math.random() * (this.effect.height - this.diameter) + this.radius;

    this.Vx = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? 1 : -1);
    this.Vy = (Math.random() * 1 + 0.1) * (Math.random() < 0.5 ? 1 : -1);

    this.hue = Math.floor(Math.random() * 360);
    this.saturation = 70;
    this.lightness = 60;

    this.alpha = 0.7 + Math.random() * 0.3;

    this.color = `hsla(${this.hue}, ${this.saturation}%, ${this.lightness}%, ${this.alpha})`;

    this.pushX = 0;
    this.pushY = 0;
  }

  stroke() {
    const ctx = this.ctx;
    const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.2, this.x, this.y, this.radius);
    gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, 90%, ${this.alpha})`);
    gradient.addColorStop(1, `hsla(${this.hue}, ${this.saturation}%, 40%, 0)`);

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }

  update() {
    this.x += this.Vx;
    this.y += this.Vy;

    if (this.x <= this.radius) {
      this.x = this.radius;
      this.Vx = -this.Vx;
    }
    if (this.x >= this.effect.width - this.radius) {
      this.x = this.effect.width - this.radius;
      this.Vx = -this.Vx;
    }
    if (this.y <= this.radius) {
      this.y = this.radius;
      this.Vy = -this.Vy;
    }
    if (this.y >= this.effect.height - this.radius) {
      this.y = this.effect.height - this.radius;
      this.Vy = -this.Vy;
    }

    if (this.effect.mouse.x !== null && this.effect.mouse.y !== null) {
      const dx = this.x - this.effect.mouse.x;
      const dy = this.y - this.effect.mouse.y;
      const distance = Math.hypot(dx, dy);
      const maxDist = 150;

      if (distance < maxDist) {
        const angle = Math.atan2(dy, dx);
        const force = (maxDist - distance) / maxDist * 5;

        this.Vx += Math.cos(angle) * force;
        this.Vy += Math.sin(angle) * force;
      }
    }

    this.Vx *= 0.95;
    this.Vy *= 0.95;

    this.stroke();
  }

  reset() {
    this.x = Math.random() * (this.effect.width - this.diameter) + this.radius;
    this.y = Math.random() * (this.effect.height - this.diameter) + this.radius;
    this.Vx = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? 1 : -1);
    this.Vy = (Math.random() * 1 + 0.1) * (Math.random() < 0.5 ? 1 : -1);
  }
}

class Effect {
  constructor(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;

    this.width = canvas.width;
    this.height = canvas.height;

    this.lineCount = 50;
    this.lines = [];

    this.mouse = {
      x: null,
      y: null,
      pressed: false,
    };

    this.init();
    this.addEventListeners();
  }

  init() {
    this.lines = [];
    for (let i = 0; i < this.lineCount; i++) {
      this.lines.push(new Line(this, this.ctx));
    }
  }

  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resize(window.innerWidth, window.innerHeight);
    });

    this.canvas.addEventListener('mousedown', (e) => {
      this.mouse.pressed = true;
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener('mouseup', () => {
      this.mouse.pressed = false;
    });

    this.canvas.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });

    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
      this.mouse.pressed = false;
    });
  }

  handleLines() {
    this.lines.forEach(line => line.update());
  }

  resize(width, height) {
    this.width = width;
    this.height = height;
    this.canvas.width = width * window.devicePixelRatio;
    this.canvas.height = height * window.devicePixelRatio;
    this.canvas.style.width = width + 'px';
    this.canvas.style.height = height + 'px';
    this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    this.lines.forEach(line => line.reset());
  }
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  const width = window.innerWidth;
  const height = window.innerHeight;

  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  const effect = new Effect(canvas, ctx);

  function animate() {
    ctx.clearRect(0, 0, effect.width, effect.height);
    effect.handleLines();
    requestAnimationFrame(animate);
  }

  animate();
});
