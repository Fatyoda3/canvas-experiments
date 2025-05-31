const canvas = document.getElementById("canvas");
const c = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;


class Triangle {
  constructor() {
    this.vertices = this.generateVertices();
    this.targetVertices = this.generateVertices();
    this.color = this.randomColor();
    this.frame = 0;
    this.maxFrames = 300; 
  }

  generateVertices() {
    return Array.from({ length: 3 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
    }));
  }

  randomColor() {
    return `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`;
  }

  update() {
    this.frame++;
    if (this.frame >= this.maxFrames) {
      this.vertices = this.targetVertices;
      this.targetVertices = this.generateVertices();
      this.color = this.randomColor();
      this.frame = 0;
    }
  }

  draw() {
    const interpolated = this.vertices.map((v, i) => ({
      x: this.lerp(v.x, this.targetVertices[i].x),
      y: this.lerp(v.y, this.targetVertices[i].y),
    }));

    
    c.beginPath();
    c.moveTo(interpolated[0].x, interpolated[0].y);
    for (let i = 1; i < 3; i++) {
      c.lineTo(interpolated[i].x, interpolated[i].y);
    }
    c.closePath();
    c.fillStyle = this.color;
    c.fill();

    
    c.strokeStyle = this.color;
    c.lineWidth = 2;
    c.stroke();

    
    for (const v of interpolated) {
      const gradient = c.createRadialGradient(v.x, v.y, 0, v.x, v.y, 10);
      gradient.addColorStop(0, '#fff');
      gradient.addColorStop(1, this.color);
      c.beginPath();
      c.fillStyle = gradient;
      c.arc(v.x, v.y, 5, 0, Math.PI * 2);
      c.fill();
    }
  }

  lerp(start, end) {
    return start + ((end - start) * this.frame) / this.maxFrames;
  }
}


const NUM_TRIANGLES = 5;
const triangles = Array.from({ length: NUM_TRIANGLES }, () => new Triangle());

function animate() {
  c.clearRect(0, 0, canvas.width, canvas.height);
  for (const triangle of triangles) {
    triangle.update();
    triangle.draw();
  }
  requestAnimationFrame(animate);
}

animate();
