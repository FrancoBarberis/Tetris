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
      className="flex flex-row items-center"
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
      }}
      tabIndex={0}
      onClick={handleClick}
    >
      <span
        className="counter flex items-center justify-center h-fit w-fit gap-0"
      >
        <span
          className="text-gray-300"
          style={{ fontWeight: "bold", fontSize: "1.5rem" }}
        >
          x
        </span>
        <span
          className="ball-counter text-gray-300 w-14 h-14"
          style={{ position: "relative" }}
        >
          {prevCount !== null && animating && (
            <span
              key={`old-${prevCount}`}
              className=" w-fit h-fit animate-pokeball-count-push-old text-gray-300"
              style={{ fontWeight: "bold", fontSize: "2.5rem" }}
            >
              {prevCount}
            </span>
          )}
          <span
            key={`new-${count}`}
            className={`absolute left-0 top-0 w-full h-full text-gray-300 ${
              animating ? "animate-pokeball-count-push-new" : ""
            }`}
            style={{ fontWeight: "bold", fontSize: "2.5rem" }}
          >
            {count}
          </span>
        </span>
      </span>
      <div
        className={
          className +
          " transition-transform duration-200 group-hover:scale-110 group-focus:scale-110"
        }
        style={{ position: "relative", width: "10vh", height: "10vh" }}
      >
        <span className="pokeball-inner"
        style={{width: "30%", height: "30%"}} />
      </div>
    </button>
  );
}

export default function PokeballSidebar() {
  return (
    <div className="pokeball-sidebar flex flex-col gap-1.5 items-end h-fit w-fit justify-start mt-2">
      {pokeballs.map((ball, idx) => (
        <div className="bg-gradient-to-l from-black via-red-900 to-blue-950 py-2 pl-6 pr-3 " key={idx}
        style={{ borderTopRightRadius: "3%", borderBottomRightRadius: "3%" }}>
          <PokeballHTML className={ball.className} />
        </div>
      ))}
    </div>
  );
}
