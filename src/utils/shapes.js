// Objeto con todas las formas posibles de Tetris

const shapes = {
  I: {
    shape: [
      [1, 1, 1, 1]
    ]
  },
  O: {
    shape: [
      [1, 1],
      [1, 1]
    ]
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1]
    ]
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0]
    ]
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1]
    ]
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1]
    ]
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1]
    ]
  }
};

export default shapes;
