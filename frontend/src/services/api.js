import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:3000/api' });

export const getSalidas = (filtros = {}) => {
  const params = {};
  if (filtros.destino) params.destino = filtros.destino;
  if (filtros.fecha) params.fecha = filtros.fecha;
  if (filtros.tipo) params.tipo = filtros.tipo;
  return api.get('/salidas', { params }).then((r) => r.data);
};

export const getDestinos = () => api.get('/destinos').then((r) => r.data);
export const crearSalida = (datos) => api.post('/salidas', datos).then((r) => r.data);
export const actualizarSalida = (id, datos) => api.put(`/salidas/${id}`, datos).then((r) => r.data);
export const eliminarSalida = (id) => api.delete(`/salidas/${id}`);