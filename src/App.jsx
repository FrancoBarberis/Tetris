import TetrisBoard from "./components/TetrisBoard";
import { useState } from "react";
import { usePiece } from "./utils/usePiece";
import createBoard from "./utils/createBoard";

function App() {

  // DIMENSIONES
  const filas = 20;
  const columnas = 10;

  // CREO LA MATRIZ E INICIALIZO EL TABLERO
  const [board, setBoard] = useState(createBoard(filas, columnas));

  return (
    <div className="flex justify-center items-center h-screen w-screen bg-gray-900">
      <TetrisBoard board={board}  />
    </div>
  );
}

export default App;
