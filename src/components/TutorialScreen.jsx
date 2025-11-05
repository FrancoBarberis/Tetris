
import React, { useEffect } from "react";

export default function TutorialScreen({ onContinue }) {
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      {/* Overlay semitransparente con blur y gradiente */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-500/10 to-gray-600/10 backdrop-blur-md" />
      {/* Modal visualmente consistente con el layout principal */}
      <div className="relative max-w-sm w-full mx-4 pointer-events-auto">
        <div className="bg-gradient-to-b from-black to-blue-900 rounded p-4 text-center border-2 border-purple-700">
          <h2 className="text-2xl font-extrabold mb-3 text-purple-300 uppercase drop-shadow">¿Cómo jugar Pokétris?</h2>
          <ul className="text-base mb-5 list-disc list-inside text-left w-full text-gray-200">
            <li>Las piezas <b>caen hacia la derecha</b>.</li>
            <li>Debes formar <b>columnas completas</b> para ganar puntos.</li>
            <li>Usa <b>←</b> o <b>A</b> para rotar la pieza.</li>
            <li>Usa <b>↑</b> o <b>W</b>, <b>→</b> o <b>D</b> y <b>↓</b> o <b>S</b> para mover la pieza.</li>
            <li>Usa los puntos para comprar <b>pokeballs</b>.</li>
            <li>Lanza pokeballs para dañar al Pokémon rival.</li>
            <li>¡No dejes que las piezas lleguen al <b>borde izquierdo</b>!</li>
          </ul>
          <button
            className="mt-1 px-7 py-2 bg-gradient-to-r from-black via-purple-900 to-black text-purple-200 rounded font-bold shadow hover:scale-105 transition-transform ring-2 ring-black/30 cursor-pointer uppercase"
            onClick={onContinue}
          >
            ¡Jugar!
          </button>
        </div>
      </div>
    </div>
  );
}
