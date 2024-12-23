let share = 10;


class Line {
    constructor(x, y, effect, c) {

        this.x = x;
        this.y = y;

        this.radius = Math.floor(Math.random() * 3) + 2;
        this.diameter = this.radius * 2;
        this.effect = effect;


        this.c = c;

        // this.c.fillStyle = 'white';

        // this.x = offset * Math.random() + this.effect.width / 2;

        // this.y = offset * Math.random() + this.effect.height / 2;

        this.color = `rgb(${Math.floor(Math.random() * 255)},${Math.floor(Math.random() * 127)},${Math.floor(Math.random() * 127)})`;
        this.radians = Math.random() * Math.PI * 2;

        // this.radians = 50 * Math.random();

        this.V = 0.01;

        //range function ( Max - Min + 1 )
        this.factor = 50 + share;
        // this.factor = (150 * Math.random()) + 52;
        // this.factor = 100 * Math.random() + 50;
        // this.offset = Math.floor(Math.random() * this.diameter * 2);
        share += 5;
        console.log(share);
    }


    strokeCircle(lastPoint) {

        this.c.fillStyle = this.color;

        this.c.lineWidth = this.width;


        this.c.beginPath();

        this.c.arc(this.x, this.y, this.radius, 0, 360)

        this.c.fill();

        this.c.closePath();

        /* 
                this.c.beginPath();
        
                this.c.arc(this.x + 50, this.y + 100, this.radius, 0, 360);
                this.c.fill();
        
                this.c.closePath();
        
                this.c.beginPath();
        
                this.c.arc(this.x + 150, this.y + 100, this.radius, 0, 360);
                this.c.fill();
                this.c.closePath();
        
                this.c.beginPath();
        
                this.c.arc(this.x + 250, this.y + 100, this.radius, 0, 360)
         */
        // this.c.arc(this.x + 50, this.y+100, this.radius, 0, 360)
        // this.c.arc(this.x + 150, this.y+100, this.radius, 0, 360)
        // this.c.arc(this.x + 150, this.y+100, this.radius, 0, 360) create a cool triangle


        this.c.fill();
        this.c.closePath();
        /* 
                this.c.beginPath();
                this.c.fillStyle = this.color;
                this.c.lineWidth = 15
                this.c.moveTo(lastPoint.x, lastPoint.y);
                this.c.lineTo(this.x, this.y);
                this.c.stroke();
                this.c.closePath(); */


    }


    update(x, y) {
        const lastPoint = { x: this.x, y: this.y };

        this.radians += this.V;

        if (this.radians > 360 && this.radians < 1)
            this.radians = - this.radians;


        // const x1 = Math.cos(this.radians);
        // const y2 = Math.sin(this.radians);

        this.x = this.effect.mouse.x + Math.floor(Math.cos(this.radians) * this.factor);

        this.y = this.effect.mouse.y + Math.floor(Math.sin(this.radians) * this.factor);

        // this.x = x + Math.floor(Math.cos(this.radians) * this.factor);
        // this.y = y + Math.floor(Math.sin(this.radians) * this.factor);

        /*        if (this.factor > 450)//this was the bug
                   this.factor = -this.factor;
       
               this.factor++; */






        this.strokeCircle(lastPoint);
    }


    reset() {

        this.x = this.effect.width / 2 - (this.diameter);

        this.y = this.effect.height / 2 - (this.diameter);

    }
}


class Effect {

    constructor(canvas, context) {

        this.width = canvas.width;
        this.height = canvas.height;

        this.LineCount = 100;
        this.LineArray = [];

        this.canvas = canvas;
        this.context = context;

        this.generateParticles();
        this.mouse = { x: this.canvas.width / 2, y: this.canvas.height / 2, pressed: false };


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

    generateParticles() {


        for (let i = 0; i < this.LineCount; i++)
            this.LineArray[i] = (new Line(this.canvas.width / 2, this.canvas.height / 2, this, this.context));

    }

    handleLines() {
        for (let i = 0; i < this.LineCount; i++) {

            this.LineArray[i].update(this.canvas.width / 2, this.canvas.height / 2);
            /*        this.LineArray[i].update(this.canvas.width / 3, this.canvas.height / 3);
                   this.LineArray[i].update(this.canvas.width / 4, this.canvas.height / 4);
                   this.LineArray[i].update(this.canvas.width / 5, this.canvas.height / 5); */
            /*       this.LineArray[i].update(this.canvas.width / 8, this.canvas.height / 2);
                  this.LineArray[i].update(Math.floor(this.canvas.width/1.1), this.canvas.height / 2); */

        }

    }
    resize(w, h) {
        // resetFILL();
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

    /*     function resetFILL() {
            context.fillStyle = "white";
    
        }
     */




    const animate = () => {

        // context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = 'rgb(0,0,0,0.05)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        (() => {
            context.save();
            context.strokeStyle = 'white';
            context.moveTo(canvas.width / 2, 0);
            context.lineTo(canvas.width / 2, canvas.height);

            context.moveTo(0, canvas.height / 2);
            context.lineTo(canvas.width, canvas.height / 2);
            context.stroke();

            context.restore();

        })()

        screen.handleLines();


        requestAnimationFrame(animate);

    }

    animate();

})

