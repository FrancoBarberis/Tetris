
import React, { useEffect } from "react";
import pokeballIcon from "../assets/pokeball.png";
import { useLanguage } from "../contexts/LanguageContext";

const translations = {
  en: {
    title: "How to play Pokétris?",
    instructions: [
      { text: "Pieces <b>fall to the right</b>." },
      { text: "Use <b>←</b> or <b>A</b> to rotate the piece." },
      { text: "Use <b>↑</b> or <b>W</b>, <b>→</b> or <b>D</b> and <b>↓</b> or <b>S</b> to move the piece." },
      { text: "Don't let the pieces go past the <b>left edge</b>!" },
    ],
    goals: [
      { text: "Form <b>columns</b> to earn points." },
      { text: "Use points to buy <b>pokeballs</b> of different rarities in the shop." },
      { text: "Throw <b>pokeballs</b> to damage the rival Pokémon (the higher the rarity, the more damage it does)." },
    ],
    playButton: "Play!",
  },
  es: {
    title: "¿Cómo jugar Pokétris?",
    instructions: [
      { text: "Las piezas <b>caen hacia la derecha</b>." },
      { text: "Usa <b>←</b> o <b>A</b> para rotar la pieza." },
      { text: "Usa <b>↑</b> o <b>W</b>, <b>→</b> o <b>D</b> y <b>↓</b> o <b>S</b> para mover la pieza." },
      { text: "¡No dejes que las piezas se pasen del <b>borde izquierdo</b>!" },
    ],
    goals: [
      { text: "Forma <b>columnas</b> para ganar puntos." },
      { text: "Usa los puntos para comprar <b>pokeballs</b> de distintas rarezas en la tienda." },
      { text: "Lanza <b>pokeballs</b> para dañar al Pokémon rival (a mayor rareza, más daño hace)." },
    ],
    playButton: "¡Jugar!",
  },
};

export default function TutorialScreen({ onContinue }) {
  const { language, setLanguage } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    document.body.classList.add('overflow-hidden');
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
  {/* Semi-transparent overlay with blur and gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-500/10 to-gray-600/10 backdrop-blur-md" />
  {/* Modal visually consistent with the main layout */}
      <div className="tutorial-modal relative w-full max-w-3xl mx-4 pointer-events-auto">
        <div className="bg-gradient-to-b from-black to-blue-900 rounded p-6 md:p-10 border-2 border-purple-700 flex flex-col items-stretch relative" style={{ minHeight: '450px', paddingBottom: '5%' }}>
          <h2 className="text-2xl font-extrabold mb-3 text-purple-300 uppercase drop-shadow text-center">{t.title}</h2>
          <div className="instructions flex flex-col md:flex-row w-full flex-1 overflow-auto md:mt-12 lg:mt-3 md:gap-x-8">
            <div className="flex-1">
                  <ul className="text-base mb-5 list-disc list-inside text-left w-full text-gray-200 md:pl-4 md:pr-2">
                {t.instructions.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 mb-2">
                    <img src={pokeballIcon} alt="" className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: item.text }} />
                  </li>
                ))}
              </ul>
            </div>
    <div className="flex-1">
      <ul className="text-base mb-5 list-disc list-inside text-left w-full text-gray-200 md:pr-6 md:pl-2">
                {t.goals.map((item, index) => (
                  <li key={index} className="flex items-start gap-2 mb-2">
                    <img src={pokeballIcon} alt="" className="w-4 h-4 mt-1 flex-shrink-0" />
                    <span dangerouslySetInnerHTML={{ __html: item.text }} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="flex w-full justify-between items-center mt-auto pt-4 border-t border-purple-700/50 absolute bottom-[1%] left-0 right-0 px-6 md:px-10 bg-gradient-to-b from-transparent to-blue-900/80 pb-2">
            {/* Language Switch */}
            <div className="flex gap-2 items-center">
              <button
                onClick={() => setLanguage("en")}
                className={`px-3 py-1 rounded font-bold text-sm transition-all cursor-pointer border-2 ${
                  language === "en"
                    ? "bg-blue-900 text-white border-blue-400"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600 border-gray-500"
                }`}
              >
                EN
              </button>
              <span className="text-xl">🌐</span>
              <button
                onClick={() => setLanguage("es")}
                className={`px-3 py-1 rounded font-bold text-sm transition-all cursor-pointer border-2 ${
                  language === "es"
                    ? "bg-blue-900 text-white border-blue-400"
                    : "bg-gray-700 text-gray-400 hover:bg-gray-600 border-gray-500"
                }`}
              >
                ES
              </button>
            </div>
            <button
              className="play-button px-7 py-2 bg-gradient-to-r from-black via-purple-900 to-black text-purple-200 rounded font-bold shadow hover:scale-105 transition-transform ring-2 ring-black/30 cursor-pointer uppercase min-w-[120px]"
              onClick={onContinue}
            >
              {t.playButton}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
