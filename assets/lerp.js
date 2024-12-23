const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 600;

c.fillStyle = "#ffdfdf";
c.strokeStyle = "orange";
c.lineWidth = 5;

const A = {
    x: 650, y: 350
};
const B = {
    x: 150, y: 120
};


const E = {
    x: 650, y: 250
};
const D = {
    x: 350, y: 136
};




function drawLine(p1, p2) {
    c.beginPath();
    c.moveTo(p1.x, p1.y);
    c.lineTo(p2.x, p2.y);

    c.stroke();
}

function addText(T, P) {
    c.font = "bold 30px Arial";
    c.save();
    c.fillStyle = "black";
    c.fillText(T, P.x, P.y, 150);
    c.textAlign = 'center';
    c.textBaseline = "middle";
    c.restore();
}

function animate() {
    /*     let k = 0.05;
        lerp1.x += k;
        lerp2.x += k;
        lerp1.y += k;
        lerp2.y += k; */



    const lerp1 = lerp(A, B);

    const lerp2 = lerp(D, E);

    c.clearRect(0, 0, canvas.width, canvas.height);

    drawCircle(A);
    drawCircle(B);

    drawCircle(E);
    drawCircle(D);

    drawLine(A, B);
    drawLine(E, D);


    addText('A', A);
    addText('B', B);
    addText('E', E);
    addText('D', D);



    drawCircle(lerp1);
    drawCircle(lerp2);


    setTimeout(() => {
        requestAnimationFrame(animate);

    }, 512);
}
/**@lerp not pure lerp but vector lerp */

function lerp(p1, p2) {
    let t = Math.random();

    let x = p1.x + (p2.x - p1.x) * t;//before i was adding Math.random();

    let y = p1.y + (p2.y - p1.y) * t;

    return {
        x: x, y: y
    }
}



function drawCircle(p) {
    c.save();
    c.beginPath();
    c.arc(p.x, p.y, 25, 0, 360);
    c.fill();
    c.restore();
}


const a = new Uint8Array([1,2,3,4,5]);

console.log(a);

animate();