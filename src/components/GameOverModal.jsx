import React from 'react';
import { useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

export default function GameOverModal({ score, capturedCount, onRestart }) {
  const { language } = useLanguage();
  
  const translations = {
    en: {
      title: 'Game Over',
      score: 'Your score',
      captured: 'Pokémon captured',
      restart: 'Restart'
    },
    es: {
      title: 'Fin del Juego',
      score: 'Tu puntuación',
      captured: 'Pokémon capturados',
      restart: 'Reiniciar'
    }
  };
  
  const t = translations[language];
  
  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  
  return (
    // Contenedor fijo que cubre toda la pantalla
  <div className="fixed inset-0 flex items-center justify-center z-[200]">
      {/* Overlay semitransparente con blur y gradiente - debe cubrir todo */}
  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-gray-900/70 backdrop-blur-md z-[190]" />

      {/* Modal visualmente consistente con el layout principal */}
      <div className="game-over-modal relative max-w-sm w-full mx-4 pointer-events-auto z-[200]">
          <div className="bg-gradient-to-b from-black to-blue-900 rounded p-3 text-center border-1 border-blue-600">
            <h2 className="text-2xl font-extrabold mb-4 text-gray-300 uppercase drop-shadow">{t.title}</h2>
            <p className="mb-2 text-md text-gray-300 uppercase">{t.score}<br /><span className="font-bold text-2xl text-gray-300 drop-shadow">{score}</span></p>
            <p className="mb-6 text-md text-gray-300 uppercase">{t.captured}<br /><span className="font-bold text-2xl text-gray-300 drop-shadow">{capturedCount}</span></p>
            <div className="flex justify-center">
              <button
                onClick={onRestart}
                className="px-6 py-2 bg-gradient-to-r from-black via-blue-950 to-black text-gray-300 rounded font-semibold shadow hover:scale-105 transition-transform ring-2 ring-black/30 cursor-pointer uppercase"
              >
                {t.restart}
              </button>
            </div>
          </div>
        </div>
    </div>
  );
}
