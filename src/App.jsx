import TetrisBoard from './components/TetrisBoard';

const filas = 20;
const columnas = 10;
const board = [];
for (let fila = 0; fila < filas; fila++) {
  const row = [];
  for (let columna = 0; columna < columnas; columna++) {
    row.push(0);
  }
  board.push(row);
}

function App() {
  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
      <TetrisBoard board={board} />
    </div>
  );
}

export default App;