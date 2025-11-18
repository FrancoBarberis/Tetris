import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Ruta para obtener info de un Pokémon
app.get('/api/pokemon', async (req, res) => {
  const { nameOrId } = req.query;
  if (!nameOrId) return res.status(400).json({ error: 'Falta el nombre o ID del Pokémon' });
  try {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${nameOrId}`);
    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo obtener la información del Pokémon' });
  }
});
// Proxy activado
app.get('/api/cry', async (req, res) => {
  const { url } = req.query;
  if (!url) return res.status(400).json({ error: 'Falta la URL' });
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    res.set('Content-Type', response.headers['content-type'] || 'audio/wav');
    res.send(response.data);
  } catch (err) {
    res.status(500).json({ error: 'No se pudo obtener el cry' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy backend escuchando en http://localhost:${PORT}`);
});
