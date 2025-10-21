import React, { useEffect, useState } from "react";
import { getRandomShape } from "../utils/shapes";

export default function Board() {
  const rows = 12;
  const cols = 35;

  const [activePiece, setActivePiece] = useState(null);
  const [activePosition, setActivePosition] = useState(null);
  const [nextPiece, setNextPiece] = useState(getRandomShape());

  const [board, setBoard] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(null))
  );

  function spawnPiece() {
    setActivePiece(nextPiece);
    setActivePosition({ x: 5, y: 1 });
    setNextPiece(getRandomShape());
  }

  function rotatePiece(piece) {
    const rotatedMatrix = piece.matrix[0].map((_, i) =>
      piece.matrix.map((row) => row[i]).reverse()
    );

    const newPiece = { ...piece, matrix: rotatedMatrix };

    const kicks = [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ];

    for (const kick of kicks) {
      const testPosition = {
        x: activePosition.x + kick.x,
        y: activePosition.y + kick.y,
      };

      let fits = true;

      for (let r = 0; r < rotatedMatrix.length; r++) {
        for (let c = 0; c < rotatedMatrix[r].length; c++) {
          if (!rotatedMatrix[r][c]) continue;

          const x = testPosition.x + c;
          const y = testPosition.y + r;

          if (x < 0 || x >= cols || y < 0 || y >= rows || board[y][x]) {
            fits = false;
            break;
          }
        }
        if (!fits) break;
      }

      if (fits) {
        setActivePosition(testPosition);
        return newPiece;
      }
    }

    return piece;
  }

  function canMove(nextPosition) {
    if (!activePiece) return false;

    for (let r = 0; r < activePiece.matrix.length; r++) {
      for (let c = 0; c < activePiece.matrix[r].length; c++) {
        if (activePiece.matrix[r][c]) {
          const x = nextPosition.x + c;
          const y = nextPosition.y + r;

          if (x < 0 || x >= cols || y < 0 || y >= rows || board[y][x]) {
            return false;
          }
        }
      }
    }

    return true;
  }

  function solidifyPiece() {
    const newBoard = board.map((row) => [...row]);

    activePiece.matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (cell) {
          const y = activePosition.y + r;
          const x = activePosition.x + c;
          newBoard[y][x] = activePiece.type;
        }
      });
    });

    for (let col = 0; col < cols; col++) {
      let isFull = true;
      for (let row = 0; row < rows; row++) {
        if (!newBoard[row][col]) {
          isFull = false;
          break;
        }
      }

      if (isFull) {
        for (let row = 0; row < rows; row++) {
          newBoard[row].splice(col, 1);
          newBoard[row].unshift(null);
        }
      }
    }

    setBoard(newBoard);
    spawnPiece();
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setActivePiece(rotatePiece(activePiece));
      }
      if (event.key === "ArrowRight") {
        if (canMove({ x: activePosition.x + 1, y: activePosition.y })) {
          setActivePosition((pos) => ({ x: pos.x + 1, y: pos.y }));
        }
      }
      if (event.key === "ArrowDown") {
        if (canMove({ x: activePosition.x, y: activePosition.y + 1 })) {
          setActivePosition((pos) => ({ x: pos.x, y: pos.y + 1 }));
        }
      }
      if (event.key === "ArrowUp") {
        if (canMove({ x: activePosition.x, y: activePosition.y - 1 })) {
          setActivePosition((pos) => ({ x: pos.x, y: pos.y - 1 }));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPosition = { x: activePosition.x + 1, y: activePosition.y };
      if (canMove(nextPosition)) {
        setActivePosition(nextPosition);
      } else {
        solidifyPiece();
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [canMove, activePosition]);

  useEffect(() => {
    spawnPiece();
  }, []);

  const shapeColors = {
    I: "bg-cyan-400",
    O: "bg-yellow-400",
    T: "bg-purple-400",
    S: "bg-green-400",
    Z: "bg-red-400",
    J: "bg-blue-400",
    L: "bg-orange-400",
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Tablero */}
      <div
        className="board grid"
        style={{
          gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          aspectRatio: `${cols} / ${rows}`,
        }}
      >
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            let value = cell;

            if (activePiece && activePosition) {
              for (let r = 0; r < activePiece.matrix.length; r++) {
                for (let c = 0; c < activePiece.matrix[r].length; c++) {
                  if (activePiece.matrix[r][c]) {
                    const y = activePosition.y + r;
                    const x = activePosition.x + c;
                    if (y === rowIndex && x === colIndex) {
                      value = activePiece.type;
                    }
                  }
                }
              }
            }

            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`border border-blue-800 w-10 h-10 ${
                  value ? shapeColors[value] : "bg-gray-900"
                }`}
              />
            );
          })
        )}
      </div>

      {/* Panel de próxima pieza */}
      <div className="next-piece-panel text-center">
        <h2 className="text-white mb-1">Próxima pieza</h2>
        <div
          className="grid justify-center"
          style={{
            gridTemplateRows: `repeat(${nextPiece.matrix.length}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${nextPiece.matrix[0].length}, minmax(0, 1fr))`,
          }}
        >
          {nextPiece.matrix.map((row, rIdx) =>
            row.map((cell, cIdx) => (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`w-6 h-6 border border-blue-800 ${
                  cell ? shapeColors[nextPiece.type] : "bg-gray-900"
                }`}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}