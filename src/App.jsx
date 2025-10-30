import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import PokemonBox from "./components/PokemonBox";
import PokeballFooter from "./components/PokeballFooter";
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
    <div className="flex flex-col min-h-screen w-full">
      <div className="flex flex-row items-start justify-center flex-grow min-h-0 gap-4 md:gap-8 px-2 md:px-8 py-2 md:py-8 w-full">
        <Board pokemonBox={<PokemonBox pokemon={pokemonActual} />} />
      </div>
      <PokeballFooter />
    </div>
  );
}

export default App;