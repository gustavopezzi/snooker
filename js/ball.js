var bounceLoss = 0.6;
var tableFriction = 0.00005;
var elasticity = 0.8;
var refreshHz = 60;
var velocityCutoff = 0.01;
var mPerPixel = 0.0;
var colors = [
    '#ffffff', '#fed410', '#008dcb', '#c10000',
    '#8700b6', '#f2282a', '#00c400', '#e47300',
    '#00b2fc', '#880090', '#008800', '#008dcb',
    '#3cff4d', '#ff00ff', '#ff0000', '#121212'
];

var Ball = function(i) {
    this.r = 12;

    this.resetWhitePosition = function() {
        this.x = table.width/2 + 140;
        this.y = table.height/2;
        this.opacity = 1;
        this.xVelocity = 0;
        this.yVelocity = 0;
        this.xAccel = 0;
        this.yAccel = 0;
        this.bounceLoss = bounceLoss;
        this.tableFriction = tableFriction;
        this.c = colors[i];
    }

    // white ball
    // (0)
    if (i == 0) {
        this.resetWhitePosition();
    }

    // color balls
    // (1)
    //    (6)
    // (2)   (10)
    //    (7)   (13)
    // (3)   (11)  (15)
    //    (8)   (14)
    // (4)   (12)
    //    (9)
    // (5)
    switch (i) {
        // column 1
        case 1:  this.x = 40; this.y = 40;  break;
        case 2:  this.x = 40; this.y = 60;  break;
        case 3:  this.x = 40; this.y = 80;  break;
        case 4:  this.x = 40; this.y = 100; break;
        case 5:  this.x = 40; this.y = 120; break;
        // column 2
        case 6:  this.x = 64; this.y = 50;  break;
        case 7:  this.x = 64; this.y = 70;  break;
        case 8:  this.x = 64; this.y = 90;  break;
        case 9:  this.x = 64; this.y = 110; break;
        // column 3
        case 10: this.x = 88; this.y = 60;  break;
        case 11: this.x = 88; this.y = 80;  break;
        case 12: this.x = 88; this.y = 100; break;
        // column 4
        case 13: this.x = 110; this.y = 70; break;
        case 14: this.x = 110; this.y = 90; break;
        // column 5
        case 15: this.x = 132; this.y = 80; break;
    } 

    // gap from table border
    if (i > 0) {
        this.x += 70;
        this.y += 70;
    }
    
    this.opacity = 1;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAccel = 0;
    this.yAccel = 0;
    this.bounceLoss = bounceLoss;
    this.tableFriction = tableFriction;
    this.c = colors[i];

    this.index = i;
}

Ball.prototype.draw = function(table, ctx) {
    ctx.fillStyle = this.c;
    ctx.globalAlpha = this.opacity;
    ctx.beginPath();
    ctx.arc(this.x + table.xPos, this.y + table.yPos, this.r, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.closePath();
}

Ball.prototype.Update = function(table) {
    var dT = 1000 / refreshHz;
    this.xAccel = this.xVelocity * -this.tableFriction * dT;
    this.yAccel = this.yVelocity * -this.tableFriction * dT;
    this.yVelocity += this.yAccel * dT;
    this.xVelocity += this.xAccel * dT;
    this.y += this.yVelocity * dT;
    this.x += this.xVelocity * dT;

    var bounce = false;

    // ball at bottom edge 
    if (this.y >= table.height - this.r) {
        this.y = table.height - this.r;
        this.yVelocity = -this.yVelocity;
        this.yAccel = -this.yAccel;
        bounce = true;
    }
    // ball at top edge 
    else if (this.y <= this.r) {
        this.y = this.r;
        this.yVelocity = -this.yVelocity;
        this.yAccel = -this.yAccel;
        bounce = true;
    }

    // ball at right edge 
    if (this.x >= table.width - this.r) {
        this.x = table.width - this.r;
        this.xVelocity = -this.xVelocity;
        this.xAccel = -this.xAccel;
        bounce = true;
    }
    // ball at left edge 
    else if (this.x <= this.r) {
        this.x = this.r;
        this.xVelocity = -this.xVelocity;
        this.xAccel = -this.xAccel;
        bounce = true;
    }

    // update velocity
    if (bounce) {
        this.xVelocity *= this.bounceLoss;
        this.yVelocity *= this.bounceLoss;
    }

    if (Math.abs(this.xVelocity) + Math.abs(this.yVelocity) < velocityCutoff) {
        this.yVelocity = 0;
        this.yAccel = 0;
        this.xVelocity = 0;
        this.xAccel = 0;
    }
}

Ball.prototype.Strike = function(xImpact, yImpact) {
    this.xVelocity += xImpact;
    this.yVelocity += yImpact;
}

Ball.prototype.TestImpact = function() {
    for (var i = this.index + 1; i < balls.length; i++) {
        var ball = balls[i];
        
        if (Dist(this.x, this.y, ball.x, ball.y) > this.r + ball.r)
            continue;

        CollideBalls(this, ball);
    }
}