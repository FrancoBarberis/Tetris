import React, { createContext, useContext, useState } from "react";

const PokeballContext = createContext();

export function usePokeballs() {
  const ctx = useContext(PokeballContext);
  if (!ctx) throw new Error("usePokeballs must be used within PokeballProvider");
  return ctx;
}

export function PokeballProvider({ children }) {
  // [normal, super, ultra, master]
  const [balls, setBalls] = useState([0, 0, 0, 0]);

  function addBall(typeIdx) {
    setBalls(prev => prev.map((v, i) => i === typeIdx ? v + 1 : v));
  }

  function useBall(typeIdx) {
    setBalls(prev => prev.map((v, i) => i === typeIdx ? Math.max(0, v - 1) : v));
  }

  return (
    <PokeballContext.Provider value={{ balls, addBall, useBall }}>
      {children}
    </PokeballContext.Provider>
  );
}
