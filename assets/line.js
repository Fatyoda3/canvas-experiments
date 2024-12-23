class Line {

    constructor(effect, c) {

        this.length = Math.floor(Math.random() * 25) + 10;

        this.width = Math.floor(Math.random() * 5) + 2;

        this.effect = effect;


        this.c = c;

        this.x = Math.floor(Math.random() * this.effect.width - (this.length * 2));

        this.y = Math.floor(Math.random() * this.effect.height - (this.length * 2));

        this.color = `rgb(${this.x / this.effect.width * 255},${Math.floor(Math.random() * 255)},${this.y / this.effect.height * 255})`;

        this.Vx = 1;
        this.Vy = 2;
        this.offset = Math.floor(Math.random() * this.length * 2);
    }


    strokeLine() {

        this.c.strokeStyle = this.color;
        this.c.lineWidth = this.width;

        this.c.beginPath();

        this.c.moveTo(this.x, this.y);
        this.c.lineTo(this.x + this.offset, this.y + this.length * 2);

        this.c.stroke();

        this.c.closePath();


    }


    update() {

        this.x += this.Vx;
        this.y += this.Vy;

        if (this.x < this.length) {

            this.Vx = - this.Vx;

            this.x = this.length;
        }


        if (this.x > this.effect.width - this.length) {

            this.Vx = - this.Vx;

            this.x = this.effect.width - this.length;

        }
        if (this.y < this.length) {

            this.Vy = - this.Vy;

            this.y = this.length;

        }

        if (this.y > this.effect.width - this.length) {

            this.Vy = -this.Vy;

            this.y = this.effect.width - this.length;

        }
        this.strokeLine();
    }


    reset() {

        this.x = Math.floor(Math.random() * this.effect.width - (this.length * 2));

        this.y = Math.floor(Math.random() * this.effect.height - (this.length * 2));

    }
}


class Effect {
    constructor(canvas, context) {

        this.width = canvas.width;
        this.height = canvas.height;

        this.LineCount = 500;
        this.LineArray = [];

        this.canvas = canvas;
        this.context = context;

        this.generateLines();



        window.addEventListener('resize', () => {
            this.resize(window.innerWidth, window.innerHeight);

        })


    }

    generateLines() {


        for (let i = 0; i < this.LineCount; i++)
            this.LineArray[i] = (new Line(this, this.context));

    }

    handleLines() {
        for (let i = 0; i < this.LineCount; i++) {

            this.LineArray[i].update();

        }

    }
    resize(w, h) {

        this.width = w;
        this.height = h;

        this.canvas.width = w;
        this.canvas.height = h;

        this.LineArray.forEach(p => {

            p.reset();

        })

    }



}




window.addEventListener('load', () => {


    const canvas = document.querySelector('canvas');
    const context = canvas.getContext('2d');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;


    const screen = new Effect(canvas, context);







    const animate = () => {

        context.clearRect(0, 0, canvas.width, canvas.height);

        screen.handleLines();

        requestAnimationFrame(animate);

    }

    animate();

})

