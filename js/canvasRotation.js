import utils from './utils';

let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

const particlesNbr = 100;

const colors = [
    '#7f0900',
    '#ff5648',
    '#ff1300',
    '#7f2d26'
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

function Particle(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = utils.randomFloat(0.03, 0.06);
    this.mass = 1;
    this.opacity = 0;
    this.radius = radius;
    this.color = color;
    this.radians = Math.random() * Math.PI * 2;
    // FUNNY STUFF
    this.distanceFromCenter = {
        x: utils.randomInt(50, 120), 
        y: utils.randomInt(50, 120)
    };
    // this.distanceFromCenter = utils.randomInt(50, 120);
    this.lastMouse = {
        x: x,
        y: y
    };

    this.update = (particles) => {
    
        const lastPoint = { x: this.x, y: this.y };
        this.radians += this.velocity;
     
        this.lastMouse.x += (mouse.x - this.lastMouse.x) * 0.05;
        this.lastMouse.y += (mouse.y - this.lastMouse.y) * 0.05;

        this.x = this.lastMouse.x + Math.cos(this.radians) * this.distanceFromCenter.x;
        this.y = this.lastMouse.y + Math.sin(this.radians) * this.distanceFromCenter.y;
        this.draw(lastPoint);
    };

    this.draw = lastPoint => {
        c.beginPath();
        c.strokeStyle = this.color;
        c.lineWidth = this.radius;
        c.moveTo(lastPoint.x, lastPoint.y);
        c.lineTo(this.x, this.y);
        c.stroke();
        c.closePath();
    };
}

let particles;

function init() {

    particles = [];
    
    for (let i = 0; i < particlesNbr; i++) {
        const radius = utils.randomInt(1, 3);
        const color = utils.randomColor(colors);
        particles.push(new Particle(mouse.x, mouse.y, radius, color));
    }
}

function animate() {
    requestAnimationFrame(animate);
    c.fillStyle = 'rgba(255, 255, 255, 0.05';
    c.fillRect(0, 0, innerWidth, innerHeight);
    particles.forEach(e => {
        e.update();
    });
}

init();
animate();