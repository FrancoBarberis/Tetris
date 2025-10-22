
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
  // DEBUG: solo retornar pieza tipo I
  const iShape = shapes.find(s => s.type === "I");
  lastPickedType = "I";
  // Clonar para evitar mutaciones
  return {
    type: iShape.type,
    matrix: iShape.matrix.map(row => row.slice())
  };
}

export default shapes;

export function resetBag() {
  bag = [];
  lastPickedType = null;
}
