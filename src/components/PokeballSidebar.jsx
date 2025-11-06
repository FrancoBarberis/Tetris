import React from "react";
import { usePokeballs } from "../contexts/PokeballContext";

const pokeballs = [
  { className: "pokeball pokeball-normal" },
  { className: "pokeball pokeball-super" },
  { className: "pokeball pokeball-ultra" },
  { className: "pokeball pokeball-master" },
];

function PokeballHTML({ className, idx }) {
  const { balls, addBall } = usePokeballs();
  return (
    <button
      className="flex flex-row items-center"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
      tabIndex={0}
      onClick={() => addBall(idx)}
    >
      <span className="counter flex items-center justify-center h-fit w-fit gap-0">
        <span className="text-gray-300" style={{ fontWeight: "bold", fontSize: "1.5rem" }}>x</span>
        <span className="ball-counter text-gray-300 w-14 h-14" style={{ position: "relative", fontWeight: "bold", fontSize: "2.5rem" }}>{balls[idx]}</span>
      </span>
      <div className={className + " transition-transform duration-200 group-hover:scale-110 group-focus:scale-110 relative w-[7vh] h-[7vh] xl:w-[2.5vh] xl:h-[2.5vh]"}>
        <span className="pokeball-inner" style={{width: "20%", height: "20%"}} />
      </div>
    </button>
  );
}

export default function PokeballSidebar() {
  return (
    <div className="pokeball-sidebar flex flex-col gap-1.5 items-end h-fit w-fit justify-start mt-2">
      {pokeballs.map((ball, idx) => (
        <div className="bg-gradient-to-l from-black via-red-900 to-blue-950 py-2 pl-6 pr-3" key={idx}
        style={{ borderTopRightRadius: "3%", borderBottomRightRadius: "3%" }}>
          <PokeballHTML className={ball.className} idx={idx} />
        </div>
      ))}
    </div>
  );
}
