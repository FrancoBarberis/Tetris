import React, { useEffect, useState } from "react";
import Board from "./components/Board";
import Header from "./components/Header";
import PokemonBox from "./components/PokemonBox";
import PokeballSidebar from "./components/PokeballSidebar";
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
    <div className="flex flex-col min-h-screen w-full relative bg-black overflow-hidden">
      {/* Sprite gigante y opaco a la derecha */}
      {pokemonActual?.sprites?.front_default && (
        <img
          src={pokemonActual.sprites.front_default}
          alt={pokemonActual.name}
          className="pointer-events-none select-none fixed z-0"
          style={{
            height: '200vh',
            width: 'auto',
            opacity: 0.14,
            filter: 'drop-shadow(0 0 32px #000)',
            objectFit: 'contain',
            right: '-18vw',
            top: '50%',
            transform: 'translateY(-50%)',
          }}
        />
      )}
      <Header
        nextPiece={boardState.nextPiece}
        score={boardState.score}
        shapeColors={boardState.shapeColors}
      />
      <div className="flex flex-row w-full flex-grow min-h-0 justify-center items-center">
        <PokeballSidebar />
        <div className="game-container flex flex-1 items-center justify-center min-h-0 gap-8 px-8 max-w-7xl mx-auto" style={{height: '100%'}}>
          <Board
            pokemonBox={<PokemonBox pokemon={pokemonActual} />}
            onStateChange={setBoardState}
          />
        </div>
      </div>
    </div>
  );
}

export default App;