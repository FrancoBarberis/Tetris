import React, { useState } from "react";

const pokeballs = [
  { name: "Pokeball", className: "pokeball pokeball-normal" },
  { name: "Superball", className: "pokeball pokeball-super" },
  { name: "Ultraball", className: "pokeball pokeball-ultra" },
  { name: "Masterball", className: "pokeball pokeball-master" },
];

function PokeballHTML({ name, className }) {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(null);
  const [animating, setAnimating] = useState(false);

  const handleClick = () => {
    setPrevCount(count);
    setCount(count + 1);
    setAnimating(true);
  };

  React.useEffect(() => {
    if (!animating) return;
    const timeout = setTimeout(() => {
      setPrevCount(null);
      setAnimating(false);
    }, 500);
    return () => clearTimeout(timeout);
  }, [animating]);

  return (
    <button
      className="flex flex-col items-center mx-6 focus:outline-none group"
      style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
      tabIndex={0}
      onClick={handleClick}
    >
      <span className="text-2xl font-extrabold mb-2 drop-shadow flex items-center justify-center" style={{height: '2.5rem', position: 'relative'}}>
        <span className="mr-0 bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent" style={{position: 'static'}}>x</span>
        <span className="ball-counter relative inline-block w-8 h-8 overflow-visible" style={{position: 'relative'}}>
          {prevCount !== null && animating && (
            <span key={`old-${prevCount}`} className="absolute left-0 top-0 w-full h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent animate-pokeball-count-push-old text-2xl font-extrabold pointer-events-none">
              {prevCount}
            </span>
          )}
          <span key={`new-${count}`} className={`absolute left-0 top-0 w-full h-full bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-500 bg-clip-text text-transparent ${animating ? 'animate-pokeball-count-push-new' : ''} text-2xl font-extrabold pointer-events-none`}>
            {count}
          </span>
        </span>
      </span>
      <div
        className={className + ' transition-transform duration-200 group-hover:scale-110 group-focus:scale-110'}
        style={{ position: 'relative' }}
      >
        <span className="pokeball-inner" />
        {className.includes('master') && (
          <span className="pokeball-m">M</span>
        )}
      </div>
      <span className="text-xs text-white mt-2">{name}</span>
    </button>
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
