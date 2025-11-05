
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
      <div className="relative w-full max-w-3xl mx-4 pointer-events-auto">
        <div className="bg-gradient-to-b from-black to-blue-900 rounded p-6 md:p-10 border-2 border-purple-700 flex flex-col gap-6 items-stretch">
          <h2 className="text-2xl font-extrabold mb-3 text-purple-300 uppercase drop-shadow text-center">¿Cómo jugar Pokétris?</h2>
          <div className="flex flex-col md:flex-row gap-8 w-full">
            <div className="flex-1">
              <ul className="text-base mb-5 list-disc list-inside text-left w-full text-gray-200">
                <li>Las piezas <b>caen hacia la derecha</b>.</li>
                <li>Usa <b>←</b> o <b>A</b> para rotar la pieza.</li>
                <li>Usa <b>↑</b> o <b>W</b>, <b>→</b> o <b>D</b> y <b>↓</b> o <b>S</b> para mover la pieza.</li>
                <li>¡No dejes que las piezas se pasen del <b>borde izquierdo</b>!</li>
              </ul>
            </div>
            <div className="flex-1">
              <ul className="text-base mb-5 list-disc list-inside text-left w-full text-gray-200">
                <li>Forma <b>columnas</b> para ganar puntos.</li>
                <li>Usa los puntos para comprar <b>pokeballs</b> en la tienda.</li>
                <li>Lanza <b>pokeballs</b> para dañar al Pokémon rival.</li>
              </ul>
            </div>
          </div>
          <div className="flex w-full justify-center mt-2">
            <button
              className="px-7 py-2 bg-gradient-to-r from-black via-purple-900 to-black text-purple-200 rounded font-bold shadow hover:scale-105 transition-transform ring-2 ring-black/30 cursor-pointer uppercase"
              onClick={onContinue}
            >
              ¡Jugar!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
