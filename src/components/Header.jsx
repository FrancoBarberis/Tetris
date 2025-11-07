import React from "react";
import Logo from "../assets/poketrisLOGO.png";
import { useLanguage } from "../contexts/LanguageContext";

export default function Header({ nextPiece, score, shapeColors, previewCell = 18, previewBox = 50 }) {
  const { language, setLanguage } = useLanguage();
  
  const translations = {
    en: {
      nextPiece: "Next",
      score: "Score",
      loading: "Loading..."
    },
    es: {
      nextPiece: "Siguiente",
      score: "Puntaje",
      loading: "Cargando..."
    }
  };
  
  const t = translations[language];
  
  // Área de preview ajustada para que encaje bien en el header y todo quede centrado
  const previewBoxAdjusted = 40;
  const previewCellAdjusted = 14;
  return (
    <header className="w-full h-fit max-h-25 flex justify-between items-center bg-gradient-to-r from-red-900 via-blue-900 to-black text-white py-4" >
      <img
        className="h-15 ml-3 object-contain"
        src={Logo}
        alt="Pokétris Logo"
      />
      <div className="box-next-piece rounded-xs bg-gradient-to-b from-blue-900 to-black shadow-md flex flex-col items-center justify-center py-1 cursor-default" style={{ width: `${previewBoxAdjusted + 64}px`, minHeight: `${previewBoxAdjusted + 8}px`, position: 'relative' }}>
        <div className="w-full flex flex-col items-center justify-center" style={{padding: '6px 0', minHeight: `${previewBoxAdjusted + 8}px`, justifyContent: 'center'}}>
          <span
            className="text-md font-bold uppercase tracking-wide text-gray-300 px-2 text-center flex items-center justify-center w-full"
            style={{
              fontFamily: "PokeFont, sans-serif",
              fontSize: language === 'es' ? 'clamp(0.60rem, 0.95vw, 0.80rem)' : 'clamp(0.65rem, 1vw, 0.875rem)',
              height: '2.1em',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%'
            }}
          >
            {t.nextPiece}
          </span>
          <div
            className="flex items-center justify-center w-full"
            style={{ width: `${previewBoxAdjusted}px`, height: `${previewBoxAdjusted}px`, minWidth: `${previewBoxAdjusted}px`, minHeight: `${previewBoxAdjusted}px`, maxWidth: `${previewBoxAdjusted}px`, maxHeight: `${previewBoxAdjusted}px`, position: 'relative', overflow: 'hidden', boxSizing: 'content-box', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <div style={{ position: 'absolute', left: 0, top: 0, width: `${previewBoxAdjusted}px`, height: `${previewBoxAdjusted}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {nextPiece && nextPiece.matrix ? (
                (() => {
                  // Ajuste proporcional para que todas las piezas se centren y no se vean irregulares
                  const maxCols = Math.max(...nextPiece.matrix.map(row => row.length));
                  const maxRows = nextPiece.matrix.length;
                  // El tamaño de celda se calcula para que la pieza más grande (I) entre cuadrada
                  // Limitar el tamaño de celda para que nunca se recorte
                  const cellSizeRaw = Math.floor(previewBoxAdjusted / Math.max(maxCols, maxRows)) + 4;
                  const cellSize = Math.min(cellSizeRaw, previewBoxAdjusted / maxCols, previewBoxAdjusted / maxRows);
                  const matrixH = maxRows * cellSize;
                  const matrixW = maxCols * cellSize;
                  const offsetY = (previewBoxAdjusted - matrixH) / 2;
                  const offsetX = (previewBoxAdjusted - matrixW) / 2;
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
                <div className="flex items-center justify-center w-full h-full text-xs text-white/70">{t.loading}</div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center  mt-2 bg-gradient-to-l from-black to-blue-900 pl-4 py-2 rounded-xs cursor-default">
  <span className="text-md font-extrabold uppercase text-gray-300 drop-shadow-lg" style={{ minWidth: 90 }}>{t.score}</span>
  <div className="score-box text-2xl font-black py-1 rounded-s shadow ring-pink-300/30 text-center mr-0 text-gray-300" style={{ fontFamily: "PokeFont, sans-serif", minWidth: 100, width: 100 }}>{score}</div>
      </div>
    </header>
  );
}
``