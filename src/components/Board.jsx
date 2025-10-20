import React, { useEffect, useState } from "react";
import { getRandomShape } from "../utils/shapes";

export default function Board() {
  const rows = 12;
  const cols = 35;

  const [activePiece, setActivePiece] = useState(null);
  const [activePosition, setActivePosition] = useState(null);

  const [board, setBoard] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(null))
  );

  function spawnPiece() {
    setActivePiece(getRandomShape());
    setActivePosition({ x: 5, y: 1 }); // x = horizontal, y = vertical
  }

  function rotatePiece(piece) {
    return piece;
  }

  function canMove(nextPosition) {
    return true;
  }

  function solidifyPiece() {
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

  //GRAVEDAD HORIZONTAL

  useEffect(() => {
    const interval = setInterval(() => {
      const nextPosition = { x: activePosition.x + 1, y: activePosition.y };
      if (canMove(nextPosition)) {
        setActivePosition(nextPosition);
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
  );
}