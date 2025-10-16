import shapes from "../utils/shapes";

// RESPONSABILIDADES DE PIECE

// OBTENER UNA PIEZA (SHAPE) RANDOM
// MOVER LA PIEZA (POSITION) SEGÚN INPUT
// VALIDAR COLISIONES

function getRandomShape() {
  const shapeKeys = Object.keys(shapes);
  const randomKey = shapeKeys[Math.floor(Math.random() * shapeKeys.length)];
  return shapes[randomKey].shape;
}

export default function Piece({ position }) {
  const shape = getRandomShape();
  return (
    <></>
  );
}
