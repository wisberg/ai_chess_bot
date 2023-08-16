class Board {
  constructor(board, ctx) {
    this.width = board.width;
    this.height = board.height;
    this.spaces = [];
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.selectedPiece = null;
    this.createBoard();
    this.pieceToMove = "white";
    this.canvas.addEventListener("click", (event) => this.handleClick(event));
  }

  resetBoard() {
    this.selectedPiece = null;
    this.setupInitialBoardState();
    this.pieceToMove = "white";
  }

  handleClick(event) {
    console.log(this.pieceToMove);
    const clickedSpace = this.getSpaceByLocation(event.clientX, event.clientY);
    if (!this.selectedPiece) {
      if (clickedSpace && clickedSpace.piece) {
        this.selectedPiece = clickedSpace.piece;
        this.selectedPiece.isActive = true;
        this.reDrawBoard();
        this.selectedPiece.isActive = false;
      }
    } else {
      if (this.selectedPiece.color !== this.pieceToMove) {
        this.selectedPiece.isActive = false;
        this.selectedPiece = null;
        this.reDrawBoard();
      } else {
        if (clickedSpace) {
          //If you click on the same space twice, deactivate the piece
          const oldSpace = this.getSpaceByPiece(this.selectedPiece);
          if (clickedSpace.piece) {
            if (
              clickedSpace === oldSpace ||
              clickedSpace.piece.color === this.selectedPiece.color
            ) {
              this.selectedPiece.isActive = false;
              this.selectedPiece = null;
              this.reDrawBoard();
            } else {
              if (this.selectedPiece.availableSpaces.includes(clickedSpace)) {
                this.selectedPiece.pieceMove(clickedSpace, oldSpace);
                this.switchPieceToMove();
                this.selectedPiece = null;
                this.reDrawBoard();
              }
              this.selectedPiece = null;
            }
          } else {
            if (this.selectedPiece.availableSpaces.includes(clickedSpace)) {
              this.switchPieceToMove();
              this.selectedPiece.pieceMove(clickedSpace, oldSpace);
              this.selectedPiece = null;
              this.reDrawBoard();
            } else {
              this.selectedPiece = null;
              this.reDrawBoard();
            }
          }
        }
      }
    }
  }

  switchPieceToMove() {
    if (this.pieceToMove === "white") {
      this.pieceToMove = "black";
    } else {
      this.pieceToMove = "white";
    }
  }

  showAvailableSpaces() {
    const selectedSpace = this.getSpaceByPiece(this.selectedPiece);
    let availableOffsets = [];
    if (this.selectedPiece) {
      switch (this.selectedPiece.type) {
        case "pawn":
          const forwardOffset = [];
          if (this.selectedPiece.color === "white") {
            forwardOffset.push({ i: -1, j: 0 });
            if (this.selectedPiece.i === 7) {
              forwardOffset.push({ i: -2, j: 0 });
            }
          } else {
            // Black pawn
            forwardOffset.push({ i: 1, j: 0 });
            if (this.selectedPiece.i === 2) {
              forwardOffset.push({ i: 2, j: 0 });
            }
          }

          const captureOffsets = [
            { i: -1, j: -1 },
            { i: -1, j: 1 },
          ];

          const initialSpace = this.getSpaceByPiece(this.selectedPiece);

          for (const offset of forwardOffset) {
            const targetI = initialSpace.i + offset.i;
            const targetJ = initialSpace.j + offset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            // Check if the forward space is available and empty
            if (targetSpace && !targetSpace.piece) {
              this.selectedPiece.availableSpaces.push(targetSpace);
              this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
              this.ctx.fillRect(
                (targetSpace.j - 1) * targetSpace.width,
                (targetSpace.i - 1) * targetSpace.height,
                targetSpace.width,
                targetSpace.height
              );
            }
          }

          // Check for capturing diagonally
          for (const captureOffset of captureOffsets) {
            const targetI = initialSpace.i + captureOffset.i;
            const targetJ = initialSpace.j + captureOffset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            if (
              targetSpace &&
              targetSpace.piece &&
              targetSpace.piece.color !== this.selectedPiece.color
            ) {
              this.selectedPiece.availableSpaces.push(targetSpace);
              this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
              this.ctx.fillRect(
                (targetSpace.j - 1) * targetSpace.width,
                (targetSpace.i - 1) * targetSpace.height,
                targetSpace.width,
                targetSpace.height
              );
            }
          }
          break;

        case "knight":
          //Movement Logic for a knight
          availableOffsets = [
            { i: -2, j: -1 },
            { i: -2, j: 1 },
            { i: -1, j: -2 },
            { i: -1, j: 2 },
            { i: 1, j: -2 },
            { i: 1, j: 2 },
            { i: 2, j: -1 },
            { i: 2, j: 1 },
          ];
          for (const offset of availableOffsets) {
            const targetI = selectedSpace.i + offset.i;
            const targetJ = selectedSpace.j + offset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            if (targetSpace) {
              if (targetSpace.piece !== null) {
                if (targetSpace.piece.color !== this.selectedPiece.color) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  // Add a green glow to the available spaces
                  //this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                }
              } else {
                // Add a green glow to the available spaces
                this.selectedPiece.availableSpaces.push(targetSpace);
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                this.ctx.fillRect(
                  (targetSpace.j - 1) * targetSpace.width,
                  (targetSpace.i - 1) * targetSpace.height,
                  targetSpace.width,
                  targetSpace.height
                );
              }
            }
          }
          break;
        case "bishop":
          //Movement Logic for a white bishop
          break;
        case "queen":
          //Movement Logic for a white queen
          break;
        case "king":
          //Movement Logic for a white king
          availableOffsets = [
            { i: -1, j: -1 },
            { i: -1, j: 1 },
            { i: 1, j: -1 },
            { i: 1, j: 1 },
            { i: 1, j: 0 },
            { i: 0, j: 1 },
            { i: -1, j: 0 },
            { i: 0, j: -1 },
          ];
          for (const offset of availableOffsets) {
            const targetI = selectedSpace.i + offset.i;
            const targetJ = selectedSpace.j + offset.j;

            const targetSpace = this.getSpaceByIJ(targetI, targetJ);

            if (targetSpace) {
              if (targetSpace.piece !== null) {
                if (targetSpace.piece.color !== this.selectedPiece.color) {
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  // Add a green glow to the available spaces
                  //this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                }
              } else {
                // Add a green glow to the available spaces
                this.selectedPiece.availableSpaces.push(targetSpace);
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                this.ctx.fillRect(
                  (targetSpace.j - 1) * targetSpace.width,
                  (targetSpace.i - 1) * targetSpace.height,
                  targetSpace.width,
                  targetSpace.height
                );
              }
            }
          }
          break;
        case "rook":
          //Movement Logic for a rook
          const rookOffsets = [
            { i: -1, j: 0 }, // Up
            { i: 1, j: 0 }, // Down
            { i: 0, j: -1 }, // Left
            { i: 0, j: 1 }, // Right
          ];

          for (const offset of rookOffsets) {
            let targetI = selectedSpace.i + offset.i;
            let targetJ = selectedSpace.j + offset.j;

            while (true) {
              const targetSpace = this.getSpaceByIJ(targetI, targetJ);

              if (!targetSpace) {
                break; // Exit the loop if out of bounds
              }

              if (!targetSpace.piece) {
                // Empty space, highlight it
                this.selectedPiece.availableSpaces.push(targetSpace);
                this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                this.ctx.fillRect(
                  (targetSpace.j - 1) * targetSpace.width,
                  (targetSpace.i - 1) * targetSpace.height,
                  targetSpace.width,
                  targetSpace.height
                );
              } else {
                // Space has a piece, check its color
                if (targetSpace.piece.color !== this.selectedPiece.color) {
                  // Opponent's piece, highlight and stop searching in this direction
                  this.selectedPiece.availableSpaces.push(targetSpace);
                  this.ctx.fillStyle = "rgba(0, 255, 0, 0.2)";
                  this.ctx.fillRect(
                    (targetSpace.j - 1) * targetSpace.width,
                    (targetSpace.i - 1) * targetSpace.height,
                    targetSpace.width,
                    targetSpace.height
                  );
                }
                break; // Stop searching in this direction
              }

              // Move to the next space in the same direction
              targetI += offset.i;
              targetJ += offset.j;
            }
          }
          break;
      }
    }
  }

  getSpaceByLocation(x, y) {
    // Calculate the row (i) and column (j) based on the coordinates
    const i = Math.floor(y / (this.height / 8) + 0.5);
    const j = Math.floor(x / (this.width / 8));

    console.log(this.height, this.width);

    // Find and return the space associated with the calculated coordinates
    for (const space of this.spaces) {
      if (space.i === i && space.j === j) {
        return space;
      }
    }
    // Return null if no space is found
    return null;
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
          ""
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
        piece.draw(); // Draw the piece after updating its position
      }
    }
  }

  getSpaceByPiece(piece) {
    for (const space of this.spaces) {
      if (space.piece === piece) {
        return space;
      }
    }
    return null;
  }

  getSpaceByIJ(i, j) {
    for (const space of this.spaces) {
      if (space.i === i && space.j === j) {
        return space;
      }
    }
    // Return null if no space is found
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
  reDrawBoard() {
    for (const space of this.spaces) {
      this.ctx.fillStyle = space.color;
      this.ctx.fillRect(
        (space.j - 1) * space.width,
        (space.i - 1) * space.height,
        space.width,
        space.height
      );
    }

    for (const space of this.spaces) {
      if (space.piece) {
        space.piece.draw();
      }
    }
    this.showAvailableSpaces();
  }
}
