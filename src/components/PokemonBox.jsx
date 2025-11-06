import pokeballIcon from "../assets/pokeball.png";
import { usePokeballs } from "../contexts/PokeballContext";

function PokeballButton({ type, label, color, disabled, onClick }) {
  return (
    <button
      className={`flex flex-col items-center px-1 py-1 rounded focus:outline-none transition-transform ${disabled ? 'opacity-50 cursor-not-allowed grayscale' : 'hover:scale-105'} `}
      style={{ width: '44px' }}
      disabled={disabled}
      onClick={disabled ? undefined : onClick}
    >
      <span className={`flex items-center justify-center w-7 h-7 rounded-full shadow`} style={{ background: disabled ? '#888' : color }}>
        <img src={pokeballIcon} alt={label} className="w-5 h-5" />
      </span>
      <span className="text-[0.60rem] font-bold text-white mt-1 drop-shadow text-center" style={{ lineHeight: '1.1' }}>{label}</span>
    </button>
  );
}

import React, { useEffect, useRef } from "react";
import { TYPE_COLORS, TYPE_NAMES_ES, TYPE_NAMES_EN } from "../utils/typeColors";
import { useLanguage } from "../contexts/LanguageContext";

export default function PokemonBox({ pokemon }) {
  const { balls, useBall } = usePokeballs();
  const { language } = useLanguage();
  const TYPE_NAMES = language === 'es' ? TYPE_NAMES_ES : TYPE_NAMES_EN;
  
  useEffect(() => {
    if (pokemon) {
      const cryUrl = `https://pokeapi.co/media/sounds/cries/${pokemon.id}.mp3`;
      fetch(cryUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) {
            console.log(`Cry disponible para ${pokemon.name} (id ${pokemon.id}):`, cryUrl);
          } else {
            console.log(`Sin cry para ${pokemon.name} (id ${pokemon.id})`);
          }
        })
        .catch(() => {
          console.log(`Error al verificar cry para ${pokemon.name} (id ${pokemon.id})`);
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
    return <p className="text-white">{language === 'es' ? 'Cargando Pokémon...' : 'Loading Pokémon...'}</p>;
  }

  // Vida: solo el stat de HP
  const hpStat = pokemon.stats ? (pokemon.stats.find(stat => stat.stat.name === "hp")?.base_stat || 0) : 0;
  const percent = 100;

  // Defense factor: suma de defensa y defensa especial
  const defenseFactor = pokemon.stats
    ? (pokemon.stats.find(stat => stat.stat.name === "defense")?.base_stat || 0)
      + (pokemon.stats.find(stat => stat.stat.name === "special-defense")?.base_stat || 0)
    : 0;

  // Tipos del Pokémon
  const types = pokemon.types || [];

  return (
    <div className="bg-gradient-to-l from-blue-950 via-red-900 to-black rounded p-6 flex flex-col items-center w-fit mr-8 xl:mr-16" style={{ opacity: 0.7 }}>
      {/* Botón de huir */}
         <div className="w-full flex justify-center mb-2">
           <button className="bg-gradient-to-r from-red-700 to-black text-white font-bold px-4 py-1 rounded shadow hover:scale-105 transition-transform text-xs uppercase">{language === 'es' ? 'Huir' : 'Flee'}</button>
         </div>
      {/* Botones de pokeballs */}
      <div className="w-full flex flex-row justify-center gap-2 mb-3">
        <PokeballButton type="normal" label={language === 'es' ? 'Pokeball' : 'Pokeball'} color="#E53E3E" disabled={balls[0] === 0} onClick={() => useBall(0)} />
        <PokeballButton type="super" label={language === 'es' ? 'Superball' : 'Great Ball'} color="#3182CE" disabled={balls[1] === 0} onClick={() => useBall(1)} />
        <PokeballButton type="ultra" label={language === 'es' ? 'Ultraball' : 'Ultra Ball'} color="#ECC94B" disabled={balls[2] === 0} onClick={() => useBall(2)} />
        <PokeballButton type="master" label={language === 'es' ? 'Masterball' : 'Master Ball'} color="#9F7AEA" disabled={balls[3] === 0} onClick={() => useBall(3)} />
      </div>
      <div style={{ opacity: 1, width: '100%' }} className="flex flex-col items-center brightness-100">
        <audio
          ref={audioRef}
          src={`https://pokeapi.co/media/sounds/cries/${pokemon.id}.mp3`}
          preload="auto"
        />
  <p className="text-yellow-600 font-bold text-2xl mb-2 drop-shadow cursor-default">N° {pokemon.id}</p>
        {pokemon.sprites.front_default ? (
          <div className="flex items-center justify-center w-40 h-40 xl:w-56 xl:h-56 bg-yellow-200 rounded border-4 border-yellow-400 mb-3 shadow-md">
            <img
              src={pokemon.sprites.front_default}
              alt={pokemon.name}
              className="w-36 h-36 xl:w-52 xl:h-52 drop-shadow"
              style={{ imageRendering: "pixelated" }}
              onError={e => {
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML += '<span class=\"text-red-600\">Error al cargar sprite</span>';
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
          <div className="text-md text-green-200 font-bold mb-1 text-center drop-shadow cursor-default">HP: {hpStat}</div>
          <div className="w-full h-6 bg-gray-700 rounded-xs overflow-hidden border-black border-2">
            <div
              className="h-full bg-green-300 transition-all duration-500 shadow"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
  <p className="text-yellow-700 capitalize mt-1 mb-0 font-bold drop-shadow cursor-default">{pokemon.name}</p>
        {/* Tipos al final */}
        <div className="flex gap-2 mt-3">
          {types.map(t => (
            <span
              key={t.type.name}
              className="px-3 py-1 rounded text-xs font-bold uppercase shadow cursor-default"
              style={{ background: TYPE_COLORS[t.type.name] || '#fff', color: '#222', letterSpacing: '1px', filter: 'brightness(1.1)' }}
            >
              {TYPE_NAMES[t.type.name] || t.type.name}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
