// get amount of balls using the formula of triangular numbers
var baseOfTriangle = 5;
var N = ((baseOfTriangle * (baseOfTriangle + 1)) / 2) + 1;

var balls = [];
var table;
var w = window.innerWidth;
var h = window.innerHeight;
var startTablePadding = {x: 70, y: 70};
var minVelocity = 0.0001;
var mouseDownX = 0;
var mouseDownY = 0;
var mouse = {
    down: false,
    button: 1,
    x: 0,
    y: 0,
    px: 0,
    py: 0
};

function getRandomColor() {
    var letters = '0123456789'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++)
        color += letters[Math.floor(Math.random() * 10)];
    return color;
}

function Dist(x1, y1, x2, y2) {
    var diffX = x2 - x1;
    var diffY = y2 - y1;
    return Math.sqrt((diffX * diffX) + (diffY * diffY));
}

function CollideBalls(ball, ball2) {
    var Del = ball2.r + ball.r;
    var dX = ball2.x - ball.x;
    var dY = ball2.y - ball.y;
    var dVX = ball2.xVelocity - ball.xVelocity;
    var dVY = ball2.yVelocity - ball.yVelocity;
    var dSq = dX * dX + dY * dY;
    var alpha = (1 + elasticity) / 2 * (dX * dVX + dY * dVY) / dSq;

    ball.xVelocity += dX * alpha;
    ball.yVelocity += dY * alpha;
    ball2.xVelocity -= dX * alpha;
    ball2.yVelocity -= dY * alpha;

    var DDist = ((Del + 1) / Math.sqrt(dSq) - 1) / 2;
    ball.x -= dX * DDist;
    ball.y -= dY * DDist;
    ball2.x += dX * DDist;
    ball2.y += dY * DDist;
}

function HitBall() {
    var tempBall = balls[0];
    
    if (tempBall.xVelocity > 0.001 || tempBall.yVelocity > 0.001)
        return;

    if (Dist(tempBall.x + table.xPos, tempBall.y + table.yPos, mouseDownX, mouseDownY) < tempBall.r) {
        var dX = mouseDownX - mouse.x;
        var dY = mouseDownY - mouse.y;
        tempBall.Strike(dX / 200.0, dY / 200.0);
    }
}

function TestPocket(ball) {
    for (var p = 0; p < table.pockets.length; p++) {
        if (Dist(ball.x + table.xPos, ball.y + table.yPos, table.xPos + table.pockets[p].x, table.yPos + table.pockets[p].y) < 25) {
            if (ball.index == 0)
                ball.resetWhitePosition();
            else {
                this.removeBall(ball);
                if (balls.length <= 1)
                    location.reload();
            }
        }
    }
}

function removeBall(ball) {
    balls.splice(ball.index, 1);
    colors.splice(ball.index, 1);
    N--;
    balls.forEach(function(b, i) {
        b.index = i;
    });
    console.log(balls);
}

$(document).ready(function() {
    var canvas = document.querySelector('canvas');
    var ctx = canvas.getContext('2d');

    canvas.width = w;
    canvas.height = h;

    var MouseHandler = {
        onmousedown: function(e) {
            mouse.button = e.which;
            mouse.px = mouse.x;
            mouse.py = mouse.y;
            var rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
            mouse.down = true;
            mouseDownX = mouse.x;
            mouseDownY = mouse.y;
            e.preventDefault();
        },
        onmouseup: function(e) {
            mouse.down = false;
            HitBall();
            e.preventDefault();
        },
        onmousemove: function(e) {
            if (mouse.down == true) {
                mouse.px = mouse.x;
                mouse.py = mouse.y;

                var rect = canvas.getBoundingClientRect();
                mouse.x = e.clientX - rect.left;
                mouse.y = e.clientY - rect.top;
            }
        }
    };

    window.requestAnimFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / refreshHz);
            };
    })();

    window.onload = function() {
        canvas.onmousedown = MouseHandler.onmousedown;
        canvas.onmouseup = MouseHandler.onmouseup;
        canvas.onmousemove = MouseHandler.onmousemove;

        canvas.ontouchstart = MouseHandler.onmousedown;
        canvas.ontouchend = MouseHandler.onmouseup;
        canvas.ontouchmove = MouseHandler.onmousemove;

        draw();
    };

    function DrawMouse() {
        ctx.beginPath();
        ctx.moveTo(mouseDownX, mouseDownY);
        ctx.lineTo(mouse.x, mouse.y);
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.4)';
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    (function init() {
        table = new Table();

        balls.push(new Ball(0));
        
        for (var i = 1; i < N; i++)
            balls.push(new Ball(i)); 
    })();

    function draw() {
        ctx.clearRect(0, 0, w, h);
        table.draw(ctx);
        
        for (var i = 0; i < balls.length; i++) {
            var temp = balls[i];
            temp.TestImpact();
            TestPocket(temp);
            temp.Update(table);
            temp.draw(table, ctx);
        }

        if (mouse.down == true)
            if (Dist(balls[0].x + table.xPos, balls[0].y + table.yPos, mouseDownX, mouseDownY) < balls[0].r)
                if (balls[0].xVelocity < minVelocity && balls[0].yVelocity < minVelocity)
                    DrawMouse();

        requestAnimFrame(draw);
    }
});