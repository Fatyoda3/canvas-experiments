class Line {
    constructor(effect, c) {
        this.effect = effect;
        this.c = c;

        this.length = Math.floor(Math.random() * 25) + 10;
        this.width = Math.floor(Math.random() * 5) + 1;

        // Random position inside canvas, keeping margins for shape size
        this.x = Math.floor(Math.random() * (this.effect.width - this.length * 4)) + this.length * 2;
        this.y = Math.floor(Math.random() * (this.effect.height - this.length * 4)) + this.length * 2;

        // Velocity for movement (random direction and speed)
        this.Vx = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
        this.Vy = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? -1 : 1);

        // Choose random shape type: 'line', 'L', 'X', 'W'
        const shapes = ['line', 'L', 'X', 'W'];
        this.shape = shapes[Math.floor(Math.random() * shapes.length)];

        // Random color based on position
        this.color = `rgb(${this.x / this.effect.width * 255},${Math.floor(Math.random() * 255)},${this.y / this.effect.height * 255})`;

        // Random rotation angle in radians for the entire shape
        this.rotation = Math.random() * 2 * Math.PI;
    }

    // Helper to rotate a point (px, py) around origin (0,0) by this.rotation
    rotatePoint(px, py) {
        const cos = Math.cos(this.rotation);
        const sin = Math.sin(this.rotation);
        return {
            x: px * cos - py * sin,
            y: px * sin + py * cos
        };
    }

    strokeLine(x1, y1, x2, y2) {
        this.c.beginPath();
        this.c.moveTo(x1, y1);
        this.c.lineTo(x2, y2);
        this.c.stroke();
    }

    drawShape() {
        this.c.strokeStyle = this.color;
        this.c.lineWidth = this.width;

        // Coordinates relative to (this.x, this.y)
        // We’ll define points for each shape before rotation
        switch(this.shape) {
            case 'line': {
                // Simple line length = this.length
                let p1 = {x: 0, y: 0};
                let p2 = {x: this.length, y: 0};
                p1 = this.rotatePoint(p1.x, p1.y);
                p2 = this.rotatePoint(p2.x, p2.y);
                this.strokeLine(this.x + p1.x, this.y + p1.y, this.x + p2.x, this.y + p2.y);
                break;
            }
            case 'L': {
                // L shape: two lines, length each = this.length
                let p0 = {x: 0, y: 0};
                let p1 = {x: this.length, y: 0};
                let p2 = {x: 0, y: this.length};
                p0 = this.rotatePoint(p0.x, p0.y);
                p1 = this.rotatePoint(p1.x, p1.y);
                p2 = this.rotatePoint(p2.x, p2.y);
                this.strokeLine(this.x + p0.x, this.y + p0.y, this.x + p1.x, this.y + p1.y);
                this.strokeLine(this.x + p0.x, this.y + p0.y, this.x + p2.x, this.y + p2.y);
                break;
            }
            case 'X': {
                // X shape: two crossing lines of length this.length
                let p1a = {x: 0, y: 0};
                let p1b = {x: this.length, y: this.length};
                let p2a = {x: 0, y: this.length};
                let p2b = {x: this.length, y: 0};
                p1a = this.rotatePoint(p1a.x, p1a.y);
                p1b = this.rotatePoint(p1b.x, p1b.y);
                p2a = this.rotatePoint(p2a.x, p2a.y);
                p2b = this.rotatePoint(p2b.x, p2b.y);
                this.strokeLine(this.x + p1a.x, this.y + p1a.y, this.x + p1b.x, this.y + p1b.y);
                this.strokeLine(this.x + p2a.x, this.y + p2a.y, this.x + p2b.x, this.y + p2b.y);
                break;
            }
            case 'W': {
                // W shape: 4 points zig-zag, connected in sequence, approx length segments
                // Points (relative): (0, length), (length/3, 0), (2*length/3, length), (length, 0)
                let points = [
                    {x: 0, y: this.length},
                    {x: this.length / 3, y: 0},
                    {x: 2 * this.length / 3, y: this.length},
                    {x: this.length, y: 0}
                ];
                // Rotate all points
                points = points.map(p => this.rotatePoint(p.x, p.y));
                // Draw lines between consecutive points
                for (let i = 0; i < points.length - 1; i++) {
                    this.strokeLine(this.x + points[i].x, this.y + points[i].y, this.x + points[i+1].x, this.y + points[i+1].y);
                }
                break;
            }
        }
    }

    update() {
        this.x += this.Vx;
        this.y += this.Vy;

        // Bounce off edges (considering max shape size = this.length*2 margin)
        if (this.x < this.length * 2) {
            this.Vx = -this.Vx;
            this.x = this.length * 2;
        }
        if (this.x > this.effect.width - this.length * 2) {
            this.Vx = -this.Vx;
            this.x = this.effect.width - this.length * 2;
        }
        if (this.y < this.length * 2) {
            this.Vy = -this.Vy;
            this.y = this.length * 2;
        }
        if (this.y > this.effect.height - this.length * 2) {
            this.Vy = -this.Vy;
            this.y = this.effect.height - this.length * 2;
        }

        this.drawShape();
    }

    reset() {
        this.x = Math.floor(Math.random() * (this.effect.width - this.length * 4)) + this.length * 2;
        this.y = Math.floor(Math.random() * (this.effect.height - this.length * 4)) + this.length * 2;
        this.Vx = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
        this.Vy = (Math.random() * 2 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
        this.rotation = Math.random() * 2 * Math.PI;
    }
}

class Effect {
    constructor(canvas) {
        this.canvas = canvas;
        this.c = this.canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight - document.getElementById('controls').offsetHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.lines = [];
        this.numberOfLines = 500;
    }

    createLines() {
        this.lines = [];
        for (let i = 0; i < this.numberOfLines; i++) {
            this.lines.push(new Line(this, this.c));
        }
    }

    animate() {
        this.c.clearRect(0, 0, this.width, this.height);
        for (const line of this.lines) {
            line.update();
        }
        requestAnimationFrame(this.animate.bind(this));
    }

    resetPositions() {
        for (const line of this.lines) {
            line.reset();
        }
    }
}

const canvas = document.getElementById('canvas');
const effect = new Effect(canvas);

function applySettings() {
    const input = document.getElementById('lineCountInput');
    const val = parseInt(input.value);
    if (val && val > 0 && val <= 2000) {
        effect.numberOfLines = val;
        effect.createLines();
    }
}
document.getElementById('applyBtn').onclick = () => {
    applySettings();
};
document.getElementById('resetBtn').onclick = () => {
    effect.resetPositions();
};

window.addEventListener('resize', () => {
    effect.width = window.innerWidth;
    effect.height = window.innerHeight - document.getElementById('controls').offsetHeight;
    canvas.width = effect.width;
    canvas.height = effect.height;
    effect.createLines();
});

effect.createLines();
effect.animate();
