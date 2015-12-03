var Table = function() {
    this.xPos = (w / 2) - 300;
    this.yPos = (h / 2) - 150;

    this.width = 600;
    this.height = 300;
    this.tableColor = '#035400'
    this.borderColor = '#663300';
    this.innerBorderColor = '#003300';
    this.border = 35;

    this.pockets = [
        { x: 5,              y: 5 },
        { x: this.width/2,   y: -5 },
        { x: this.width - 5, y: 5 },
        { x: 5,              y: this.height - 5 },
        { x: this.width/2,   y: this.height + 5 },
        { x: this.width - 5, y: this.height - 5 },
    ];
}

Table.prototype.draw = function(ctx) {
    var leftBorder = this.xPos - (this.border / 2.0);
    var rightBorder = leftBorder + this.width + this.border;
    var topBorder = this.yPos - (this.border / 2.0);
    var bottomBorder = topBorder + this.height + this.border;

    ctx.beginPath();
    ctx.moveTo(leftBorder, topBorder);
    ctx.lineTo(rightBorder, topBorder);
    ctx.lineTo(rightBorder, bottomBorder);
    ctx.lineTo(leftBorder, bottomBorder);
    ctx.lineTo(leftBorder, topBorder - this.border / 2.0);
    ctx.closePath();
    ctx.lineWidth = this.border;

    ctx.globalAlpha = 0.7;
    ctx.strokeStyle = this.borderColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.globalAlpha = 1;
    ctx.moveTo(this.xPos, this.yPos);
    ctx.lineTo(this.xPos + this.width, this.yPos);
    ctx.lineTo(this.xPos + this.width, this.yPos + this.height);
    ctx.lineTo(this.xPos, this.yPos + this.height);
    ctx.lineTo(this.xPos, this.yPos);
    ctx.closePath();

    ctx.lineWidth = 10;
    ctx.strokeStyle = this.innerBorderColor;
    ctx.stroke();

    ctx.beginPath();
    ctx.fillStyle = this.tableColor;
    ctx.fillRect(this.xPos, this.yPos, this.width, this.height);
    ctx.fill();
    ctx.closePath();

    // draw pockets
    for (var p = 0; p < this.pockets.length; p++) {
        var pocket = this.pockets[p];
        ctx.fillStyle = '#020202';
        ctx.beginPath();
        ctx.arc(this.xPos + pocket.x, this.yPos + pocket.y, 20, 0, Math.PI * 2, true);
        ctx.fill();
        ctx.closePath();
    }
}