import React, { useEffect, useState } from "react";
import { getRandomShape, resetBag } from "../utils/shapes";
import GameOverModal from "./GameOverModal";
import BoardBackground from "../assets/Eevee 4k.jpg";
import BoardVideo from "../assets/EeveeVid.mp4";
import Logo from "../assets/poketrisLOGO.png";

export default function Board() {
  const rows = 10;
  const cols = 25;
  // Preview config (ajustado para que las celdas del preview sean w-6 h-6 => 24px)
  const previewCell = 24; // px (w-6 h-6)
  const previewBox = 72; // px caja fija

  const [activePiece, setActivePiece] = useState(null);
  const [activePosition, setActivePosition] = useState(null);
  const [nextPiece, setNextPiece] = useState(getRandomShape());
  const [score, setScore] = useState(0);

  const [board, setBoard] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(null))
  );
  const [gameOver, setGameOver] = useState(false);

  function spawnPiece() {
    // Posición de inicio: completamente a la izquierda (fuera del tablero)
    // usando el ancho de la pieza para que ninguna celda nazca dentro
    const shapeWidth = nextPiece.matrix[0].length;
    const shapeHeight = nextPiece.matrix.length;
    const startPos = { x: -shapeWidth, y: Math.max(Math.floor((rows - shapeHeight) / 2), 0) };

    // comprobar colisión en spawn: solo consideramos solapamiento con celdas
    // ya ocupadas dentro de los límites del tablero. Si la pieza está
    // parcialmente fuera (y < 0 o x fuera), no consideramos eso como game over.
    let collision = false;
    for (let r = 0; r < nextPiece.matrix.length; r++) {
      for (let c = 0; c < nextPiece.matrix[r].length; c++) {
        if (!nextPiece.matrix[r][c]) continue;
        const y = startPos.y + r;
        const x = startPos.x + c;
        // Solo si está dentro del tablero comprobamos solapamiento
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          if (board[y][x]) {
            collision = true;
            break;
          }
        }
      }
      if (collision) break;
    }

    if (collision) {
      setGameOver(true);
      return;
    }

    setActivePiece(nextPiece);
    setActivePosition(startPos);
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

          // If outside right/bottom -> invalid
          if (x >= cols || y >= rows) {
            fits = false;
            break;
          }

          // If outside left/top, ignore for collision (allowed during spawn/entering)
          if (x < 0 || y < 0) continue;

          if (board[y][x]) {
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

          // If moving outside right or bottom -> invalid
          if (x >= cols || y >= rows) return false;

          // If outside left/top, allow (piece can enter the board)
          if (x < 0 || y < 0) continue;

          // Otherwise check collision with settled blocks
          if (board[y][x]) return false;
        }
      }
    }

    return true;
  }

  function solidifyPiece() {
    const newBoard = board.map((row) => [...row]);

    // Detectar si alguna celda de la pieza queda fuera del tablero al solidificar
    let outOfBounds = false;
    activePiece.matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const y = activePosition.y + r;
        const x = activePosition.x + c;
        // Si la celda está fuera de los límites, marcar outOfBounds
        if (y < 0 || y >= rows || x < 0 || x >= cols) {
          outOfBounds = true;
          return;
        }
        // Solo escribir dentro del tablero
        newBoard[y][x] = activePiece.type;
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

    if (outOfBounds) {
      // Si alguna celda quedó fuera al solidificar, es game over
      setGameOver(true);
      return;
    }

    // después de solidificar, intentar spawnear la siguiente
    spawnPiece();
  }

  function restartGame() {
    setBoard(Array.from({ length: rows }, () => Array(cols).fill(null)));
    resetBag();
    setScore(0);
    setGameOver(false);
    setNextPiece(getRandomShape());
    setActivePiece(null);
    setActivePosition(null);
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
    I: "bg-teal-600 text-white",
    O: "bg-yellow-500 text-black",
    T: "bg-indigo-700 text-white",
    S: "bg-emerald-600 text-white",
    Z: "bg-pink-600 text-white",
    J: "bg-blue-700 text-white",
    L: "bg-amber-600 text-black",
  };

  return (
    <div className="flex flex-col items-start space-y-6 w-full h-full">
      {/* Header con título, próxima pieza y puntaje */}
  <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-t from-amber-500 to-amber-700 text-white" style={{ minHeight: 80 }}>
        <img
          className="h-15 object-contain"
          src={Logo}
          alt="Pokétris Logo"
        />

        <div className="flex flex-col items-center justify-center" style={{ minWidth: 72 }}>
          <span className="text-lg font-semibold mb-1">NEXT</span>
          {/* Caja fija y centrada para preview; las celdas se posicionan dentro */}
          <div
            style={{
              position: 'relative',
              width: `${previewBox}px`,
              height: `${previewBox}px`,
            }}
          >
            {(() => {
              const matrixH = nextPiece.matrix.length * previewCell;
              const matrixW = nextPiece.matrix[0].length * previewCell;
              const topOffset = Math.max((previewBox - matrixH) / 2, 0);
              const leftOffset = Math.max((previewBox - matrixW) / 2, 0);

              return nextPiece.matrix.map((row, rIdx) =>
                row.map((cell, cIdx) =>
                  cell ? (
                    <div
                      key={`${rIdx}-${cIdx}`}
                      className={`${shapeColors[nextPiece.type]} border border-black`}
                      style={{
                        position: 'absolute',
                        width: `${previewCell}px`,
                        height: `${previewCell}px`,
                        left: leftOffset + cIdx * previewCell,
                        top: topOffset + rIdx * previewCell,
                      }}
                    />
                  ) : null
                )
              );
            })()}
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

          {/* Overlay para atenuar el video de fondo. Su opacidad baja cuando está el modal abierto para que el modal destaque pero el tablero siga visible */}
          <div className={`absolute inset-0 bg-black pointer-events-none ${gameOver ? 'opacity-20' : 'opacity-40'}`} />
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
                className={`border border-black opacity-100 contrast-200 w-10 h-10 ${
                  value ? shapeColors[value] : "bg-transparent"
                }`}
              />
            );
          })
        )}
        </div>
      </div>
      {/* El tablero siempre se renderiza; el modal aparece encima como un popup */}
      {gameOver && (
        <GameOverModal score={score} onRestart={restartGame} />
      )}
    </div>
  );
}