import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import PokemonBox from "./components/PokemonBox";
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
    <div className="flex flex-row items-start justify-center w-full h-full gap-8 p-8">
      <Board pokemonBox={<PokemonBox pokemon={pokemonActual} />} />
    </div>
  );
}

export default App;