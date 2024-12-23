// import dat from './dat.gui';

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');
const rangeBar = document.querySelector("#bar");

var t;
const mouse = {
    x: null,

    y: null,

    pressed: false
}

window.addEventListener('mouseup', (e) => {
    if (mouse.pressed) mouse.pressed = false;


})
window.addEventListener('mousedown', (e) => {
    if (!mouse.pressed) mouse.pressed = true;
    mouse.x = e.clientX
    mouse.y = e.clientY



})
window.addEventListener('mousemove', (e) => {
    mouse.pressed = true;
    mouse.x = e.clientX
    mouse.y = e.clientY

})

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

c.fillStyle = 'white';
c.strokeStyle = "white"

class p {
    constructor(effect, c) {
        this.effect = effect;
        this.c = c;

        this.radius = Math.floor(Math.random() * 30) + 10;
        this.diameter = this.radius * 2;
        this.x; this.y;

    }

    draw(x, y) {
        this.x = x;
        this.y = y;
        this.c.beginPath();
        this.c.fillStyle = `rgb(${Math.floor(Math.random() * 255)} , ${Math.floor(Math.random() * 255)} , 0)`;
        this.c.arc(x || Math.floor(Math.random() * 255), y || Math.floor(Math.random() * 255), this.radius, 0, 360);
        this.c.fill();
        this.c.closePath();
    }
    update(x, y) {
        this.x = x;
        this.y = y;
        this.draw(this.x, this.y);


    }
    mouseMovement() {
        // console.log(this.x, this.y);
        if (mouse.x === this.x * this.radius && mouse.y === this.y * this.radius) {
            console.log('object');
        }

    }



}

/* rangeBar.addEventListener('input', (e) => {

    t = e.target.value;
    t = parseInt(t);

    // animate();

}) */

/* function animate() {

    c.clearRect(0, 0, canvas.width, canvas.height);
    // requestAnimationFrame(animate);
    for (let index = 0; index < canvas.width; index++) {
        if (index % 24 == 0)
            pArr.push(new p(canvas, c));

        pArr[index].draw(canvas.height / 2 + Math.cos(index * 0.01) * t, index);
        for (let k = 0; k < canvas.height; k++) {
            if (index % 100 == 0)

                pArr[index].draw(canvas.height / 2 + Math.cos(index * 0.01) * t, index + k);
            // pArr[index].draw(canvas.width / 2 + Math.cos(index * 0.01) * t, index + k);



        }



    }



    pArr.forEach(p => pArr.pop());
    console.log(pArr);
}

const pArr = [];

 */

let arr = [];
let coordinate = [];
const drawTriangle = () => {

    if (arr.length != 0)
        arr = [];


    if (coordinate.length != 0)
        coordinate = []


    for (let index = 0; index < 3; index++) {
        coordinate.push({ x: (Math.floor(Math.random() * canvas.width / 2 + 1)), y: Math.floor((Math.random() * canvas.height / 2 + 1)) })
        arr.push(new p(canvas, c));

        arr[index].draw(coordinate[index].x, coordinate[index].y);

    }


    for (let index = 0; index < 3; index++) {

        let next = index + 1

        if (next < 3) {
            c.moveTo(coordinate[index].x, coordinate[index].y);
            c.lineTo(coordinate[next].x, coordinate[next].y);
            c.stroke();
        }
        else {
            c.moveTo(coordinate[index].x, coordinate[index].y);
            c.lineTo(coordinate[0].x, coordinate[0].y);
            c.stroke()
        }



    }






}

// drawTriangle();


const animate = () => {

    c.clearRect(0, 0, canvas.width, canvas.height);

    drawTriangle();



    // arr.forEach(p => { p.draw(); p.mouseMovement() });

    setTimeout(() => requestAnimationFrame(animate), 1000)
}

animate();