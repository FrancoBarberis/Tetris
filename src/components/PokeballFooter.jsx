import React from "react";

const pokeballs = [
  { name: "Pokeball", className: "pokeball pokeball-normal" },
  { name: "Superball", className: "pokeball pokeball-super" },
  { name: "Ultraball", className: "pokeball pokeball-ultra" },
  { name: "Masterball", className: "pokeball pokeball-master" },
];

function PokeballHTML({ name, className }) {
  return (
    <div className="flex flex-col items-center mx-4">
      <div className={className} style={{position:'relative'}}>
        <span className="pokeball-inner" />
        {className.includes('master') && (
          <span className="pokeball-m">M</span>
        )}
      </div>
      <span className="text-xs text-white mt-1">{name}</span>
    </div>
  );
}

export default function PokeballFooter() {
  return (
    <footer className="w-full flex flex-row items-center justify-center py-6 bg-transparent">
      {pokeballs.map(ball => (
        <PokeballHTML key={ball.name} name={ball.name} className={ball.className} />
      ))}
    </footer>
  );
}
