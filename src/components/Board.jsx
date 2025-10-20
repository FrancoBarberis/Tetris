import React, { useEffect, useState } from "react";
import { getRandomShape } from "../utils/shapes";

// RESPONSABILIDADES DE BOARD:

// RENDERIZAR EL TABLERO Y ACTUALIZARLO
//RENDERIZAR LAS PIEZAS DENTRO DEL TABLERO
//GENERAR PIEZAS ALEATORIAS
//SOLIDIFICAR PIEZAS

export default function Board() {
  
  const rows = 12;
  const cols = 35;

  // HOOKS Y ESTADOS

  const [activePiece, setActivePiece] = useState(null); //ACTUALIZA LA PIEZA, SIRVE PARA LAS ROTACIONES

  const [activePosition, setActivePosition] = useState(null); //ACTUALIZA LA POSICION DE LA PIEZA

  const [board, setBoard] = useState(
    Array.from({ length: rows }, () => Array(cols).fill(null))
  );

  function spawnPiece() {
    setActivePiece(getRandomShape());
    setActivePosition({ x: 1, y: 5 });
  }

  // FUNCIONES DE MOVIMIENTO, ROTACION Y SOLIDIFICACION

  function rotatePiece(piece) {
    return piece;
  }
  function canMove(nextPosition) {
    return true;
  }

  function solidifyPiece() {
    // ACTUALIZAR LA MATRIZ DEL TABLERO
    // LIMPIAR FILAS COMPLETAS
    // SPAWNEAR NUEVA PIEZA
    spawnPiece();
  }
  //LISTENERS PARA INPUTS DEL TECLADO

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

  //GAME LOOP CON GRAVEDAD
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
    {board.flat().map((cell, i) => (
      <div
        key={i}
        className={`border border-blue-800 w-10 h-10 ${
          cell ? shapeColors[cell] : "bg-gray-900"
        }`}
      />
    ))}
  </div>
);

}
