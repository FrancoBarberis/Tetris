
// Array de objetos con type y matrix
const shapes = [
  { type: "I", matrix: [[1, 1, 1, 1]] },
  { type: "O", matrix: [[1, 1], [1, 1]] },
  { type: "T", matrix: [[0, 1, 0], [1, 1, 1]] },
  { type: "S", matrix: [[0, 1, 1], [1, 1, 0]] },
  { type: "Z", matrix: [[1, 1, 0], [0, 1, 1]] },
  { type: "J", matrix: [[1, 0, 0], [1, 1, 1]] },
  { type: "L", matrix: [[0, 0, 1], [1, 1, 1]] }
];

// Implementación del sistema "7-bag" para evitar repeticiones frecuentes
let bag = [];
let lastPickedType = null;
let previousPieces = []; // Historial de las últimas 3 piezas

function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function refillBag() {
  // Deep-clone para evitar que cualquier mutación altere las plantillas originales
  let cloned = shapes.map(s => ({
    type: s.type,
    matrix: s.matrix.map(row => row.slice())
  }));
  bag = shuffle(cloned);
}

export function getRandomShape() {
  if (bag.length === 0) refillBag();

  // Evitar que salgan más de 2 piezas iguales seguidas
  let piece = bag.shift();
  let attempts = 0;
  const maxAttempts = 20; // Límite de intentos para evitar loop infinito
  
  while (attempts < maxAttempts) {
    // Verificar si esta pieza ya salió las últimas 2 veces
    if (previousPieces.length >= 2 && 
        previousPieces[previousPieces.length - 1] === piece.type && 
        previousPieces[previousPieces.length - 2] === piece.type) {
      // Devolver al bag y tomar otra
      bag.push(piece);
      if (bag.length === 0) refillBag();
      piece = bag.shift();
      attempts++;
    } else {
      break;
    }
  }
  
  // Actualizar historial (mantener solo las últimas 3 piezas)
  previousPieces.push(piece.type);
  if (previousPieces.length > 3) {
    previousPieces.shift();
  }
  
  lastPickedType = piece.type;
  return piece;
}

export default shapes;

export function resetBag() {
  bag = [];
  lastPickedType = null;
  previousPieces = [];
}
