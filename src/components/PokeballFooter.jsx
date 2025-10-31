import React, { useState } from "react";

const pokeballs = [
  { className: "pokeball pokeball-normal" },
  { className: "pokeball pokeball-super" },
  { className: "pokeball pokeball-ultra" },
  { className: "pokeball pokeball-master" },
];

function PokeballHTML({ className }) {
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
      <span className="flex items-center justify-center mb-2" style={{height: '3.5rem', fontWeight: 'bold', fontSize: '2.5rem', color: '#fff', letterSpacing: '2px'}}>
        <span className="mr-2" style={{fontWeight: 'bold', fontSize: '2.5rem', color: '#fff'}}>x</span>
        <span className="ball-counter relative inline-block w-14 h-14 overflow-visible" style={{position: 'relative'}}>
          {prevCount !== null && animating && (
            <span key={`old-${prevCount}`} className="absolute left-0 top-0 w-full h-full animate-pokeball-count-push-old" style={{fontWeight: 'bold', fontSize: '2.5rem', color: '#fff'}}>
              {prevCount}
            </span>
          )}
          <span key={`new-${count}`} className={`absolute left-0 top-0 w-full h-full ${animating ? 'animate-pokeball-count-push-new' : ''}`} style={{fontWeight: 'bold', fontSize: '2.5rem', color: '#fff'}}>
            {count}
          </span>
        </span>
      </span>
      <div
        className={className + ' transition-transform duration-200 group-hover:scale-110 group-focus:scale-110'}
        style={{ position: 'relative', width: '96px', height: '96px' }}
      >
        <span className="pokeball-inner" />
      </div>
    </button>
  );
}

export default function PokeballSidebar() {
  return (
    <aside className="h-full flex flex-col items-end justify-center py-6 bg-transparent fixed left-0 top-0 z-40" style={{width: '120px'}}>
      <div className="flex flex-col gap-12 items-end h-full justify-center">
        {pokeballs.map((ball, idx) => (
          <div className="relative" key={idx} style={{left: '-48px'}}>
            <PokeballHTML className={ball.className} />
          </div>
        ))}
      </div>
    </aside>
  );
}
