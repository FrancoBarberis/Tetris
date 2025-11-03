import React from "react";
import Logo from "../assets/poketrisLOGO.png";

export default function Header({ nextPiece, score, shapeColors, previewCell = 18, previewBox = 50 }) {
  return (
    <header className="w-full h-fit flex justify-between items-center bg-gradient-to-r from-red-900 via-blue-900 to-black text-white py-4" >
      <img
        className="h-15 ml-3 object-contain"
        src={Logo}
        alt="Pokétris Logo"
      />
        <div className="box-next-piece rounded-xs bg-gradient-to-b from-blue-900  to-black shadow-md flex flex-col items-center justify-center py-1" style={{ width: `${previewBox + 64}px`, minHeight: `${previewBox + 8}px`, position: 'relative' }}>
          <span className=" text-md font-bold uppercase tracking-wide text-gray-300" style={{ fontFamily: "PokeFont, sans-serif" }}>Next piece</span>
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
      <div className="flex items-center  mt-2 bg-gradient-to-l from-black to-blue-900 pl-4 py-2 rounded-xs">
        <span className="text-md font-extrabold uppercase text-gray-300 drop-shadow-lg">Score</span>
        <div className="score-box text-2xl font-black py-1 rounded-s shadow ring-pink-300/30 text-center mr-0 text-gray-300" style={{ fontFamily: "PokeFont, sans-serif", minWidth: 100 }}>{score}</div>
      </div>
    </header>
  );
}
``