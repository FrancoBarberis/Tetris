
// Array de objetos con type y matrix
const shapes = [
  { type: "I", matrix: [[1, 1, 1, 1]] },
  { type: "O", matrix: 
    [[1, 1], 
    [1, 1]] },
  { type: "T", matrix: 
    [[0, 1, 0], 
    [1, 1, 1]] },
  { type: "S", matrix: 
    [[0, 1, 1], 
    [1, 1, 0]] },
  { type: "Z", matrix: 
    [[1, 1, 0], 
    [0, 1, 1]] },
  { type: "J", matrix: 
    [[1, 0, 0], 
    [1, 1, 1]] },
  { type: "L", matrix: 
    [[0, 0, 1], 
    [1, 1, 1]] }
];

export function getRandomShape() {
  const randomIndex = Math.floor(Math.random() * shapes.length);
  return shapes[randomIndex];
}

export default shapes;
