import React from "react";
import Logo from "../assets/poketrisLOGO.png";

export default function Header({ nextPiece, score, shapeColors, previewCell = 18, previewBox = 50 }) {
  return (
    <header className="w-full h-fit flex justify-between items-center bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700 text-white shadow-lg py-3" >
      <img
        className="h-15 ml-3 object-contain"
        src={Logo}
        alt="Pokétris Logo"
      />
      <div className="flex flex-col items-center justify-center" >
        <div className="box-next-piece rounded bg-gradient-to-br from-yellow-200/60 via-pink-200/40 to-purple-300/60  border-pink-300 shadow-md flex flex-col items-center justify-center" style={{ width: `${previewBox + 64}px`, minHeight: `${previewBox + 8}px`, position: 'relative' }}>
          <span className=" text-md font-bold tracking-wide text-white drop-shadow-lg" style={{ fontFamily: "PokeFont, sans-serif" }}>Next piece</span>
          <div style={{ width: `${previewBox}px`, height: `${previewBox}px`, position: 'relative' }}>
            {nextPiece && nextPiece.matrix ? (
              (() => {
                const cellSize = previewCell;
                const matrixH = nextPiece.matrix.length * cellSize;
                const matrixW = nextPiece.matrix[0].length * cellSize;
                const offsetY = (previewBox - matrixH) / 2;
                const offsetX = (previewBox - matrixW) / 2;
                return nextPiece.matrix.map((row, rIdx) =>
                  row.map((cell, cIdx) =>
                    cell ? (
                      <div
                        key={`${rIdx}-${cIdx}`}
                        className={`${shapeColors[nextPiece.type]} border border-black`}
                        style={{
                          position: 'absolute',
                          width: `${cellSize}px`,
                          height: `${cellSize}px`,
                          left: offsetX + cIdx * cellSize,
                          top: offsetY + rIdx * cellSize,
                          boxSizing: 'border-box',
                        }}
                      />
                    ) : null
                  )
                );
              })()
            ) : (
              <div className="flex items-center justify-center w-full h-full text-xs text-white/70">Cargando...</div>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 mt-2">
        <span className="text-xs uppercase opacity-90 text-pink-200 drop-shadow-lg">Score</span>
        <div className="text-3xl font-black bg-gradient-to-r from-yellow-300 via-pink-400 to-purple-500 text-white px-2 py-1 rounded-s shadow ring-pink-300/30 text-center mr-0" style={{ fontFamily: "PokeFont, sans-serif", minWidth: 100 }}>{score}</div>
      </div>
    </header>
  );
}
``