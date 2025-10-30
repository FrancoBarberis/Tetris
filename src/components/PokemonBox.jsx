import React from "react";

export default function PokemonBox({ pokemon }) {
  if (!pokemon) {
    return <p className="text-white">Cargando Pokémon...</p>;
  }
  console.log('Sprite src:', pokemon.sprites.front_default);
  return (
  <div className="bg-gray-900 rounded-lg shadow-lg p-4 flex flex-col items-center w-44 min-h-[200px]">
      <p className="text-yellow-300 font-bold">ID: {pokemon.id}</p>
      <p className="text-white capitalize mb-2">{pokemon.name}</p>
      {pokemon.sprites.front_default ? (
        <div className="flex items-center justify-center w-24 h-24 bg-yellow-200 rounded border-4 border-red-500 mb-2">
          <img
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            className="w-20 h-20"
            style={{ imageRendering: "pixelated" }}
            onError={e => {
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML += '<span class="text-red-600">Error al cargar sprite</span>';
            }}
          />
        </div>
      ) : (
        <div className="w-24 h-24 flex items-center justify-center bg-gray-700 text-white mb-2 rounded border-2 border-gray-300">
          <span>Sin sprite</span>
        </div>
      )}
    </div>
  );
}
