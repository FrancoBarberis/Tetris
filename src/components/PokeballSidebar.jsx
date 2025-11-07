import React from "react";
import { usePokeballs } from "../contexts/PokeballContext";
import PokemonShop from "../assets/PokemonShop3rdGen.png";

const pokeballs = [
  { className: "pokeball pokeball-normal", price: 50 },
  { className: "pokeball pokeball-super", price: 120 },
  { className: "pokeball pokeball-ultra", price: 350 },
  { className: "pokeball pokeball-master", price: 999 },
];

function PokeballHTML({ className, idx }) {
  const { balls, addBall } = usePokeballs();
  return (
    <div style={{ position: 'relative', width: 160, height: 56, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: 0, margin: 0 }}>
      <span className="text-yellow-300 font-bold text-2xl" style={{ position: 'absolute', left: 0, bottom: '-15%', width: 60, textAlign: 'left', opacity: 0.65, pointerEvents: 'none' }}>${pokeballs[idx].price}</span>
      <button
        className="flex flex-row items-center"
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          minWidth: 56,
          minHeight: 56,
          maxHeight: 56,
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
        tabIndex={0}
        onClick={() => addBall(idx)}
      >
        <div className={className + " transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 relative w-[3.2vh] h-[3.2vh] xl:w-[1.1vh] xl:h-[1.1vh]"}>
          <span className="pokeball-inner" style={{width: "12%", height: "12%"}} />
        </div>
      </button>
    </div>
  );
}

export default function PokeballSidebar() {
  return (
    <div className="pokeball-sidebar flex flex-col gap-1.5 items-end h-fit w-fit justify-start mt-2">
      {pokeballs.map((ball, idx) => (
        <div
          className="bg-gradient-to-l from-black via-red-900 to-blue-950 z-10 flex items-center transition-all duration-200 hover:brightness-125 cursor-pointer w-full max-w-xs min-w-[120px] h-auto px-2 py-1 justify-end"
          style={{ boxSizing: 'border-box', padding: 0, margin: 0, overflow: 'hidden' }}
          key={idx}
          onClick={() => usePokeballs().addBall(idx)}
        >
          <PokeballHTML className={ball.className} idx={idx} />
        </div>
      ))}
    </div>
  );
}
