import React, { use, useEffect, useState, useRef } from "react";
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
          // No permitir fuera del tablero por abajo
          if (y >= matrix.length) {
            return false;
          }
          // Permitir celdas fuera del tablero por la izquierda (x < 0)
          if (x >= matrix[0].length || y < 0) {
            return false;
          }
          if (x >= 0 && matrix[y][x] !== 0) {
            return false;
          }
        }
      }
    }
    return true;
  }
  // Rotación simple: solo rota si cabe
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
  // Calcula la posición inicial para que toda la pieza esté fuera del tablero
  const getInitialPosition = (shape) => ({
    x: -(shape.matrix[0].length - 1),
    y: Math.floor((matrix.length - shape.matrix.length) / 2)
  });
  const [activePosition, setActivePosition] = useState(getInitialPosition(activeShape));

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

  // Solidificación: solo si todas las celdas activas están dentro del tablero
  function solidifyIfNeeded() {
    let allInside = true;
    activeShape.matrix.forEach((row, dy) => {
      row.forEach((cell, dx) => {
        if (cell) {
          const x = activePosition.x + dx;
          if (x < 0) allInside = false;
        }
      });
    });
    // Aquí deberías llamar a la lógica de solidificación y respawn si allInside
    // Ejemplo:
    // if (allInside && !canMove({ x: activePosition.x + 1, y: activePosition.y })) {
    //   ...
    // }
  }

  // Referencia para el intervalo de gravedad
  const gravityInterval = useRef(null);

  //DETECTAR INPUTS
  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      if (key === "ArrowLeft" || key === "a" || key === "A") {
        setActiveShape(shape => rotatePiece(shape));
      }
      if (key === "ArrowRight" || key === "d" || key === "D") {
        setActivePosition(pos => {
          if (canMove({ x: pos.x + 1, y: pos.y })) {
            // Reinicia el intervalo de gravedad
            if (gravityInterval.current) {
              clearInterval(gravityInterval.current);
              gravityInterval.current = setInterval(() => {
                setActivePosition(pos2 => {
                  const nextPosition = { x: pos2.x + 1, y: pos2.y };
                  if (canMove(nextPosition)) {
                    return nextPosition;
                  }
                  return pos2;
                });
              }, 1000);
            }
            return { x: pos.x + 1, y: pos.y };
          }
          return pos;
        });
      }
      if (key === "ArrowDown" || key === "s" || key === "S") {
        setActivePosition(pos => {
          if (canMove({ x: pos.x, y: pos.y + 1 })) {
            return { x: pos.x, y: pos.y + 1 };
          }
          return pos;
        });
      }
      if (key === "ArrowUp" || key === "w" || key === "W") {
        setActivePosition(pos => {
          if (canMove({ x: pos.x, y: pos.y - 1 })) {
            return { x: pos.x, y: pos.y - 1 };
          }
          return pos;
        });
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // GRAVEDAD HORIZONTAL (DERECHA)

  useEffect(() => {
    gravityInterval.current = setInterval(() => {
      setActivePosition(pos => {
        const nextPosition = { x: pos.x + 1, y: pos.y };
        if (canMove(nextPosition)) {
          return nextPosition;
        }
        return pos;
      });
    }, 1000);
    return () => clearInterval(gravityInterval.current);
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
