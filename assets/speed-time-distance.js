const canvas = document.querySelector('canvas');
console.log(canvas);
const ctx = canvas.getContext("2d");

ctx.strokeStyle = 'orange';

ctx.lineWidth = 4;

ctx.beginPath();
ctx.moveTo(canvas.width / 2, 0);
ctx.lineTo(canvas.width / 2, canvas.height);
ctx.stroke();
ctx.closePath();
ctx.beginPath();
ctx.moveTo(0, canvas.height / 2);
ctx.lineTo(canvas.width, canvas.height / 2);
ctx.stroke();
ctx.closePath();

const speeds = [20, 30, 40, 50, 60, 70, 80, 90, 100];

const distance = 40;

const timeToTravel = {};

const stringTe = (i) => `${distance < speeds[i] ? (distance / speeds[i] * 60).toPrecision(2) + 'm' : distance / speeds[i] + 'hr'} `


// ctx.moveTo(0, canvas.height / 2);
ctx.moveTo(canvas.width / 2, canvas.height / 2);
// ctx.arc(canvas.width / 2, canvas.height / 2 , 5 , 0 ,10);
for (let i = speeds.length; i >= 0; i--) {

    ctx.fillText(`${speeds[i]} km/h`, canvas.width / 2 - 50,- speeds[i] + 110, 200);

}
for (let i = speeds.length; i >= 0; i--) {

    ctx.beginPath();

    ctx.fillStyle = "purple";

    ctx.arc((canvas.width / 2) + (distance / speeds[i]) * 75 - 2, -speeds[i] +110, 3, 0, Math.PI * 2);
    ctx.font = "12px serif";
    // ctx.strokeText("Hello world", 50, 90);
    ctx.fillText(
        stringTe(i),
        (canvas.width / 2) + (distance / speeds[i]) * 75 + 4,
        -speeds[i] +110, 200
    )
    timeToTravel[i] = distance / speeds;

    ctx.fill();

    ctx.closePath();


}

const data = canvas.toDataURL('image/png')

// console.log(data);

// localStorage.setItem('data', data);


// console.log(localStorage.getItem('data'))
//     ;
canvas.addEventListener('click', () => {
    const a = document.createElement('a')

    a.href = String(data);
    a.innerText = "oooohell";
    console.log(a);
    a.target = "_blank";
    a.download = "my-canvas-png";
    document.body.appendChild(a);
})
