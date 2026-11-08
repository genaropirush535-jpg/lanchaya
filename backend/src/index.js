const express = require('express');
const cors = require('cors');
const salidasRouter = require('./routes/salidas');
const { destinos } = require('./controllers/salidas.controller');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.use('/api/salidas', salidasRouter);
app.get('/api/destinos', destinos);

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Middleware de manejo de errores (siempre al final, con 4 parámetros)
app.use((err, req, res, next) => {
  console.error(err);
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ mensaje: 'El JSON enviado no es válido' });
  }
  res.status(500).json({ mensaje: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`LanchaYa API en http://localhost:${PORT}`);
});