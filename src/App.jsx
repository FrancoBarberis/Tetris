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
import HighGrass from "./assets/HighGrass.png";

// Importar componente PokeballSVG para la notificación de captura
function PokeballSVG({ type, size = 32, idPrefix = '' }) {
  const POKEBALL_COLORS = {
    normal: { top: "#EE1C25", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
    super: { top: "#2A4BA0", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
    ultra: { top: "#3B3B3B", bottom: "#FFF", band: "#FFD700", button: "#FFF", buttonBorder: "#222" },
    master: { top: "#A040A0", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
  };
  const colors = POKEBALL_COLORS[type] || POKEBALL_COLORS.normal;
  
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: 'block' }}>
      <defs>
        <linearGradient id={`${idPrefix}top-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.top} />
          <stop offset="100%" stopColor={colors.top} />
        </linearGradient>
        <linearGradient id={`${idPrefix}bottom-${type}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.bottom} />
          <stop offset="100%" stopColor={colors.bottom} />
        </linearGradient>
      </defs>
      <path d="M 4,24 a 20,20 0 1,1 40,0" fill={`url(#${idPrefix}top-${type})`} stroke={colors.band} strokeWidth="2.5" />
      <path d="M 44,24 a 20,20 0 1,1 -40,0" fill={`url(#${idPrefix}bottom-${type})`} stroke={colors.band} strokeWidth="2.5" />
      <rect x="4" y="22.5" width="40" height="3" fill={colors.band} />
      <circle cx="24" cy="24" r="7" fill={colors.button} stroke={colors.buttonBorder} strokeWidth="2" />
    </svg>
  );
}

function App() {
  const [bgEntering, setBgEntering] = useState(false);
  const [pokemonActual, setPokemonActual] = useState(null);
  const [captureNotification, setCaptureNotification] = useState(null);
  const [capturedCount, setCapturedCount] = useState(0);
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
  // Consultar el Pokémon durante la carga (solo una vez)
  useEffect(() => {
    getRandomPokemon().then((poke) => {
      setPokemonActual(poke);
      // No establecer backgroundSprite aquí, dejar que el otro useEffect lo maneje
    });
  }, []); // Sin dependencias para que solo se ejecute una vez

  useEffect(() => {
    if (displayProgress === 100 && gifCyclesAfterFull >= 2 && loading) {
      setLoading(false);
      setShowTutorial(true);
    }
  }, [displayProgress, gifCyclesAfterFull, loading]);


  // Board devolverá nextPiece, score y shapeColors como props
  const [boardState, setBoardState] = useState({ nextPiece: null, score: 0, shapeColors: {}, gameOver: false });
  const [boardKey, setBoardKey] = useState(0);
  const [credits, setCredits] = useState(100); // Créditos iniciales separados del score

  // Función para actualizar el score desde fuera del Board
  const updateScore = (newScore) => {
    setBoardState(prev => ({ ...prev, score: newScore }));
  };
  
  // Función para incrementar el score (usado por Board) - también incrementa créditos
  const incrementScore = (points) => {
    setBoardState(prev => ({ ...prev, score: prev.score + points }));
    setCredits(prev => prev + points); // Los créditos aumentan con los puntos
  };
  
  // Función para actualizar solo los créditos (usado por compras)
  const updateCredits = (newCredits) => {
    setCredits(newCredits);
  };
  
  // Función para resetear créditos al valor inicial
  const resetCredits = () => {
    setCredits(100);
    setCapturedCount(0);
  };
  
  // Función para manejar captura de Pokémon
  const handleCapture = (notification) => {
    setCaptureNotification(notification);
    setCapturedCount(prev => prev + 1);
  };

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
                opacity: .7,
                filter: 'drop-shadow(0 0 32px #000)',
                objectFit: 'contain',
                right: '-20vw',
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
        className="pointer-events-none select-none absolute z-20"
        style={{
          height: 'min(14vw, 22vh)',
          width: 'auto',
          opacity: 1,
          left: '2vw',
          top: 'calc(15vh + 25px)', // alineada con las pokeballs del sidebar
          objectFit: 'contain',
        }}
      />
      {/* HIERBA ALTA */}
      <img src={HighGrass} alt="HighGrass" className="pointer-events-none select-none absolute z-10 -bottom-20 w-full h-8/12 opacity-70"  />
      <Header
        nextPiece={boardState.nextPiece}
        score={boardState.score}
        shapeColors={boardState.shapeColors}
      />
      
      {/* Notificación de captura como popup absoluto, sin afectar flujo del Header */}
      {captureNotification && (
        <div
          className="fixed top-20 left-1/2 transform -translate-x-1/2 z-[100] flex-shrink-0 bg-green-600 text-white font-bold px-4 py-2 rounded shadow-lg flex items-center gap-3"
          style={{
            animation: 'capture-fade 3s ease-out forwards',
            textShadow: '0 0 8px #000',
            maxWidth: '300px'
          }}
        >
          <div className="text-sm whitespace-nowrap">{captureNotification.text}</div>
          <div className="flex items-center gap-2">
            {captureNotification.sprite && (
              <img
                src={captureNotification.sprite}
                alt="Captured Pokemon"
                className="w-10 h-10"
                style={{ imageRendering: 'pixelated' }}
              />
            )}
            {captureNotification.ballType && (
              <PokeballSVG 
                type={captureNotification.ballType} 
                size={40} 
                idPrefix="capture-popup-"
              />
            )}
          </div>
        </div>
      )}
      
      <div className="application-container flex flex-row w-full flex-grow min-h-0 items-center justify-between relative">
  <div className="relative flex flex-col items-end">
          <PokeballSidebar score={credits} updateScore={updateCredits} disabled={boardState.gameOver} />
          {/* Switch de idioma y botón de ayuda abajo a la izquierda, compacto */}
          <div className="fixed bottom-3 left-3 z-50 flex gap-1 items-center">
            <button
              onClick={() => setShowTutorial(true)}
              className="px-3 py-1 rounded font-bold text-sm transition-all cursor-pointer border-2 flex items-center justify-center bg-purple-700 text-white border-purple-400 hover:bg-purple-600"
              style={{ boxShadow: '0 2px 6px #222', width: 32, minWidth: 32, maxWidth: 32, height: 22, minHeight: 22, maxHeight: 22, lineHeight: '1.1', textAlign: 'center' }}
              title={language === "es" ? "Ayuda" : "Help"}
            >
              ?
            </button>
            <span className="text-base">|</span>
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
            onScoreIncrement={incrementScore}
            currentScore={boardState.score}
            isPaused={showTutorial}
            onResetCredits={resetCredits}
            capturedCount={capturedCount}
          />
        </div>
        <div className="flex items-center z-20">
          <PokemonBox 
            pokemon={pokemonActual} 
            onChangePokemon={handleChangePokemon}
            onCapture={handleCapture}
            disabled={boardState.gameOver}
          />
        </div>
      </div>
      {showTutorial && (
        <TutorialScreen onContinue={() => setShowTutorial(false)} />
      )}
    </div>
  );
}

export default App;