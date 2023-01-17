import utils from './utils'

let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

const colors = [
    '#2185c5',
    '#7ecefd',
    '#fff6e5',
    '#ff7f66'
];

let gravity = 1;
let friction = 0.9;

addEventListener("mousemove", function(event){
    mouse.x = event.clientX;
    mouse.y = event.clientY;    
});

addEventListener("resize", function(event) {
    canvas.width = innerWidth;
    canvas.heigt = innerHeight;

    init();
});

addEventListener("click", function(event) {
    init();
});

function Circle(x, y, dx, dy, radius, color) {
    this.x = x;
    this.y = y;
    this.dx = dx;
    this.dy = dy;
    this.radius = radius;
    this.color = color;

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.fillStyle = this.color;
        c.stroke();
        c.fill();
    }
    this.update = function() {
        this.draw();
   }
}

var ball;
let circle1;
let circle2;

function init() {
    circle1 = new Circle(300, 300, 1, 1, 100, utils.randomColor(colors));
    circle2 = new Circle(undefined, undefined, 0, 0, 30, 'red');
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
   
    circle1.update();
    circle2.x = mouse.x;
    circle2.y = mouse.y;
    circle2.update();

    if (utils.getDistance(circle1.x, circle1.y, circle2.x, circle2.y) < circle1.radius + circle2.radius) {
        circle1.color = 'blue';
    } else {
        circle1.color = 'yellow';
    }
}

init();
animate();