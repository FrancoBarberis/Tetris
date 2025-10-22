
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
  const cloned = shapes.map(s => ({
    type: s.type,
    matrix: s.matrix.map(row => row.slice())
  }));
  bag = shuffle(cloned);
}

export function getRandomShape() {
  if (bag.length === 0) refillBag();

  let piece = bag.shift();
  // Solo evitar repetición si hay más de una pieza en el bag
  if (piece && piece.type === lastPickedType && bag.length > 0) {
    // buscar un elemento distinto y devolverlo, dejando el repetido en la bolsa
    for (let i = bag.length - 1; i >= 0; i--) {
      if (bag[i].type !== lastPickedType) {
        const alt = bag.splice(i, 1)[0];
        bag.push(piece); // devolver el original repetido a la bolsa
        piece = alt;
        break;
      }
    }
  }

  // Siempre devolver la última pieza si es la única opción
  if (piece) lastPickedType = piece.type;
  return piece;
}

export default shapes;

export function resetBag() {
  bag = [];
  lastPickedType = null;
}
