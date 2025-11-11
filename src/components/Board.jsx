import React, { useEffect, useState, useRef } from "react";
import { getRandomShape, resetBag } from "../utils/shapes";
import GameOverModal from "./GameOverModal";
import BoardBackground from "../assets/Eevee 4k.jpg";
import BoardVideo from "../assets/EeveeVid.mp4";
import Logo from "../assets/poketrisLOGO.png";

// TODO:
// WHEN A COLUMN IS CLEARED AND THE REMAINING PIECES MOVE TO THE RIGHT, IF ANOTHER FULL COLUMN IS FORMED, IT DOES NOT GET CLEARED

export default function Board({ pokemonBox, onStateChange, onScoreIncrement, currentScore, isPaused = false }) {
  const rows = 12;
  const cols = 25;
  const gravitySpeed = 600; // Reducido de 400ms a 600ms para hacerlo más lento
  const previewCell = 24;
  const previewBox = 72;

  const [activePiece, setActivePiece] = useState(null);
  const [activePosition, setActivePosition] = useState(null);
  const [nextPiece, setNextPiece] = useState(getRandomShape());
  const [board, setBoard] = useState(Array.from({ length: rows }, () => Array(cols).fill(null)));
  const [gameOver, setGameOver] = useState(false);
  const [colsFading, setColsFading] = useState([]);
  const gravityIntervalRef = useRef(null);
  const activePositionRef = useRef(activePosition);
  const activePieceRef = useRef(activePiece);
  const boardRef = useRef(board);

  // Mantener las referencias actualizadas
  useEffect(() => {
    activePositionRef.current = activePosition;
  }, [activePosition]);

  useEffect(() => {
    activePieceRef.current = activePiece;
  }, [activePiece]);

  useEffect(() => {
    boardRef.current = board;
  }, [board]);

  function spawnPiece() {
    // Posición de inicio: completamente a la izquierda (fuera del tablero)
    // usando el ancho de la pieza para que ninguna celda nazca dentro
    const shapeWidth = nextPiece.matrix[0].length;
    const shapeHeight = nextPiece.matrix.length;
    // Para la pieza I, hacer que entre más rápido al tablero
    const offsetX = nextPiece.type === "I" ? -1 : -shapeWidth;
    const startPos = {
      x: offsetX,
      y: Math.max(Math.floor((rows - shapeHeight) / 2), 0),
    };

    // comprobar colisión en spawn: solo consideramos solapamiento con celdas
    // ya ocupadas dentro de los límites del tablero. Si la pieza está
    // parcialmente fuera (y < 0 o x fuera), no consideramos eso como game over.
    const currentBoard = boardRef.current;
    let collision = false;
    for (let r = 0; r < nextPiece.matrix.length; r++) {
      for (let c = 0; c < nextPiece.matrix[r].length; c++) {
        if (!nextPiece.matrix[r][c]) continue;
        const y = startPos.y + r;
        const x = startPos.x + c;
        // Solo si está dentro del tablero comprobamos solapamiento
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          if (currentBoard[y][x]) {
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

  function rotatePiece(piece, currentPosition) {
    if (!piece || !currentPosition) return piece;
    
    const rotatedMatrix = piece.matrix[0].map((_, i) =>
      piece.matrix.map((row) => row[i]).reverse()
    );

    const newPiece = { ...piece, matrix: rotatedMatrix };
    const currentBoard = boardRef.current;

    const kicks = [
      { x: 0, y: 0 },
      { x: -1, y: 0 },
      { x: 1, y: 0 },
      { x: 0, y: -1 },
      { x: 0, y: 1 },
    ];

    for (const kick of kicks) {
      const testPosition = {
        x: currentPosition.x + kick.x,
        y: currentPosition.y + kick.y,
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

          if (currentBoard[y][x]) {
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
    const currentPiece = activePieceRef.current;
    const currentBoard = boardRef.current;
    if (!currentPiece) return false;

    for (let r = 0; r < currentPiece.matrix.length; r++) {
      for (let c = 0; c < currentPiece.matrix[r].length; c++) {
        if (currentPiece.matrix[r][c]) {
          const x = nextPosition.x + c;
          const y = nextPosition.y + r;

          // If moving outside right or bottom -> invalid
          if (x >= cols || y >= rows) return false;

          // Si intenta moverse fuera del tablero por arriba, bloquear
          if (y < 0) return false;
          if (x < 0) continue;

          // Otherwise check collision with settled blocks
          if (currentBoard[y][x]) return false;
        }
      }
    }

    return true;
  }

  function solidifyPiece() {
    // Usar las refs para asegurar que tenemos los valores más actuales
    const currentPiece = activePieceRef.current;
    const currentPos = activePositionRef.current;
    const currentBoard = boardRef.current;
    
    if (!currentPiece || !currentPos) return;
    
    // Verificar si alguna celda de la pieza está dentro del tablero
    let hasAnyInsideBoard = false;
    currentPiece.matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const x = currentPos.x + c;
        if (x >= 0 && x < cols) {
          hasAnyInsideBoard = true;
        }
      });
    });
    
    // Si ninguna celda está dentro del tablero, es game over
    if (!hasAnyInsideBoard) {
      setGameOver(true);
      return;
    }
    
    const newBoard = currentBoard.map((row) => [...row]);

    // Escribir la pieza en el tablero
    currentPiece.matrix.forEach((row, r) => {
      row.forEach((cell, c) => {
        if (!cell) return;
        const y = currentPos.y + r;
        const x = currentPos.x + c;
        
        // Escribir solo dentro del tablero
        if (y >= 0 && y < rows && x >= 0 && x < cols) {
          newBoard[y][x] = currentPiece.type;
        }
      });
    });

    // Chequeo de columnas completas para eliminar
    let colsToClear = [];
    for (let col = cols - 1; col >= 0; col--) {
      let isFull = true;
      for (let row = 0; row < rows; row++) {
        if (!newBoard[row][col]) {
          isFull = false;
        }
      }
      if (isFull) {
        colsToClear.push(col);
      }
    }

    if (colsToClear.length > 0) {
      if (onScoreIncrement) {
        onScoreIncrement(colsToClear.length * 100);
      }
      setColsFading(colsToClear); // Guardar columnas en fade-out
      // Marcar las celdas a eliminar con fade-out antes de borrarlas
      // Solidificar la pieza y aplicar fade-out a las columnas a borrar
      setBoard(prev => {
        // Primero solidificamos la pieza activa en el tablero usando las refs
        let boardWithPiece = prev.map(row => [...row]);
        currentPiece.matrix.forEach((row, r) => {
          row.forEach((cell, c) => {
            if (!cell) return;
            const y = currentPos.y + r;
            const x = currentPos.x + c;
            if (y >= 0 && y < rows && x >= 0 && x < cols) {
              boardWithPiece[y][x] = currentPiece.type;
            }
          });
        });
        // Ahora aplicamos fade-out a las columnas a borrar
        const boardWithFadeOut = boardWithPiece.map((row, rowIdx) =>
          row.map((cell, colIdx) => {
            if (colsToClear.includes(colIdx) && cell) {
              return { type: typeof cell === 'object' ? cell.type : cell, fading: true };
            }
            return cell;
          })
        );
        // Actualizar la ref sincrónicamente
        boardRef.current = boardWithFadeOut;
        return boardWithFadeOut;
      });
      // Esperar la animación antes de eliminar (más rápido)
      setTimeout(() => {
        setBoard(prev => {
          let clearedBoard = prev.map(row => [...row]);
          // Eliminar todas las columnas a la vez, reconstruyendo cada fila
          clearedBoard = clearedBoard.map(row => {
            const newRow = row.filter((_, idx) => !colsToClear.includes(idx));
            while (newRow.length < cols) {
              newRow.unshift(null);
            }
            return newRow;
          });
          // Actualizar la ref sincrónicamente
          boardRef.current = clearedBoard;
          return clearedBoard;
        });
        setColsFading([]); // Limpiar columnas en fade-out
        // después de solidificar, intentar spawnear la siguiente
        spawnPiece();
      }, 200);
      return;
    }

    setBoard(newBoard);
    // Actualizar la ref sincrónicamente para que spawnPiece use el tablero actualizado
    boardRef.current = newBoard;

    // después de solidificar, intentar spawnear la siguiente
    spawnPiece();
  }

  const restartGame = () => {
    const emptyBoard = Array.from({ length: rows }, () => Array(cols).fill(null));
    setBoard(emptyBoard);
    boardRef.current = emptyBoard;
    resetBag();
    // No establecer score aquí, se manejará desde App.jsx si es necesario
    if (onStateChange) {
      onStateChange({ nextPiece: getRandomShape(), score: 0, shapeColors });
    }
    setGameOver(false);
    setNextPiece(getRandomShape());
    setActivePiece(null);
    setActivePosition(null);
    // Esperar al siguiente render para spawnear la pieza
    setTimeout(() => {
      spawnPiece();
    }, 0);
  }

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!activePieceRef.current || !activePositionRef.current || gameOver || isPaused) return;
      
      if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
        setActivePiece(prev => rotatePiece(prev, activePositionRef.current));
      }
      if (
        event.key === "ArrowRight" ||
        event.key === "d" ||
        event.key === "D"
      ) {
        if (canMove({ x: activePositionRef.current.x + 1, y: activePositionRef.current.y })) {
          setActivePosition((pos) => ({ x: pos.x + 1, y: pos.y }));
        }
      }
      if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
        if (canMove({ x: activePositionRef.current.x, y: activePositionRef.current.y + 1 })) {
          setActivePosition((pos) => ({ x: pos.x, y: pos.y + 1 }));
        }
      }
      if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
        if (canMove({ x: activePositionRef.current.x, y: activePositionRef.current.y - 1 })) {
          setActivePosition((pos) => ({ x: pos.x, y: pos.y - 1 }));
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameOver, isPaused]);

  useEffect(() => {
    // Pausar el bucle de movimiento si estamos en game over, no hay pieza activa o el juego está pausado
    if (gameOver || !activePosition || isPaused) {
      if (gravityIntervalRef.current) {
        clearInterval(gravityIntervalRef.current);
        gravityIntervalRef.current = null;
      }
      return;
    }

    // Limpiar intervalo anterior si existe
    if (gravityIntervalRef.current) {
      clearInterval(gravityIntervalRef.current);
    }

    // Crear nuevo intervalo
    gravityIntervalRef.current = setInterval(() => {
      const currentPos = activePositionRef.current;
      if (!currentPos) return;
      
      const nextPosition = { x: currentPos.x + 1, y: currentPos.y };
      if (canMove(nextPosition)) {
        setActivePosition({ x: currentPos.x + 1, y: currentPos.y });
      } else {
        solidifyPiece();
      }
    }, gravitySpeed);

    return () => {
      if (gravityIntervalRef.current) {
        clearInterval(gravityIntervalRef.current);
        gravityIntervalRef.current = null;
      }
    };
  }, [gameOver, isPaused, activePiece]);

  useEffect(() => {
    spawnPiece();
  }, []);

  useEffect(() => {
    // Solo incrementar score mientras el juego no esté en gameOver ni pausado
    if (gameOver || isPaused) return;

    const scoreInterval = setInterval(() => {
      if (onScoreIncrement) {
        onScoreIncrement(1);
      }
    }, 1000);
    return () => clearInterval(scoreInterval);
  }, [gameOver, isPaused]);

  const shapeColors = {
    I: "bg-teal-600 text-white",
    O: "bg-yellow-500 text-black",
    T: "bg-indigo-700 text-white",
    S: "bg-emerald-600 text-white",
    Z: "bg-red-600 text-white",
    J: "bg-blue-700 text-white",
    L: "bg-amber-600 text-black",
  };

  useEffect(() => {
    if (onStateChange) {
      onStateChange({ nextPiece, score: currentScore, shapeColors });
    }
  }, [nextPiece, currentScore]);

  return (
    <div className="flex flex-col items-start space-y-6 w-full h-fit flex-grow min-h-0 z-20">
      {/* Tablero y box del Pokémon */}
      <div className="game-container flex flex-row items-center justify-around w-fit max-w-7xl mx-auto gap-3">
        <div className="flex-1 flex items-center justify-center">
          <div
              className="relative board grid overflow-hidden max-w-[94vw] max-h-[94vh] mr-8 lg:mr-16 lg:ml-16"
              style={{
                gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
                aspectRatio: `${cols} / ${rows}`,
                backgroundColor: "red",
              }}
          >
            {/* Video de fondo */}
            <video
              src={BoardVideo}
              autoPlay
              muted
              loop
              playsInline
              className="absolute inset-0 w-full h-full object-cover brightness-75 contrast-125"
            />

            {/* Overlay para atenuar el video de fondo. Su opacidad baja cuando está el modal abierto para que el modal destaque pero el tablero siga visible */}
            <div
              className={`absolute inset-0 bg-black pointer-events-none ${
                gameOver ? "opacity-20" : "opacity-40"
              }`}
            />
            {board.map((row, rowIndex) =>
              row.map((cell, colIndex) => {
                let value = cell;
                // Renderizar la pieza activa normalmente, pero si hay columnas en fade-out, no mostrar el bloque activo en esas columnas
                if (activePiece && activePosition) {
                  for (let r = 0; r < activePiece.matrix.length; r++) {
                    for (let c = 0; c < activePiece.matrix[r].length; c++) {
                      if (activePiece.matrix[r][c]) {
                        const y = activePosition.y + r;
                        const x = activePosition.x + c;
                        if (y === rowIndex && x === colIndex) {
                          // Si la columna está en fade-out, no mostrar el bloque activo
                          if (!colsFading.includes(colIndex)) {
                            value = activePiece.type;
                          }
                        }
                      }
                    }
                  }
                }

                // Si la celda es un objeto con fading, aplicar la clase de animación
                const isFading =
                  value && typeof value === "object" && value.fading;
                const cellType = isFading ? value.type : value;
                return (
                  //CELDAS
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`cell border border-black opacity-100 contrast-200 w-[4.5vh] h-[4.5vh] max-w-12 max-h-12 ${
                      cellType ? shapeColors[cellType] : "bg-transparent"
                    }${isFading ? " fade-out-col" : ""}`}
                  />
                );
              })
            )}
          </div>
        </div>
        {/* Box del Pokémon a la derecha del tablero */}
        <div className="flex items-center justify-center h-full">
          {pokemonBox}
        </div>
      </div>
      {/* El tablero siempre se renderiza; el modal aparece encima como un popup */}
      {gameOver && <GameOverModal score={currentScore} onRestart={restartGame} />}
    </div>
  );
}
