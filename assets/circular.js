class Particle {
    constructor(effect, context, spawnAtMouse = false) {
        this.effect = effect;
        this.context = context;
        this.spawnAtMouse = spawnAtMouse;
        this.reset();
    }

    reset() {
        this.alpha = 1;
        this.hue = Math.random() * 360;
        this.radius = Math.random() * 3 + 2;
        this.radians = Math.random() * Math.PI * 2;
        this.velocity = 0.01 + Math.random() * 0.02;
        this.distance = 30 + Math.random() * 120;
        this.gravity = 0.1 + Math.random() * 0.3;

        if (this.spawnAtMouse) {
            this.originX = this.effect.mouse.x;
            this.originY = this.effect.mouse.y;
        } else {
            this.originX = this.effect.canvas.width / 2;
            this.originY = this.effect.canvas.height / 2;
        }

        this.yOffset = 0;
    }

    update() {
        this.hue += 1;
        this.radians += this.velocity;
        this.alpha -= 0.003; // fade out
        if (this.alpha <= 0) {
            this.reset();
        }

        this.yOffset += this.gravity;

        this.x = this.originX + Math.cos(this.radians) * this.distance;
        this.y = this.originY + Math.sin(this.radians) * this.distance + this.yOffset;

        this.draw();
    }

    draw() {
        this.context.beginPath();
        this.context.fillStyle = `hsla(${this.hue}, 100%, 70%, ${this.alpha})`;
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        this.context.fill();
        this.context.closePath();
    }
}

class Effect {
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.particles = [];
        this.mouse = { x: canvas.width / 2, y: canvas.height / 2 };
        this.resize();
        this.init();
        this.addEvents();
    }

    init() {
        this.particles = [];
        for (let i = 0; i < 100; i++) {
            this.particles.push(new Particle(this, this.context));
        }
    }

    addEvents() {
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        window.addEventListener('click', () => this.spawnMore());
    }

    spawnMore() {
        for (let i = 0; i < 10; i++) {
            this.particles.push(new Particle(this, this.context, true));
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.context.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach(p => p.update());
        requestAnimationFrame(() => this.animate());
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('canvas');
    const context = canvas.getContext('2d');
    const effect = new Effect(canvas, context);
    effect.animate();
});
