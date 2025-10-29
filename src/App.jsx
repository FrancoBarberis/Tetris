import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import getRandomPokemon from "./utils/pokemons";

function App() {
  const [pokemonActual, setPokemonActual] = useState(null);

  useEffect(() => {
    async function fetchPokemon() {
      const data = await getRandomPokemon();
      setPokemonActual(data);
    }
    fetchPokemon();
  }, []);

  return (
    <>
      <Board />
      {pokemonActual ? (
        <div className="text-white w-auto h-10">
          <p>ID: {pokemonActual.id}</p>
          <p>Nombre: {pokemonActual.name}</p>
          <img src={pokemonActual.sprites.front_default} alt={pokemonActual.name} />
        </div>
      ) : (
        <p className="text-white">Cargando Pokémon...</p>
      )}
    </>
  );
}

export default App;