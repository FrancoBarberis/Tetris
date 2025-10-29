
const getRandomPokemon = async () => {
  const maxPokemon = 151;
  const randomId = Math.floor(Math.random() * maxPokemon) + 1;
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
  const data = await response.json();
  console.log(`Nombre: ${data.name}`);
  console.log(`ID: ${data.id}`);
  console.log(`Sprite: ${data.sprites.front_default}`);
  return data;
};

export default getRandomPokemon;