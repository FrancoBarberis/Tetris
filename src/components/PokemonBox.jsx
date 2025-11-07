import pokeballIcon from "../assets/pokeball.png";
import { usePokeballs } from "../contexts/PokeballContext";

function PokeballButton({ type, label, color, disabled, onClick, style }) {
  // Clases para cada tipo de pokeball
  // Colores y banda para SVG pokeball
  const ballSVG = {
    normal: { top: "#EE1C25", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
    super: { top: "#2A4BA0", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
  ultra: { top: "#3B3B3B", bottom: "#FFF", band: "#FFD700", button: "#FFF", buttonBorder: "#222" },
    master: { top: "#A040A0", bottom: "#FFF", band: "#222", button: "#FFF", buttonBorder: "#CCC" },
  };
  const svg = ballSVG[type] || ballSVG.normal;
  return (
    <button
      className={`flex flex-col relative items-center rounded focus:outline-none transition-transform w-fit ${disabled ? "opacity-50 cursor-not-allowed grayscale" : "hover:scale-105 cursor-pointer"}`}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
      style={{ padding: 0, margin: 0, minWidth: 0, ...style }}
    >
      <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg shadow-md" style={{ minWidth: '32px', maxWidth: '32px', alignItems: 'center', background: 'rgba(30,30,40,0.85)', boxShadow: '0 2px 8px rgba(0,0,0,0.18)', padding: '0' }}>
        <svg width="24" height="24" viewBox="0 0 40 40" style={{ display: 'block', margin: '0', padding: 0 }}>
          <defs>
            <linearGradient id={`top-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={svg.top} />
              <stop offset="100%" stopColor={svg.top} />
            </linearGradient>
            <linearGradient id={`bottom-${type}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={svg.bottom} />
              <stop offset="100%" stopColor={svg.bottom} />
            </linearGradient>
          </defs>
          {/* Top half */}
          <path d="M8,20 a16,16 0 1,1 32,0" fill={`url(#top-${type})`} stroke={svg.band} strokeWidth="2.5" />
          {/* Bottom half */}
          <path d="M40,20 a16,16 0 1,1 -32,0" fill={`url(#bottom-${type})`} stroke={svg.band} strokeWidth="2.5" />
          {/* Band */}
          <rect x="8" y="19" width="32" height="3.5" fill={svg.band} />
          {/* Button */}
          <circle cx="20" cy="20" r="6" fill={svg.button} stroke={svg.buttonBorder} strokeWidth="2" />
        </svg>
          <div className="flex flex-col items-center w-full">
            <span
              className="text-[9px] font-bold text-white drop-shadow text-center pb-0"
              style={{ lineHeight: "1.1", marginTop: '1px', textAlign: 'center', padding: 0, margin: 0 }}
            >
              {label}
            </span>
          </div>
      </div>
    </button>
  );
}

import React, { useEffect, useRef } from "react";
import { TYPE_COLORS, TYPE_NAMES_ES, TYPE_NAMES_EN } from "../utils/typeColors";
import { useLanguage } from "../contexts/LanguageContext";

export default function PokemonBox({ pokemon, onChangePokemon }) {
  const { balls, useBall } = usePokeballs();
  const [currentHP, setCurrentHP] = React.useState(null);
  const { language } = useLanguage();
  const TYPE_NAMES = language === "es" ? TYPE_NAMES_ES : TYPE_NAMES_EN;
  const handleFlee = async () => {
    const { default: getRandomPokemon } = await import("../utils/pokemons");
    getRandomPokemon().then((poke) => {
      if (typeof onChangePokemon === 'function') onChangePokemon(poke);
    });
  };

  useEffect(() => {
    if (pokemon) {
      const cryUrl = `https://pokeapi.co/media/sounds/cries/${pokemon.id}.mp3`;
      fetch(cryUrl, { method: "HEAD" })
        .then((res) => {
          if (res.ok) {
            console.log(
              `Cry disponible para ${pokemon.name} (id ${pokemon.id}):`,
              cryUrl
            );
          } else {
            console.log(`Sin cry para ${pokemon.name} (id ${pokemon.id})`);
          }
        })
        .catch(() => {
          console.log(
            `Error al verificar cry para ${pokemon.name} (id ${pokemon.id})`
          );
        });
    }
  }, [pokemon]);
  const audioRef = useRef(null);
  useEffect(() => {
    if (pokemon && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [pokemon]);

  if (!pokemon) {
    return (
      <p className="text-white">
        {language === "es" ? "Cargando Pokémon..." : "Loading Pokémon..."}
      </p>
    );
  }

  // Vida: solo el stat de HP
  const hpStat = pokemon.stats
    ? pokemon.stats.find((stat) => stat.stat.name === "hp")?.base_stat || 0
    : 0;
  // Controla si el HP se está reseteando por cambio de Pokémon
  const [resettingHP, setResettingHP] = React.useState(false);
  React.useEffect(() => {
    setResettingHP(true);
    setCurrentHP(hpStat);
    // Espera un frame para quitar el flag y evitar animación
    const timeout = setTimeout(() => setResettingHP(false), 10);
    return () => clearTimeout(timeout);
  }, [hpStat, pokemon]);
  const percent = currentHP !== null ? Math.max(0, Math.round((currentHP / hpStat) * 100)) : 100;

  // Defense factor: suma de defensa y defensa especial
  const defenseFactor = pokemon.stats
    ? (pokemon.stats.find((stat) => stat.stat.name === "defense")?.base_stat ||
        0) +
      (pokemon.stats.find((stat) => stat.stat.name === "special-defense")
        ?.base_stat || 0)
    : 0;

  // Daño según tipo de ball
  const getBallDamage = (ballIndex) => {
    // Puedes ajustar los valores base según el tipo de ball
    const baseDamages = [10, 20, 35, 100]; // normal, super, ultra, master
    const base = baseDamages[ballIndex] || 10;
    // El daño se reduce por el defenseFactor
    const damage = Math.max(1, Math.round(base - defenseFactor * 0.1));
    return damage;
  };

  const handleUseBall = (ballIndex) => {
    if (balls[ballIndex] === 0 || currentHP === 0) return;
    const damage = getBallDamage(ballIndex);
    setCurrentHP((prev) => {
      const newHP = Math.max(0, prev - damage);
      if (newHP === 0) {
        // Esperar a que la animación de la barra termine antes de cambiar el Pokémon
        setTimeout(() => {
          if (typeof onChangePokemon === 'function') {
            const getRandomPokemonAsync = async () => {
              const { default: getRandomPokemon } = await import("../utils/pokemons");
              const poke = await getRandomPokemon();
              onChangePokemon(poke);
            };
            getRandomPokemonAsync();
          }
        }, 600); // Duración de la animación de la barra (coincide con transition)
      }
      return newHP;
    });
    useBall(ballIndex);
  };

  // Tipos del Pokémon
  const types = pokemon.types || [];

  return (
    <div
      className="bg-gradient-to-l from-blue-950 via-red-900 to-black rounded p-3 flex flex-col items-center w-fit min-w-[180px] xl:min-w-[220px] mr-2 xl:mr-5 max-h-fit"
      style={{ opacity: 0.7 }}
    >
      {/* Botón de huir */}
      <div className="w-full flex justify-center mb-2">
          <button
            className="bg-gradient-to-r from-red-700 to-black text-white font-bold px-3 py-2 rounded shadow hover:scale-105 hover:brightness-150 transition-transform text-xs uppercase cursor-pointer mb-2 min-w-[54px] xl:min-w-[60px] max-w-[80px] text-center whitespace-nowrap"
            onClick={handleFlee}
            style={{paddingLeft: '12px', paddingRight: '12px', paddingTop: '8px', paddingBottom: '8px'}}
          >
            {language === "es" ? "Huir" : "Flee"}
          </button>
      </div>
      {/* Botones de pokeballs */}
  <div className="w-full flex flex-row justify-center mb-0 gap-2">
        <PokeballButton
          type="normal"
          color="#E53E3E"
          disabled={balls[0] === 0 || currentHP === 0}
          onClick={() => handleUseBall(0)}
          label={balls[0]}
        />
        <PokeballButton
          type="super"
          color="#3182CE"
          disabled={balls[1] === 0 || currentHP === 0}
          onClick={() => handleUseBall(1)}
          label={balls[1]}
        />
        <PokeballButton
          type="ultra"
          color="#ECC94B"
          disabled={balls[2] === 0 || currentHP === 0}
          onClick={() => handleUseBall(2)}
          label={balls[2]}
        />
        <PokeballButton
          type="master"
          color="#9F7AEA"
          disabled={balls[3] === 0 || currentHP === 0}
          onClick={() => handleUseBall(3)}
          label={balls[3]}
        />
      </div>
      <div
        style={{ opacity: 1, width: "100%" }}
        className="flex flex-col items-center brightness-100"
      >
        <audio
          ref={audioRef}
          src={`https://pokeapi.co/media/sounds/cries/${pokemon.id}.mp3`}
          preload="auto"
        />
        <p className="text-yellow-600 font-bold text-2xl mb-2 drop-shadow cursor-default text-center w-full">
          N° {pokemon.id}
        </p>
        {pokemon.sprites.front_default ? (
          <div className="flex items-center justify-center w-fit h-fit bg-yellow-200 rounded border-4 border-red-900 mb-3 shadow-md">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-36 h-36 xl:w-52 xl:h-52 drop-shadow"
              style={{ imageRendering: "pixelated" }}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.parentNode.innerHTML +=
                  '<span class="text-red-600">Error al cargar sprite</span>';
              }}
            />
          </div>
        ) : (
          <div className="w-40 h-40 xl:w-56 xl:h-56 flex items-center justify-center bg-gray-700 text-white mb-2 rounded border-2 border-gray-300">
            <span>Sin sprite</span>
          </div>
        )}
        {/* Barra de vida */}
        <div className="w-full ">
          <div className="text-md text-green-200 font-bold mb-1 text-center drop-shadow cursor-default">
            HP: {currentHP !== null ? currentHP : hpStat} / {hpStat}
          </div>
          <div className="w-full h-6 bg-gray-700 rounded-xs overflow-hidden border-black border-2">
            <div
              className={`h-full bg-green-300 shadow${resettingHP ? '' : ' transition-all duration-500'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <p className="text-yellow-700 capitalize mt-1 mb-0 font-bold drop-shadow cursor-default text-center w-full">
          {pokemon.name}
        </p>
        {/* Tipos al final */}
        <div className="flex gap-2 mt-3 justify-center w-full flex-nowrap">
          {(pokemon.types || []).map((t) => (
            <span
              key={t.type.name}
              className="px-2 py-1 rounded text-xs font-bold uppercase shadow cursor-default w-[90px] truncate text-center overflow-hidden"
              style={{
                background: TYPE_COLORS[t.type.name] || "#fff",
                color: "#222",
                letterSpacing: "1px",
                filter: "brightness(1.1)",
                display: 'inline-block',
              }}
            >
              {TYPE_NAMES[t.type.name] || t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
