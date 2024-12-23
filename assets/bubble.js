class Line {

    constructor(effect, c) {


        this.radius = Math.floor(Math.random() * 2) + 5;
        this.diameter = this.radius * 2;
        this.effect = effect;


        this.c = c;
        this.c.fillStyle = 'white';

        this.x = Math.floor(Math.random() * this.effect.width - (this.diameter * 2));

        this.y = Math.floor(Math.random() * this.effect.height - (this.diameter * 2));

        /*   this.color = `rgb(${this.x / this.effect.width * 255},${Math.floor(Math.random() * 255)},${this.y / this.effect.height * 255})`; */

        this.Vx =5;
        this.Vy = 0.5;
        this.pushX;
        this.pushY;
        // this.offset = Math.floor(Math.random() * this.diameter * 2);
    }


    stroke() {

        this.c.strokeStyle = this.color;
        this.c.lineWidth = this.width;

        this.c.beginPath();

        this.c.arc(this.x, this.y, this.radius, 0, 360)

        // this.c.stroke();
        this.c.fill();

        this.c.closePath();


    }


    update() {

        this.x += this.Vx;
        this.y += this.Vy;

        if (this.x < this.diameter) {

            this.Vx = - this.Vx;

            this.x = this.diameter;
        }


        if (this.x > this.effect.width - this.diameter) {

            this.Vx = - this.Vx;

            this.x = this.effect.width - this.diameter;

        }
        if (this.y < this.diameter) {

            this.Vy = - this.Vy;

            this.y = this.diameter;

        }

        if (this.y > this.effect.width - this.diameter) {

            this.Vy = -this.Vy;

            this.y = this.effect.width - this.diameter;

        }
        if (this.effect.mouse.pressed) {


            const dX = this.x - this.effect.mouse.x;
            const dY = this.y - this.effect.mouse.y;

            const distance = Math.hypot(dX, dY);

            if (distance < 400) {
                const angle = Math.atan2(dY, dX);


                this.pushX = Math.cos(angle);
                this.pushY = Math.sin(angle);

                this.x += this.pushX ;
                this.y += this.pushY ;

            }





        }


        this.stroke();
    }


    reset() {

        this.x = Math.floor(Math.random() * this.effect.width - (this.diameter));

        this.y = Math.floor(Math.random() * this.effect.height - (this.diameter ));

    }
}


class Effect {
    constructor(canvas, context) {

        this.width = canvas.width;
        this.height = canvas.height;

        this.LineCount = 250;
        this.LineArray = [];

        this.canvas = canvas;
        this.context = context;

        this.generateLines();
        this.mouse = { x: null, y: null, pressed: false };


        window.addEventListener('resize', () => {
            this.resize(window.innerWidth, window.innerHeight);

        })


        window.addEventListener('mousedown', (e) => {
            this.mouse.pressed = true;
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        })

        window.addEventListener('mousemove', (e) => {
            if (this.mouse.pressed) {
                this.mouse.x = e.clientX;
                this.mouse.y = e.clientY;
            }
        })
        window.addEventListener('mouseup', () => {
            this.mouse.pressed = false;

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
    context.fillStyle = "white";
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

