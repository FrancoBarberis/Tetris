import React from "react";
import { usePokeballs } from "../contexts/PokeballContext";
import PokemonShop from "../assets/PokemonShop3rdGen.png";

const pokeballs = [
  { className: "pokeball pokeball-normal", price: 50, name: "NORMAL" },
  { className: "pokeball pokeball-super", price: 120, name: "SUPER" },
  { className: "pokeball pokeball-ultra", price: 350, name: "ULTRA" },
  { className: "pokeball pokeball-master", price: 999, name: "MASTER" },
];

function PokeballHTML({ className, idx }) {
  // El evento de compra se maneja en el contenedor padre
  return (
    <div style={{ position: 'relative', width: 180, height: 56, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 0, margin: 0 }}>
      <span className="text-yellow-300 font-bold" style={{ position: 'absolute', left: 8, bottom: '-15%', width: 60, textAlign: 'left', opacity: 0.7, pointerEvents: 'none', fontSize: '2rem' }}>${pokeballs[idx].price}</span>
      <div className={className + " transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 relative w-[3.2vh] h-[3.2vh] xl:w-[1.1vh] xl:h-[1.1vh]"}>
        <span className="pokeball-inner" style={{width: "12%", height: "12%"}} />
      </div>
    </div>
  );
}

export default function PokeballSidebar() {
  const { addBall } = usePokeballs();
  return (
    <div className="pokeball-sidebar flex flex-col gap-1.5 items-end h-fit w-fit justify-start mt-2">
      {pokeballs.map((ball, idx) => (
        <div
          className="bg-gradient-to-l from-black via-red-900 to-blue-950 z-10 flex items-center transition-all duration-200 hover:brightness-125 cursor-pointer w-full max-w-lg min-w-[180px] h-auto px-2 py-1 justify-end relative"
          style={{ boxSizing: 'border-box', padding: 0, margin: 0, overflow: 'hidden' }}
          key={idx}
          onClick={() => addBall(idx)}
        >
          {/* Nombre de la ball en la esquina superior derecha */}
          <span
            style={{
              position: 'absolute',
              top: 4,
              left: 8,
              fontWeight: 'bold',
              fontSize: '0.85rem',
              color: '#fff',
              textShadow: '0 1px 4px #222',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              opacity: 0.85,
              zIndex: 20,
              width: 60,
              textAlign: 'left',
            }}
          >
            {ball.name}
          </span>
          <PokeballHTML className={ball.className} idx={idx} />
        </div>
      ))}
    </div>
  );
}
