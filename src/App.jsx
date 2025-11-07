import { useLanguage } from "./contexts/LanguageContext";
import React, { useEffect, useState, useRef } from "react";
import LoadingScreen from "./components/LoadingScreen";
import TutorialScreen from "./components/TutorialScreen";
import { loadResources } from "./components/ResourceLoader";
import Board from "./components/Board";
import Header from "./components/Header";
import PokemonBox from "./components/PokemonBox";
import PokeballSidebar from "./components/PokeballSidebar";
import getRandomPokemon from "./utils/pokemons";
import pokemonShop from "./assets/PokemonShop3rdGen.png";

function App() {
  const [bgEntering, setBgEntering] = useState(false);
  const [pokemonActual, setPokemonActual] = useState(null);
    const [backgroundSprite, setBackgroundSprite] = useState(null);
    const handleChangePokemon = (poke) => {
      setBackgroundSprite(null);
      setPokemonActual(poke);
    };
    useEffect(() => {
      if (pokemonActual?.sprites?.front_default) {
        setBackgroundSprite(pokemonActual.sprites.front_default);
        setBgEntering(true);
        const timeout = setTimeout(() => setBgEntering(false), 600);
        return () => clearTimeout(timeout);
      }
    }, [pokemonActual]);
  const [showTutorial, setShowTutorial] = useState(false);
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
  // Consultar el Pokémon durante la carga
  useEffect(() => {
    if (!pokemonActual) {
      getRandomPokemon().then((poke) => {
        setPokemonActual(poke);
        setBackgroundSprite(poke?.sprites?.front_default || null);
      });
    }
  }, [pokemonActual]);

  useEffect(() => {
    if (displayProgress === 100 && gifCyclesAfterFull >= 2 && loading) {
      setLoading(false);
      setShowTutorial(true);
    }
  }, [displayProgress, gifCyclesAfterFull, loading]);


  // Board devolverá nextPiece, score y shapeColors como props
  const [boardState, setBoardState] = useState({ nextPiece: null, score: 0, shapeColors: {} });
  const [boardKey, setBoardKey] = useState(0);

  if (loading || displayProgress < 100 || gifCyclesAfterFull < 2) {
    return (
      <LoadingScreen
        progress={displayProgress}
      />
    );
  }

  const { language, setLanguage } = useLanguage();
  // Función para reiniciar el Board desde App (pasar a GameOverModal)
  const handleBoardRestart = () => {
    setBoardKey(prev => prev + 1);
  };

  return (
    <div className="flex flex-col min-h-screen w-full relative bg-black overflow-hidden">
      {/* Giant and faded sprite on the right */}
          {backgroundSprite && (
            <img
              src={backgroundSprite}
              alt={pokemonActual?.name}
              className="pointer-events-none select-none fixed z-0"
              style={{
                height: '200vh',
                width: 'auto',
                opacity: 0.3,
                filter: 'drop-shadow(0 0 32px #000)',
                objectFit: 'contain',
                right: '-10vw',
                top: '50%',
                transform: 'translateY(-50%)',
                animation: bgEntering ? 'bg-fade-in-up 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards' : 'none',
              }}
            />
          )}
      {/* Fondo de la tienda PokemonShop en la esquina inferior izquierda */}
      <img
        src={pokemonShop}
        alt="PokemonShop"
        className="pointer-events-none select-none absolute z-0"
        style={{
          height: 'min(14vw, 22vh)',
          width: 'auto',
          opacity: 0.22,
          left: '2vw',
          top: 'calc(15vh + 32px)', // alineada con las pokeballs del sidebar
          objectFit: 'contain',
        }}
      />
      <Header
        nextPiece={boardState.nextPiece}
        score={boardState.score}
        shapeColors={boardState.shapeColors}
      />
      <div className="application-container flex flex-row w-full flex-grow min-h-0 items-center justify-between relative">
  <div className="relative flex flex-col items-end">
          <PokeballSidebar />
          {/* Switch de idioma abajo a la izquierda, compacto */}
          <div className="fixed bottom-3 left-3 z-50 flex gap-1 items-center">
            <button
              onClick={() => setLanguage("en")}
              className={`px-3 py-1 rounded font-bold text-sm transition-all cursor-pointer border-2 flex items-center justify-center ${language === "en" ? "bg-blue-900 text-white border-blue-400" : "bg-gray-700 text-gray-400 hover:bg-gray-600 border-gray-500"}`}
              style={{ boxShadow: '0 2px 6px #222', width: 32, minWidth: 32, maxWidth: 32, height: 22, minHeight: 22, maxHeight: 22, lineHeight: '1.1', textAlign: 'center' }}
            >
              EN
            </button>
            <span className="text-base">🌐</span>
            <button
              onClick={() => setLanguage("es")}
              className={`px-3 py-1 rounded font-bold text-sm transition-all cursor-pointer border-2 flex items-center justify-center ${language === "es" ? "bg-blue-900 text-white border-blue-400" : "bg-gray-700 text-gray-400 hover:bg-gray-600 border-gray-500"}`}
              style={{ boxShadow: '0 2px 6px #222', width: 32, minWidth: 32, maxWidth: 32, height: 22, minHeight: 22, maxHeight: 22, lineHeight: '1.1', textAlign: 'center' }}
            >
              ES
            </button>
          </div>
        </div>
        <div className="flex-grow flex items-center justify-center gap-x-8 xl:gap-x-16">
          <Board
            key={boardKey}
            onStateChange={setBoardState}
            isPaused={showTutorial}
          />
        </div>
        <div className="flex items-center">
          <PokemonBox pokemon={pokemonActual} onChangePokemon={handleChangePokemon} />
        </div>
      </div>
      {showTutorial && (
        <TutorialScreen onContinue={() => setShowTutorial(false)} />
      )}
    </div>
  );
}

export default App;