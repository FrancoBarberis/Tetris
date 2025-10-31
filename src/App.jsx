import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import PokemonBox from "./components/PokemonBox";
import PokeballSidebar from "./components/PokeballFooter";
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
    <div className="flex flex-row min-h-screen w-full relative bg-black overflow-hidden">
      {/* Sprite gigante y opaco a la derecha */}
      {pokemonActual?.sprites?.front_default && (
        <img
          src={pokemonActual.sprites.front_default}
          alt={pokemonActual.name}
          className="pointer-events-none select-none fixed z-0"
          style={{
            height: '180vh',
            width: 'auto',
            opacity: 0.14,
            filter: 'drop-shadow(0 0 32px #000)',
            objectFit: 'contain',
            minWidth: '110vw',
            maxWidth: 'none',
            right: '-18vw',
            bottom: '-40vh',
          }}
        />
      )}
      <PokeballSidebar />
      <div className="flex flex-col flex-1 min-h-screen relative z-10">
        <Header
          nextPiece={boardState.nextPiece}
          score={boardState.score}
          shapeColors={boardState.shapeColors}
        />
        <Board
          pokemonBox={<PokemonBox pokemon={pokemonActual} />}
          onStateChange={setBoardState}
        />
      </div>
    </div>
  );
}

export default App;