// RESPONSABILIDADES DE BOARD:

// RENDERIZAR EL TABLERO
//RENDERIZAR LAS PIEZAS DENTRO DEL TABLERO
// RENDERIZAR NUEVAMENTE EL TABLERO CUANDO SE ACTUALIZA LA MATRIZ

export default function Board({ matrix }) {
  return (
    <div
      className="board grid gap-1"
      style={{ gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)` }}
    >
      {matrix.map((fila, y) =>
        fila.map((celda, x) => (
          <div
            key={`${y}-${x}`}
            className={`cell w-9 h-9 border ${
              celda ? "bg-blue-500" : "bg-gray-800"
            }`}
          />
        ))
      )}
    </div>
  );
}
