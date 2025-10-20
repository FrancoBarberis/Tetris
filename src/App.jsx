import Board from "./components/Board";

function App() {
  /* CREO LA MATRIZ QUE RENDERIZARÁ EL TABLERO */
  return (
    <>
      <div className="flex flex-col justify-around items-center h-screen">
        <div className="header-wrapper w-full flex flex-row justify-around align-middle">
          <h1 className="text-4xl text-white">TETRIS</h1>
          <h2 className="text-2xl text-white">
            Puntos: <span>0</span>
          </h2>
        </div>
        <Board />
        <h3 className="text-white">PROXIMA PIEZA</h3>
      </div>
      {/* CREAR EL LOOP PRINCIPAL DEL JUEGO, ACTUALIZANDO TABLERO CON GRAVITY */}
      {/* CUANDO UNA PIEZA AL FONDO, SE SOLIDIFICA EN LA MATRIZ */}
      {/* CUANDO SE SOLIDIFICA UNA PIEZA, SE CREA OTRA PIEZA */}
      {/* CUANDO SE COMPLETA UNA FILA, SE ELIMINA Y SE BAJA LA MATRIZ COMPLETA */}
    </>
  );
}

export default App;
