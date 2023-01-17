import utils from './utils';

let canvas = document.querySelector('canvas');
let c = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(window.innerWidth);
console.log(window.innerHeight);
const starsNbr = 1;

const colors = [
    '#bfa421',
    '#7f6d16',
    '#ffda2b',
    '#E5C427'
];

let gravity = 1;
let friction = 0.9;

addEventListener("resize", function(event) {
    canvas.width = window.innerWidth;
    canvas.heigt = window.innerHeight;
    init();
});

addEventListener("click", function(event) {
    init();
});

function Star(x, y, radius, color) {
    this.x = x;
    this.y = y;
    this.velocity = {
        x: (Math.random() - 0.5) * 8,
        y: 3
    };
    this.friction = 0.59;
    this.gravity = 1;
    this.mass = 1;
    this.radius = radius;
    this.color = color;
}

Star.prototype.draw = function() {
    c.save();
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = this.color;
    c.shadowColor = '#e3eaef';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
}

Star.prototype.update = function() {
    this.draw();

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
        this.shatter();
    } else {
        this.velocity.y += this.gravity;
    }

    if (this.x + this.radius + this.velocity.x > canvas.width || this.x - this.radius <= 0) {
        this.velocity.x = -this.velocity.x * this.friction;
        this.shatter();
    }

    this.y += this.velocity.y;
    this.x += this.velocity.x;
}

Star.prototype.shatter = function() {
    this.radius -= 3;
    for (let i = 0; i < 8; i++) {
        miniStars.push(new MiniStar(this.x, this.y, 2));
    }
}

function MiniStar(x, y, radius, color) {
    Star.call(this, x, y, radius, color);
    this.velocity = {
        x: utils.randomFloat(-5, 5),
        y: utils.randomFloat(-15, 15)
    };
    this.friction = 0.8;
    this.gravity = 0.1;
    this.ttl = 100;
    this.opacity = 1;
}

MiniStar.prototype.draw = function() {
    c.save()
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = `rgba(227, 234, 239, ${this.opacity})`;
    c.shadowColor = '#e3eaef';
    c.shadowBlur = 20;
    c.fill();
    c.closePath();
    c.restore();
}

MiniStar.prototype.update = function() {
    this.draw();

    if (this.y + this.radius + this.velocity.y > canvas.height - groundHeight) {
        this.velocity.y = -this.velocity.y * this.friction;
    } else {
        this.velocity.y += this.gravity;
    }
    this.x += this.velocity.x;
    this.y += this.velocity.y;
    this.ttl -= 1;
    this.opacity -= 1 / this.ttl; 
}

function createMountainRange(mountainAmount, height, color) {
    for (let i = 0; i < mountainAmount; i++) {
        const mountainWidth = canvas.width / mountainAmount;
        c.beginPath();
        c.moveTo(i, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth + 325, canvas.height);
        c.lineTo(i * mountainWidth + mountainWidth / 2, canvas.height - height);
        c.lineTo(i * mountainWidth - 325, canvas.height);
        c.fillStyle = color;
        c.fill();
        c.closePath();
    }
}


const backgroundGradient = c.createLinearGradient(0, 0, 0, canvas.height);
backgroundGradient.addColorStop(0, '#171e26');
backgroundGradient.addColorStop(1, '#3f586b');

let stars;
let miniStars;
let backgroundStars;
let ticker = 0;
let randomSpawnRate = 75;
let groundHeight = 100;

function init() {
    stars = [];
    miniStars = [];
    backgroundStars = [];

    for (let i = 0; i < 150; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const radius = Math.random() * 3;
        backgroundStars.push(new Star(x, y, radius, '#e3eaef'));
    }
}

function animate() {
    requestAnimationFrame(animate);

    c.fillStyle = backgroundGradient;
    c.fillRect(0, 0, canvas.width, canvas.height);

    backgroundStars.forEach((backgroundStar) => {
        backgroundStar.draw();
    })

    createMountainRange(1, canvas.height - 150, '#384551');
    createMountainRange(2, canvas.height - 250, '#2b3843');
    createMountainRange(3, canvas.height - 700, '#26333e');
    c.fillStyle = "#182028";
    c.fillRect(0, canvas.height - groundHeight, canvas.width, groundHeight);

    stars.forEach((star, index) => {
        star.update();
        if (star.radius <= 0) {
            stars.splice(index, 1);
        }
    });
    
    miniStars.forEach((miniStar, index) => {
        miniStar.update();
        if (miniStar.ttl <= 0) {
            miniStars.splice(index, 1);
        }
    });

    ticker++;

    if (ticker % randomSpawnRate == 0) {
        const radius = utils.randomInt(12, 30);
        const x = Math.max(radius, (Math.random() * canvas.width - radius));
        stars.push(new Star(x, -100, radius, 'white'))
        randomSpawnRate = utils.randomInt(75, 100);
    }
}

init();
animate();