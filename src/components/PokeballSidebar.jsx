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
    <div className="relative flex items-center justify-end w-[16vw] max-w-[220px] min-w-[120px] h-[3.5vw] max-h-[56px] min-h-[36px] overflow-hidden p-0 m-0">
      {/* Nombre arriba a la izquierda */}
      <span className="absolute top-0 left-0 font-bold text-white text-[0.75vw] uppercase opacity-85 z-20 text-left px-[2px] pt-[2px]" style={{textShadow: '0 1px 4px #222', letterSpacing: '0'}}>{pokeballs[idx].name}</span>
      {/* Precio abajo a la izquierda */}
      <span className="absolute left-0 bottom-0 text-yellow-300 font-bold text-left opacity-70 pointer-events-none text-[1.3vw] px-[2px] pb-[2px]">${pokeballs[idx].price}</span>
      <div className={className + " transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 relative w-[5vw] h-[5vw] min-w-[40px] min-h-[40px] max-w-[80px] max-h-[80px]"}>
        <span className="pokeball-inner" style={{width: "12%", height: "12%"}} />
      </div>
    </div>
  );
}

export default function PokeballSidebar() {
  const { addBall } = usePokeballs();
  return (
    <div className="pokeball-sidebar flex flex-col gap-1.5 items-end h-fit w-full justify-start mt-2">
      {pokeballs.map((ball, idx) => (
        <div
          className="bg-gradient-to-l from-black via-red-900 to-blue-950 z-10 flex items-center transition-all duration-200 hover:brightness-125 cursor-pointer w-full h-auto justify-end relative box-border overflow-hidden min-w-[12vw] max-w-[20vw] p-0 m-0"
          key={idx}
          onClick={() => addBall(idx)}
        >
          <PokeballHTML className={ball.className} idx={idx} />
        </div>
      ))}
    </div>
  );
}
