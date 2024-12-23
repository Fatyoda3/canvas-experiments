const canvas = document.querySelector('canvas');
canvas.width = 1300;
canvas.height = 1300;
const ctx = canvas.getContext('2d');

ctx.fillStyle = "orange";
ctx.strokeStyle = 'orange';
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2)
ctx.stroke();

ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height)
ctx.stroke();
function drawWave() {

    for (let index = 0; index < canvas.width; index++) {
        ctx.beginPath();
        ctx.arc(index, Math.sin(index * 0.01) * 100 + (canvas.height / 2), 2, 0, 360);
        ctx.fill();
        ctx.closePath();
    }

}

function drawParabola(initial) {

    // //
    // for (let index = initial || 150; index < canvas.width; index++) {
    //     if (index == initial || 150) {
    //
    //

    for (let index = initial; index < canvas.width; index++) {
        if (index == initial) {
            ctx.moveTo(0, canvas.width / 2 - (index * index * 0.01));

            ctx.lineTo(canvas.width, canvas.width / 2 - (index * index * 0.01));

            ctx.stroke();


            /*    ctx.moveTo(0, canvas.width / 2 - (index * index * 0.01));
   
               ctx.lineTo(canvas.width, canvas.width / 2 - (index * index * 0.01));
   
               ctx.stroke(); */


        }

        ctx.beginPath();
        ctx.arc((canvas.width) / 2 - index, canvas.width / 2 - (index * index * 0.01), 20, 0, 6);
        ctx.stroke();
        ctx.closePath();


        ctx.beginPath();
        ctx.arc(canvas.width / 2 + index, canvas.width / 2 - (index * index * 0.01), 5, 0, 6);
        ctx.fill();
        ctx.closePath();
    }

}

drawParabola(120);
// drawWave();

console.log(Math.trunc(Math.PI * 2));