import React from "react";
import { usePokeballs } from "../contexts/PokeballContext";
import PokemonShop from "../assets/PokemonShop3rdGen.png";
import { useState, useEffect } from "react";
import { useLanguage } from "../contexts/LanguageContext";

const pokeballs = [
  { className: "pokeball pokeball-normal", price: 5, name: "NORMAL" },
  { className: "pokeball pokeball-super", price: 15, name: "SUPER" },
  { className: "pokeball pokeball-ultra", price: 50, name: "ULTRA" },
  { className: "pokeball pokeball-master", price: 100, name: "MASTER" },
];

function PokeballHTML({ className, idx }) {
  // El evento de compra se maneja en el contenedor padre
  return (
    //POKEBALLS
    <div className="relative flex items-center justify-end w-[16vw] max-w-[220px] min-w-[120px] h-[3.5vw] max-h-[56px] min-h-[36px] overflow-hidden p-0 m-0">
      {/* Nombre arriba a la izquierda */}
      <span className="absolute top-0 left-0 font-bold text-white text-[0.75vw] uppercase opacity-85 z-20 text-left px-[2px] pt-[2px]" style={{textShadow: '0 1px 4px #222', letterSpacing: '0'}}>{pokeballs[idx].name}</span>
      <span className="absolute left-0 bottom-0 text-yellow-300 font-bold text-left opacity-70 pointer-events-none text-[1.3vw] px-[2px] pb-[2px]">${pokeballs[idx].price}</span>
      <div className={className + " transition-transform duration-200 group-hover:scale-300 group-hover:rotate-12 group-hover:brightness-110  w-[5vw] h-[5vw] min-w-[40px] min-h-[40px] max-w-[80px] max-h-[80px] scale-120"} >
        <span className="pokeball-inner" style={{width: "12%", height: "12%"}} />
      </div>
    </div>
  );
}

export default function PokeballSidebar({ score, updateScore, disabled = false }) {
  const { language } = useLanguage();
  const { addBall } = usePokeballs();
  const [activeIdx, setActiveIdx] = useState(null);
  const [purchaseAnimations, setPurchaseAnimations] = useState([]);

  const handlePurchase = (idx) => {
    if (disabled) return; // No permitir compras si está deshabilitado
    const price = pokeballs[idx].price;
    if (score >= price) {
      addBall(idx);
      // Reducir créditos
      updateScore(score - price);
      // Agregar animación de +1
      const animId = Date.now();
      setPurchaseAnimations(prev => [...prev, { id: animId, idx }]);
      
      // Remover después de la animación
      setTimeout(() => {
        setPurchaseAnimations(prev => prev.filter(a => a.id !== animId));
      }, 1000);
    }
  };

  const translations = {
    en: { credits: "Credits" },
    es: { credits: "Créditos" }
  };
  const t = translations[language];

  return (
    <div className="relative z-30">
      {/* Display de créditos */}
      <div className="mb-3 text-center p-2 rounded relative z-30 shadow-lg" style={{ backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
        <span className="text-yellow-300 font-bold text-lg uppercase tracking-wide">{t.credits}: </span>
        <span className="text-yellow-100 font-extrabold text-xl">${score}</span>
      </div>
      
      <div className="pokeball-sidebar flex flex-col gap-1.5 items-end h-fit w-full justify-start mt-2">
        {pokeballs.map((ball, idx) => (
          <div
            className={`group bg-gradient-to-l from-black via-red-900 to-blue-950 z-10 flex items-center transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:brightness-125 cursor-pointer'} w-full h-auto justify-end box-border overflow-visible min-w-[12vw] max-w-[20vw] p-0 m-0`}
            key={idx}
            style={{ position: 'relative' }}
          >
            <div 
              className={`w-full h-full ${activeIdx === idx && !disabled ? 'scale-95' : ''} transition-transform duration-200`}
              onClick={() => !disabled && handlePurchase(idx)}
              onMouseDown={() => !disabled && setActiveIdx(idx)}
              onMouseUp={() => setActiveIdx(null)}
              onMouseLeave={() => setActiveIdx(null)}
            >
              <PokeballHTML className={ball.className} idx={idx} />
            </div>
            
            {/* Animación +1 fuera del contenedor, a la derecha */}
            {purchaseAnimations.filter(a => a.idx === idx).map(anim => (
              <div
                key={anim.id}
                className="absolute text-green-400 font-bold text-2xl pointer-events-none z-40"
                style={{
                  left: 'calc(100% + 10px)',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  animation: 'purchase-notification 1s ease-out forwards',
                  textShadow: '0 0 8px #000, 0 0 4px #0f0'
                }}
              >
                +1
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
