class Board {
  constructor(board, ctx) {
    this.width = board.width;
    this.height = board.height;
    this.spaces = [];
    this.ctx = ctx;
    this.createBoard();
  }

  createBoard() {
    for (let i = 1; i <= 8; i++) {
      for (let j = 1; j <= 8; j++) {
        let color =
          (i + j) % 2 === 0 ? "rgb(220,190,130)" : "rgb(150, 100, 50)"; //light dark
        const space = new Space(
          color,
          this.width / 8,
          this.height / 8,
          i,
          j,
          ctx,
          "pawn"
        );
        this.spaces.push(space);
      }
    }
  }
  setupInitialBoardState() {
    for (let i = 0; i < this.spaces.length; i++) {
      let color = "";
      let pieceType = "";
      if (i < 16) {
        color = "black";
      } else {
        color = "white";
      }
      if (i < 16 || i > 47) {
        if (i > 7 && i < 16) {
          pieceType = "pawn";
        }
        if (i > 47 && i < 56) {
          pieceType = "pawn";
        }
        if (i === 4 || i === 60) {
          pieceType = "king";
        }
        if (i === 0 || i === 7 || i === 56 || i === 63) {
          pieceType = "rook";
        }
        if (i === 1 || i === 6 || i === 57 || i === 62) {
          pieceType = "knight";
        }
        if (i === 2 || i === 5 || i === 58 || i === 61) {
          pieceType = "bishop";
        }
        if (i === 3 || i === 59) {
          pieceType = "queen";
        }

        const space = this.spaces[i];

        const piece = new Piece(
          pieceType,
          this.ctx,
          0,
          0,
          color,
          space.width / 2
        );
        space.associatePiece(piece);

        const x = (space.j - 0.5) * space.width; // Adjusted x calculation
        const y = (space.i - 0.5) * space.height; // Adjusted y calculation
        piece.updatePosition(x, y);
        piece.setBoard(this);
        piece.draw(); // Draw the piece after updating its position
      }
    }
  }
  updateSpaces(piece, targetSpace) {
    const sourceSpace = this.getSpaceByPiece(piece);
    sourceSpace.piece = null; // Clear the source space
    targetSpace.piece = piece; // Set the target space
    piece.updatePosition(
      targetSpace.x + targetSpace.width / 2,
      targetSpace.y + targetSpace.height / 2
    );
  }

  getSpaceByPiece(piece) {
    for (const space of this.spaces) {
      if (space.piece === piece) {
        return space;
      }
    }
    return null;
  }

  drawBoard() {
    for (const space of this.spaces) {
      this.ctx.fillStyle = space.color;
      this.ctx.fillRect(
        (space.j - 1) * space.width,
        (space.i - 1) * space.height,
        space.width,
        space.height
      );
    }
  }
}
