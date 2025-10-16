import Board from "./components/Board";

function App() {
  function createMatrix(height, width) {
    const matrix = [];
    for (let i = 0; i < height; i++) {
      matrix.push(new Array(width).fill(0));
    }
    return matrix;
  }
  /* CRE0 LA MATRIZ QUE RENDERIZARÁ EL TABLERO */
  const height = 10;
  const width = 30;
  const board = createMatrix(height, width);
  console.log(board);
  return (
    <>
      <div className="flex flex-col justify-center items-center h-screen">
        <h2 className="text-3xl font-medium mb-4">Puntos: <span>{}</span></h2>
        <Board matrix={board}></Board>
      </div>
      {/* CREAR EL LOOP PRINCIPAL DEL JUEGO, ACTUALIZANDO TABLERO CON GRAVITY */}
      {/* CUANDO UNA PIEZA AL FONDO, SE SOLIDIFICA EN LA MATRIZ */}
      {/* CUANDO SE SOLIDIFICA UNA PIEZA, SE CREA OTRA PIEZA */}
      {/* CUANDO SE COMPLETA UNA FILA, SE ELIMINA Y SE BAJA LA MATRIZ COMPLETA */}
    </>
  );
}

export default App;
