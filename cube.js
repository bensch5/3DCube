const LINE_WIDTH = 5;

class Point {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

function rotatePoint2d(point, angle) {
    const matrix = [
        [Math.cos(angle), -Math.sin(angle)],
        [Math.sin(angle), Math.cos(angle)]
    ];
    const pointVector = [point.x, point.y];
    const result = [];
    for (let i = 0; i < 2; i++) {
        let sum = 0;
        for (let j = 0; j < 2; j++) {
            sum += matrix[i][j] * pointVector[j];
        }
        result.push(sum);
    }
    point.x = result[0];
    point.y = result[1];
}

function multiplyPointWithMatrix3d(point, matrix) {
    const pointVector = [point.x, point.y, point.z];
    const result = [];
    for (let i = 0; i < 3; i++) {
        let sum = 0;
        for (let j = 0; j < 3; j++) {
            sum += matrix[i][j] * pointVector[j];
        }
        result.push(sum);
    }
    
    point.x = result[0];
    point.y = result[1];
    point.z = result[2];
}

function rotatePoint3d(point, alpha, beta, gamma) {
    const matrix = [
        [Math.cos(alpha) * Math.cos(beta), Math.cos(alpha) * Math.sin(beta) * Math.sin(gamma) - Math.sin(alpha) * Math.cos(gamma), Math.cos(alpha) * Math.sin(beta) * Math.cos(gamma) + Math.sin(alpha) * Math.sin(gamma)],
        [Math.sin(alpha) * Math.cos(beta), Math.sin(alpha) * Math.sin(beta) * Math.sin(gamma) + Math.cos(alpha) * Math.cos(gamma), Math.sin(alpha) * Math.sin(beta) * Math.cos(gamma) - Math.cos(alpha) * Math.sin(gamma)],
        [-Math.sin(beta), Math.cos(beta) * Math.sin(gamma), Math.cos(beta) * Math.cos(gamma)]
    ];
    multiplyPointWithMatrix3d(point, matrix);
}

function scalePoint3d(point, scale) {
    const matrix = [
        [scale, 0, 0],
        [0, scale, 0],
        [0, 0, scale]
    ];
    multiplyPointWithMatrix3d(point, matrix);
}

function drawPoint(context, point) {
    context.fillRect(point.x + ORIGIN_X, point.y + ORIGIN_Y, 5, 5);
}

function drawLine(context, from, to) {
    context.beginPath();
    context.moveTo(from.x + ORIGIN_X, from.y + ORIGIN_Y);
    context.lineTo(to.x + ORIGIN_X, to.y + ORIGIN_Y);
    context.closePath();
    context.stroke();
}

function drawFace(context, points, color) {
    context.fillStyle = color;
    context.beginPath();
    context.moveTo(points[0].x + ORIGIN_X, points[0].y + ORIGIN_Y);
    for (let i = 1; i < points.length; i++) {
        context.lineTo(points[i].x + ORIGIN_X, points[i].y + ORIGIN_Y);
    }
    context.closePath();
    context.fill();
}

function setCanvasSize() {
    WIDTH = window.innerWidth;
    HEIGHT = window.innerHeight;
    canvas.width = WIDTH;
    canvas.height = HEIGHT;
    ORIGIN_X = WIDTH / 2;
    ORIGIN_Y = HEIGHT / 2;
}

// INIT CANVAS
const canvas = document.getElementById("myCanvas");
setCanvasSize();
addEventListener("resize", setCanvasSize);

// DEFINE CUBE POINTS
const topLeftFront = new Point(-1, -1, -1);
const topRightFront = new Point(1, -1, -1);
const bottomLeftFront = new Point(-1, 1, -1);
const bottomRightFront = new Point(1, 1, -1);

const topLeftBack = new Point(-1, -1, 1);
const topRightBack = new Point(1, -1, 1);
const bottomLeftBack = new Point(-1, 1, 1);
const bottomRightBack = new Point(1, 1, 1);

// CONFIGURE ROTATION AND SCALING
const alpha = 0.1 * (Math.PI / 180); // z axis
const beta = 0.3 * (Math.PI / 180); // y axis
const gamma = 0.2 * (Math.PI / 180); // x axis
const scaleFactor = 1.04;
const maxScaleSteps = 125;

function mainLoop() {
    const context = canvas.getContext("2d");
    context.lineWidth = LINE_WIDTH;
    context.clearRect(0, 0, WIDTH, HEIGHT);

    // ROTATE POINTS
    rotatePoint3d(topLeftFront, alpha, beta, gamma);
    rotatePoint3d(topRightFront, alpha, beta, gamma);
    rotatePoint3d(bottomLeftFront, alpha, beta, gamma);
    rotatePoint3d(bottomRightFront, alpha, beta, gamma);

    rotatePoint3d(topLeftBack, alpha, beta, gamma);
    rotatePoint3d(topRightBack, alpha, beta, gamma);
    rotatePoint3d(bottomLeftBack, alpha, beta, gamma);
    rotatePoint3d(bottomRightBack, alpha, beta, gamma);

    // SCALE POINTS
    if (currentScaleCount <= maxScaleSteps) {
        scalePoint3d(topLeftFront, scaleFactor);
        scalePoint3d(topRightFront, scaleFactor);
        scalePoint3d(bottomLeftFront, scaleFactor);
        scalePoint3d(bottomRightFront, scaleFactor);
        
        scalePoint3d(topLeftBack, scaleFactor);
        scalePoint3d(topRightBack, scaleFactor);
        scalePoint3d(bottomLeftBack, scaleFactor);
        scalePoint3d(bottomRightBack, scaleFactor);

        currentScaleCount++;
    }

    // DEFINE FACES
    const pointsFront = [topLeftFront, topRightFront, bottomRightFront, bottomLeftFront];
    const pointsBack = [topLeftBack, topRightBack, bottomRightBack, bottomLeftBack];
    const pointsLeft = [topLeftFront, topLeftBack, bottomLeftBack, bottomLeftFront];
    const pointsRight = [topRightFront, topRightBack, bottomRightBack, bottomRightFront];
    const pointsTop = [topLeftFront, topRightFront, topRightBack, topLeftBack];
    const pointsBottom = [bottomLeftFront, bottomRightFront, bottomRightBack, bottomLeftBack];
    
    // DRAW FACES
    const color1 = "#ff000088";
    drawFace(context, pointsFront, color1);
    drawFace(context, pointsBack, color1);
    const color2 = "#ffff0088";
    drawFace(context, pointsLeft, color2);
    drawFace(context, pointsRight, color2);
    const color3 = "#ffa50088";
    drawFace(context, pointsTop, color3);
    drawFace(context, pointsBottom, color3);

    requestAnimationFrame(mainLoop);
}

let currentScaleCount = 0;
mainLoop();
