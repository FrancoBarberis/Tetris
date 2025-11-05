import React, { useEffect, useState, useRef } from "react";
import LoadingScreen from "./components/LoadingScreen";
import { loadResources } from "./components/ResourceLoader";
import Board from "./components/Board";
import Header from "./components/Header";
import PokemonBox from "./components/PokemonBox";
import PokeballSidebar from "./components/PokeballSidebar";
import getRandomPokemon from "./utils/pokemons";

function App() {
  const [pokemonActual, setPokemonActual] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [displayProgress, setDisplayProgress] = useState(0); // para animar suavemente
  const [gifCyclesAfterFull, setGifCyclesAfterFull] = useState(0);
  const [fullBarTimestamp, setFullBarTimestamp] = useState(null);
  const GENGAR_GIF_DURATION = 1440; // ms, 20% más rápido, debe coincidir con ResourceLoader.js

  // Cargar recursos y esperar mínimo 2 ciclos del gif
  // Cargar recursos y contar ciclos del gif
  useEffect(() => {
    loadResources((p) => setProgress(p));
  }, []);

  // Cuando la barra llega a 100%, empezar a contar ciclos del gif
  useEffect(() => {
    if (displayProgress === 100 && !fullBarTimestamp) {
      setFullBarTimestamp(Date.now());
      setGifCyclesAfterFull(0);
    }
  }, [displayProgress, fullBarTimestamp]);

  useEffect(() => {
    if (!fullBarTimestamp) return;
    // Contar ciclos del gif SOLO después de la barra llena
    const interval = setInterval(() => {
      setGifCyclesAfterFull(cycles => cycles + 1);
    }, GENGAR_GIF_DURATION);
    return () => clearInterval(interval);
  }, [fullBarTimestamp]);

  // Animar suavemente el progreso mostrado
  useEffect(() => {
    if (displayProgress < progress) {
      const anim = setInterval(() => {
        setDisplayProgress(prev => {
          if (prev + 1 >= progress) {
            clearInterval(anim);
            return progress;
          }
          return prev + 1;
        });
      }, 12); // velocidad de animación
      return () => clearInterval(anim);
    }
  }, [progress, displayProgress]);

  // Entrar automáticamente al juego cuando todo esté listo
  // Solo entrar cuando la barra esté llena Y el gif haya terminado 2 ciclos completos
  useEffect(() => {
    if (displayProgress === 100 && gifCyclesAfterFull >= 2 && loading) {
      setLoading(false);
      async function fetchPokemon() {
        const data = await getRandomPokemon();
        setPokemonActual(data);
      }
      fetchPokemon();
    }
  }, [displayProgress, gifCyclesAfterFull, loading]);


  // Board devolverá nextPiece, score y shapeColors como props
  const [boardState, setBoardState] = useState({ nextPiece: null, score: 0, shapeColors: {} });

  if (loading || displayProgress < 100 || gifCyclesAfterFull < 2) {
    return (
      <LoadingScreen
        progress={displayProgress}
      />
    );
  }

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
            opacity: 0.3,
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
      <div className="application-container flex flex-row w-full flex-grow min-h-0 justify-center items-center">
        <PokeballSidebar />
          <Board
            pokemonBox={<PokemonBox pokemon={pokemonActual} />}
            onStateChange={setBoardState}
          />
      </div>
    </div>
  );
}

export default App;