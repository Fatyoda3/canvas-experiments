

const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d');
const rangeBar = document.querySelector("#bar");

var t;


canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
c.fillStyle = 'white';
c.strokeStyle = "white"

class p {
    constructor(effect, c) {
        this.effect = effect;
        this.c = c;

        this.radius = Math.floor(Math.random() * 5) + 2;
        this.diameter = this.radius * 2;
    }

    draw(x, y) {
        this.c.beginPath();
        this.c.fillStyle = `rgb(${Math.floor(255 * Math.random())} , 127 , 255)`;
        this.c.arc(x, y, this.radius, 0, 360);
        this.c.fill();
        this.c.closePath();
    }

}

rangeBar.addEventListener('input', (e) => {

    t = e.target.value;
    t = parseInt(t);

    
})


function animate() {
    let RAND = Math.random() * 128 + 1
    c.clearRect(0, 0, canvas.width, canvas.height);
    requestAnimationFrame(animate);
    for (let index = 0; index < canvas.width; index++) {

        pArr.push(new p(canvas, c));

        // if (index % 12 == 0)
        pArr[index].draw(index, canvas.height / 2 + Math.cos(index * 0.1) * RAND);
        pArr[index].draw(index, canvas.height / 3 + Math.cos(index * 0.01) * RAND * 3);
        pArr[index].draw(index, canvas.height / 4 + Math.cos(index * 0.01) * RAND * 2);


    }



}

const pArr = [];

pArr.forEach(p => pArr.pop());

setTimeout(() => {

    animate()
}, 160);;


