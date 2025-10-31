import React, { useEffect, useRef } from "react";

export default function PokemonBox({ pokemon }) {
  const audioRef = useRef(null);
  useEffect(() => {
    if (pokemon && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [pokemon]);

  if (!pokemon) {
    return <p className="text-white">Cargando Pokémon...</p>;
  }
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-6 flex flex-col items-center w-64 min-h-[270px]">
      <audio
        ref={audioRef}
        src={`https://pokeapi.co/media/sounds/cries/${pokemon.id}.mp3`}
        preload="auto"
      />
      <p className="text-yellow-300 font-bold mb-2">N° {pokemon.id}</p>
      {pokemon.sprites.front_default ? (
        <div className="flex items-center justify-center w-40 h-40 bg-yellow-200 rounded border-4 border-red-500 mb-3">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-36 h-36"
            style={{ imageRendering: "pixelated" }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML += '<span class=\"text-red-600\">Error al cargar sprite</span>';
            }}
          />
        </div>
      ) : (
        <div className="w-40 h-40 flex items-center justify-center bg-gray-700 text-white mb-2 rounded border-2 border-gray-300">
          <span>Sin sprite</span>
        </div>
      )}
      <p className="text-white capitalize mt-1 mb-0">{pokemon.name}</p>
    </div>
  );
}
