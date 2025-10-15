export default function createBoard(filas, columnas) {
    const board = [];
    for (let i = 0; i < filas; i++) {
        const row = [];
        for (let j = 0; j < columnas; j++) {
            row.push(0);
        }
        board.push(row);
    }
    return board;
}