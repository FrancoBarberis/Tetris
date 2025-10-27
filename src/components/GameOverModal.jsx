import React from 'react';

export default function GameOverModal({ score, onRestart, title = 'Game Over' }) {
  return (
    // Contenedor fijo que cubre toda la pantalla pero no oculta el DOM de fondo
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      {/* Overlay semitransparente con blur y gradiente */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-200/60 via-pink-200/40 to-purple-300/60 backdrop-blur-md pointer-events-none" />

      {/* Modal visualmente consistente con el layout principal */}
      <div className="relative max-w-sm w-full mx-4 pointer-events-auto">
        <div className="bg-gradient-to-br from-yellow-100 via-pink-200 to-purple-200 rounded-2xl shadow-2xl border-2 border-pink-300 p-1">
          <div className="bg-white/90 rounded-xl px-6 py-8 text-center">
            <h2 className="text-3xl font-extrabold mb-4 text-pink-600 drop-shadow">{title}</h2>
            <p className="mb-6 text-lg text-gray-700">Tu puntuación:<br /><span className="font-bold text-2xl text-purple-700 drop-shadow">{score}</span></p>
            <div className="flex justify-center">
              <button
                onClick={onRestart}
                className="px-6 py-2 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-700 text-white rounded-full font-semibold shadow hover:scale-105 transition-transform ring-2 ring-pink-300/30 cursor-pointer"
              >
                Reiniciar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
