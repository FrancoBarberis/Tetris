import React from 'react';

export default function GameOverModal({ score, onRestart, title = 'Game Over' }) {
  return (
    // Contenedor fijo que cubre toda la pantalla pero no oculta el DOM de fondo
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Overlay semitransparente con blur: permite ver el fondo difuminado */}
      <div className="absolute inset-0 bg-transparent bg-opacity-40 backdrop-blur-md pointer-events-none" />

      {/* Modal en sí: pointer-events-auto para recibir clicks */}
      <div className="relative bg-white p-6 rounded shadow-lg text-center max-w-sm w-full mx-4 z-10 pointer-events-auto">
        <h2 className="text-2xl font-bold mb-3">{title}</h2>
        <p className="mb-4">Tu puntuación: <span className="font-semibold">{score}</span></p>
        <div className="flex justify-center">
          <button
            onClick={onRestart}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Reiniciar
          </button>
        </div>
      </div>
    </div>
  );
}
