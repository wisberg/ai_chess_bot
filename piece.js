class Piece {
  constructor(type, ctx, x, y, color) {
    this.type = type;
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.color = color;
    this.draw(this.type);
  }

  draw(type) {
    switch (type) {
      case "pawn":
        drawPawn(this.x, this.y, this.color, this.ctx);
    }
  }
  drawPawn(x, y, color, ctx) {
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y - 20, 20, Math.PI, 0);
    ctx.lineTo(x + 20, y + 20);
    ctx.lineTo(x - 20, y + 20);
    ctx.closePath();
    ctx.fill();

    // Draw pawn head
    ctx.beginPath();
    ctx.arc(x, y - 40, 10, 0, Math.PI * 2);
    ctx.closePath();
    ctx.fill();
  }
}
