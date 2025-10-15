import { useState } from 'react';
import { getRandomShape } from './shapes';

export function usePiece() {
  // Estado de la pieza actual
  const [position, setPosition] = useState({ x: 4, y: 0 });
  const [shape, setShape] = useState(getRandomShape());

  // Mover la pieza en el eje X o Y
  function movePiece(x, y) {
    setPosition({
      x: position.x + x,
      y: position.y + y,
    });
  }

  // Cambiar la pieza por una nueva aleatoria y reiniciar posición
  function resetPiece() {
    setPosition({ x: 4, y: 5 });
    setShape(getRandomShape());
  }

  return {
    position,
    shape,
    movePiece,
    resetPiece,
  };
}