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
      </div>
    </>
  );
}

export default App;
