const fs = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/salidas.json');
const TIPOS = ['lancha', 'rapido', 'deslizador'];

const leer = () => JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
const guardar = (datos) =>
  fs.writeFileSync(DATA_FILE, JSON.stringify(datos, null, 2));

function validar(body, esNuevo) {
  const errores = [];

  for (const campo of ['empresa', 'destino', 'puerto', 'fechaHora']) {
    if (!body[campo] || String(body[campo]).trim() === '') {
      errores.push(`${campo} es obligatorio`);
    }
  }

  const precio = Number(body.precio);
  if (body.precio === undefined || body.precio === '' || isNaN(precio) || precio <= 0) {
    errores.push('precio debe ser un número mayor que 0');
  }

  if (!TIPOS.includes(body.tipo)) {
    errores.push(`tipo debe ser uno de: ${TIPOS.join(', ')}`);
  }

  if (body.fechaHora) {
    const fecha = new Date(body.fechaHora);
    if (isNaN(fecha)) {
      errores.push('fechaHora no es una fecha válida');
    } else if (esNuevo && fecha < new Date()) {
      errores.push('fechaHora no puede estar en el pasado');
    }
  }

  return errores;
}

function armarSalida(body, id) {
  return {
    id,
    empresa: String(body.empresa).trim(),
    embarcacion: body.embarcacion ? String(body.embarcacion).trim() : '',
    tipo: body.tipo,
    destino: String(body.destino).trim(),
    puerto: String(body.puerto).trim(),
    fechaHora: body.fechaHora,
    duracionHoras: Number(body.duracionHoras) || 0,
    precio: Number(body.precio),
    cupos: Number(body.cupos) || 0,
  };
}

exports.listar = (req, res) => {
  const { destino, fecha, tipo } = req.query;
  let salidas = leer();

  if (destino) salidas = salidas.filter((s) => s.destino.toLowerCase() === destino.toLowerCase());
  if (tipo) salidas = salidas.filter((s) => s.tipo === tipo);
  if (fecha) salidas = salidas.filter((s) => s.fechaHora.startsWith(fecha)); // fecha = YYYY-MM-DD

  salidas.sort((a, b) => new Date(a.fechaHora) - new Date(b.fechaHora));
  res.json(salidas);
};

exports.detalle = (req, res) => {
  const salida = leer().find((s) => s.id === Number(req.params.id));
  if (!salida) return res.status(404).json({ mensaje: 'Salida no encontrada' });
  res.json(salida);
};

exports.crear = (req, res) => {
  const errores = validar(req.body, true);
  if (errores.length) return res.status(400).json({ mensaje: errores.join('. '), errores });

  const salidas = leer();
  const nuevoId = salidas.length ? Math.max(...salidas.map((s) => s.id)) + 1 : 1;
  const nueva = armarSalida(req.body, nuevoId);

  salidas.push(nueva);
  guardar(salidas);
  res.status(201).json(nueva);
};

exports.actualizar = (req, res) => {
  const salidas = leer();
  const indice = salidas.findIndex((s) => s.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ mensaje: 'Salida no encontrada' });

  const errores = validar(req.body, false);
  if (errores.length) return res.status(400).json({ mensaje: errores.join('. '), errores });

  salidas[indice] = armarSalida(req.body, salidas[indice].id);
  guardar(salidas);
  res.json(salidas[indice]);
};

exports.eliminar = (req, res) => {
  const salidas = leer();
  const indice = salidas.findIndex((s) => s.id === Number(req.params.id));
  if (indice === -1) return res.status(404).json({ mensaje: 'Salida no encontrada' });

  salidas.splice(indice, 1);
  guardar(salidas);
  res.status(204).send();
};

exports.destinos = (req, res) => {
  const destinos = [...new Set(leer().map((s) => s.destino))].sort();
  res.json(destinos);
};