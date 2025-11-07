import express from 'express';
import axios from 'axios';

const app = express();
const PORT = 3001;

// Proxy desactivado temporalmente
// app.get('/api/cry', async (req, res) => {
//   const { url } = req.query;
//   if (!url) return res.status(400).json({ error: 'Falta la URL' });
//   try {
//     const response = await axios.get(url, { responseType: 'arraybuffer' });
//     res.set('Content-Type', response.headers['content-type'] || 'audio/wav');
//     res.send(response.data);
//   } catch (err) {
//     res.status(500).json({ error: 'No se pudo obtener el cry' });
//   }
// });

app.listen(PORT, () => {
  console.log(`Proxy backend escuchando en http://localhost:${PORT}`);
});
