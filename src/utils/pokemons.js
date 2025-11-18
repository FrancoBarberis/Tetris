
const getRandomPokemon = async () => {
  const maxPokemon = 151;
  const randomId = Math.floor(Math.random() * maxPokemon) + 1;
  const response = await fetch(`http://localhost:3000/api/pokemon?nameOrId=${randomId}`);
  const data = await response.json();
  console.log(`Nombre: ${data.name}`);
  console.log(`ID: ${data.id}`);
  console.log(`Sprite: ${data.sprites.front_default}`);
  return data;
};

export default getRandomPokemon;