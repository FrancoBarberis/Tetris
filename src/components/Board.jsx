import React, { useEffect, useState } from "react";
import { getRandomShape } from "../utils/shapes";
import BoardBackground from "../assets/Eevee 4k.jpg";
import BoardVideo from "../assets/EeveeVid.mp4";
import Logo from "../assets/poketrisLOGO.png";

export default function Board() {
  const rows = 12;
  const cols = 30;

  const [activePiece, setActivePiece] = useState(null);
  const [activePosition, setActivePosition] = useState(null);
  const [nextPiece, setNextPiece] = useState(getRandomShape());
  const [score, setScore] = useState(0);

  const [board, setBoard] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(null))
  );

  function spawnPiece() {
    setActivePiece(nextPiece);
    setActivePosition({ x: -1, y: 5 });
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

    let linesCleared = 0;

    for (let col = 0; col < cols; col++) {
      let isFull = true;
      for (let row = 0; row < rows; row++) {
        if (!newBoard[row][col]) {
          isFull = false;
          break;
        }
      }

      if (isFull) {
        linesCleared++;
        for (let row = 0; row < rows; row++) {
          newBoard[row].splice(col, 1);
          newBoard[row].unshift(null);
        }
      }
    }

    if (linesCleared > 0) {
      setScore(prev => prev + linesCleared * 100);
    }

    setBoard(newBoard);
    spawnPiece();
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        setActivePiece(rotatePiece(activePiece));
      }
      if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
        if (canMove({ x: activePosition.x + 1, y: activePosition.y })) {
          setActivePosition((pos) => ({ x: pos.x + 1, y: pos.y }));
        }
      }
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        if (canMove({ x: activePosition.x, y: activePosition.y + 1 })) {
          setActivePosition((pos) => ({ x: pos.x, y: pos.y + 1 }));
        }
      }
      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
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
    }, 600);
    return () => clearInterval(interval);
  }, [canMove, activePosition]);

  useEffect(() => {
    spawnPiece();
  }, []);

  useEffect(() => {
    const scoreInterval = setInterval(() => {
      setScore(prev => prev + 1);
    }, 1000);
    return () => clearInterval(scoreInterval);
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
    <div className="flex flex-col items-start space-y-6 w-full h-full">
      {/* Header con título, próxima pieza y puntaje */}
      <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-t from-amber-500 to-amber-700 text-white">
        <img
          className="h-15 object-contain"
          src={Logo}
          alt="Pokétris Logo"
        />

        <div className="flex flex-col items-center">
          <span className="text-lg font-semibold mb-2">NEXT</span>
          <div
            className="grid"
            style={{
              gridTemplateRows: `repeat(${nextPiece.matrix.length}, minmax(0, 1fr))`,
              gridTemplateColumns: `repeat(${nextPiece.matrix[0].length}, minmax(0, 1fr))`,
            }}
          >
            {nextPiece.matrix.map((row, rIdx) =>
              row.map((cell, cIdx) => (
                <div
                  key={`${rIdx}-${cIdx}`}
                  className={`w-6 h-6 border ${
                    cell ? "bg-black" : "bg-transparent"
                  }`}
                />
              ))
            )}
          </div>
        </div>

        <span className="text-2xl font-bold ">Score: {score}</span>
      </div>

      {/* Tablero */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div
          className="relative board grid overflow-hidden"
          style={{
            gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
            gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
            aspectRatio: `${cols} / ${rows}`,
            backgroundColor: "red",
            width: 'min(90vw, 960px)'
          }}
        >
          {/* Video de fondo */}
          <video
            src={BoardVideo}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Overlay para atenuar el video de fondo */}
          <div className="absolute inset-0 bg-black opacity-40 pointer-events-none" />
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
                className={`border border-black opacity-100 contrast-200 w-8 h-8 ${
                  value ? shapeColors[value] : "bg-transparent"
                }`}
              />
            );
          })
        )}
        </div>
      </div>
    </div>
  );
}