import utils from './utils';

let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');
canvas.width = innerWidth;
canvas.height = innerHeight;

let mouse = {
    x: innerWidth / 2,
    y: innerHeight / 2
};

const ballsNbr = 150;

const colors = [
    '#e28eff',
    '#00ff95',
    '#ccae6c',
    '#12b270'
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

function Particle(x, y, velocity, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: velocity.x,
        y: velocity.y
    };
    this.mass = 1;
    this.opacity = 0;
    this.radius = radius;
    this.color = color;
    
    this.update = (particles) => {
    
        this.draw();
     
        for (let i = 0; i < particles.length; i++) {
            if (this === particles[i]) continue;
            if (utils.getDistance(this.x, this.y, particles[i].x, particles[i].y) - this.radius * 2 < 0)
            {
                utils.resolveCollision(this, particles[i]);
            }
        }
    
        if (this.y + this.radius + this.velocity.y > canvas.height || this.y - this.radius < 0)
            this.velocity.y = -this.velocity.y;
        if (this.x + this.radius > canvas.width || this.x - this.radius < 0)
            this.velocity.x = -this.velocity.x;
       
        if (utils.getDistance(mouse.x, mouse.y, this.x, this.y) < 250 && this.opacity < 0.4) {
            this.opacity += 0.02;
        } else if (this.opacity > 0) {
            this.opacity -= 0.02;
            this.opacity = Math.max(0, this.opacity);
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;
    };

    this.draw = function() {
        c.beginPath();
        c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        c.save();
        c.globalAlpha = this.opacity;
        c.fillStyle = this.color;
        c.fill();
        c.restore();
        c.strokeStyle = this.color;
        c.stroke();
        c.closePath();
    };
}

let particles;
let mouseParticle;

function init() {
    particles = [];
    
    for (let i = 0; i < ballsNbr; i++) {
        const radius = utils.randomInt(10, 30);
        let x = utils.randomInt(radius, innerWidth - radius);
        let y = utils.randomInt(radius, innerHeight - radius);
        const color = utils.randomColor(colors);
        const velocity = {
            x: utils.randomInt(-1, 1),
            y: utils.randomInt(-1, 1)
        };

        if (i !== 0) {
            for (let j = 0; j < particles.length; j++) {
                if (utils.getDistance(x, y, particles[j].x, particles[j].y) - radius * 2 < 0)
                {
                    x = utils.randomInt(radius, innerWidth - radius);
                    y = utils.randomInt(radius, innerHeight - radius);
                    j = -1;
                }
            }
        }

        particles.push(new Particle(x, y, velocity, radius, color));
    }
    mouseParticle = new Particle(0, 0, {x:10, y:10}, 60, '#b2934d');
    particles.push(mouseParticle);
}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, innerWidth, innerHeight);
    mouseParticle.x = mouse.x;
    mouseParticle.y = mouse.y;
    particles.forEach(particle => {
        particle.update(particles);
    })
}

init();
animate();