import React, { use, useEffect, useState } from "react";
import { getRandomShape } from "../utils/shapes";

// RESPONSABILIDADES DE BOARD:

// RENDERIZAR EL TABLERO Y ACTUALIZARLO
//RENDERIZAR LAS PIEZAS DENTRO DEL TABLERO
//GENERAR PIEZAS ALEATORIAS
//SOLIDIFICAR PIEZAS

export default function Board({ matrix }) {
  
  function canMove(newPosition, pieceMatrix = activeShape.matrix) {
    for (let dy = 0; dy < pieceMatrix.length; dy++) {
      for (let dx = 0; dx < pieceMatrix[dy].length; dx++) {
        if (pieceMatrix[dy][dx]) {
          const x = newPosition.x + dx;
          const y = newPosition.y + dy;
          if (x < 0 || x >= matrix[0].length || y < 0 || y >= matrix.length) {
            return false;
          }
          if (matrix[y][x] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }
  function rotatePiece(piece) {
    const rows = piece.matrix.length;
    const cols = piece.matrix[0].length;
    const rotatedMatrix = Array.from({ length: cols }, (_, x) =>
      Array.from({ length: rows }, (_, y) => piece.matrix[rows - 1 - y][x])
    );
    if (!canMove(activePosition, rotatedMatrix)) {
      return piece;
    }
    return { ...piece, matrix: rotatedMatrix };
  }

  // Estado para la pieza activa y su posición
  const [activeShape, setActiveShape] = useState(getRandomShape());
  const [activePosition, setActivePosition] = useState({ x: 1, y: 5 });

  // Crea una copia de la matriz para renderizar
  const visualMatrix = matrix.map((row) => [...row]);

  // Combina la pieza activa en la matriz visual
  activeShape.matrix.forEach((row, dy) => {
    row.forEach((cell, dx) => {
      const x = activePosition.x + dx;
      const y = activePosition.y + dy;
      if (cell && visualMatrix[y] && visualMatrix[y][x] !== undefined) {
        visualMatrix[y][x] = activeShape.type; // Marca la celda con el tipo de pieza
      }
    });
  });

  //DETECTAR INPUTS

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowLeft") {
        setActiveShape(rotatePiece(activeShape));
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
  }, [activePosition]);

  // Gravedad horizontal
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePosition((pos) => ({ x: pos.x + 1, y: pos.y }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  // Colores por tipo de pieza
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
      className="board grid gap-1"
      style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}
    >
      {visualMatrix.map((fila, y) =>
        fila.map((celda, x) => (
          <div
            key={`${y}-${x}`}
            className={`cell w-9 h-9 border ${
              celda ? shapeColors[celda] || "bg-blue-500" : "bg-gray-800"
            }`}
          />
        ))
      )}
    </div>
  );
}
