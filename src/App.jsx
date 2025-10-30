import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
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

  // Board devolverá nextPiece, score y shapeColors como props
  const [boardState, setBoardState] = useState({ nextPiece: null, score: 0, shapeColors: {} });

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header
        nextPiece={boardState.nextPiece}
        score={boardState.score}
        shapeColors={boardState.shapeColors}
      />
      <Board
        pokemonBox={<PokemonBox pokemon={pokemonActual} />}
        onStateChange={setBoardState}
      />
      <PokeballFooter />
    </div>
  );
}

export default App;