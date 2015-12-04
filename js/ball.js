var bounceLoss = 0.6;
var tableFriction = 0.00005;
var elasticity = 0.8;
var refreshHz = 60;
var velocityCutoff = 0.01;
var mPerPixel = 0.0;
var colors = [
    '#ffffff', '#fed410', '#008dcb', '#c10000',
    '#8700b6', '#f2282a', '#00c400', '#e47300',
    '#00b2fc', '#330090', '#008800', '#440055',
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

    this.getStartPosition = function(index) {
        col = 1;
        row = 0;
        end = baseOfTriangle;
        i = 0;

        while (true) {
            i++;

            if (row >= end) {
                row = 1;
                col++;
                end--;
            }
            else {
                row++;
            }
            
            if (i >= index)
                return { col: col, row: row };
        }
    }

    // white ball
    if (i == 0)
        this.resetWhitePosition();

    // color balls
    if (i > 0) {
        col = this.getStartPosition(i).col;
        row = this.getStartPosition(i).row;

        this.x = startTablePadding.x + col * (2 * this.r) + 2;
        this.y = startTablePadding.y + (this.r * col) + row * (2 * this.r);
    }

    this.opacity = 1;
    this.xVelocity = 0;
    this.yVelocity = 0;
    this.xAccel = 0;
    this.yAccel = 0;
    this.bounceLoss = bounceLoss;
    this.tableFriction = tableFriction;
    this.c = (i == 0)? '#ffffff' : getRandomColor();
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
