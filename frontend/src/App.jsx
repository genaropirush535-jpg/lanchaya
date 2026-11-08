import { useEffect, useState } from 'react';
import { actualizarSalida, crearSalida, eliminarSalida, getSalidas, getDestinos } from './services/api';
import SalidaCard from './components/SalidaCard';
import Filtros from './components/Filtros';
import SalidaForm from './components/SalidaForm';
import './App.css';

const FILTROS_VACIOS = { destino: '', fecha: '', tipo: '' };

export default function App() {
  const [salidas, setSalidas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [salidaEnEdicion, setSalidaEnEdicion] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [revision, setRevision] = useState(0);
  const [notificacion, setNotificacion] = useState('');

  useEffect(() => {
    getDestinos()
      .then(setDestinos)
      .catch(() => setError('No se pudieron cargar los destinos. Revisa que el backend esté encendido.'));
  }, []);

  useEffect(() => {
    getSalidas(filtros)
      .then(setSalidas)
      .catch(() => setError('No se pudo conectar con el servidor. Revisa que el backend esté encendido.'))
      .finally(() => setCargando(false));
  }, [filtros, revision]);

  const cambiarFiltros = (nuevosFiltros) => {
    setCargando(true);
    setError('');
    setFiltros(nuevosFiltros);
  };

  const abrirFormulario = (salida = null) => {
    setSalidaEnEdicion(salida);
    setMostrarFormulario(true);
    setNotificacion('');
  };

  const guardarSalida = async (datos) => {
    if (salidaEnEdicion) {
      await actualizarSalida(salidaEnEdicion.id, datos);
      setNotificacion('La salida se actualizó correctamente.');
    } else {
      await crearSalida(datos);
      setNotificacion('La salida se creó correctamente.');
    }

    setCargando(true);
    setError('');
    setMostrarFormulario(false);
    setSalidaEnEdicion(null);
    setRevision((actual) => actual + 1);
  };

  const borrarSalida = async (salida) => {
    if (!window.confirm(`¿Eliminar la salida a ${salida.destino} de ${salida.empresa}?`)) return;

    setError('');
    setNotificacion('');
    try {
      await eliminarSalida(salida.id);
      setNotificacion('La salida se eliminó correctamente.');
      setCargando(true);
      setRevision((actual) => actual + 1);
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message || 'No se pudo eliminar la salida.');
    }
  };

  return (
    <main className="app">
      <header className="encabezado">
        <div>
          <h1>🚤 LanchaYa Iquitos</h1>
          <p>Salidas de lanchas y rápidos desde Iquitos</p>
        </div>
        <button className="btn-primario" type="button" onClick={() => abrirFormulario()}>
          + Nueva salida
        </button>
      </header>

      {mostrarFormulario && (
        <SalidaForm
          key={salidaEnEdicion?.id ?? 'nueva'}
          salida={salidaEnEdicion}
          onGuardar={guardarSalida}
          onCancelar={() => {
            setMostrarFormulario(false);
            setSalidaEnEdicion(null);
          }}
        />
      )}

      <Filtros
        filtros={filtros}
        destinos={destinos}
        onChange={cambiarFiltros}
        onLimpiar={() => cambiarFiltros(FILTROS_VACIOS)}
      />

      {notificacion && <p className="mensaje exito" role="status">{notificacion}</p>}
      {cargando && <p className="mensaje">Cargando salidas...</p>}
      {error && <p className="mensaje error">{error}</p>}
      {!cargando && !error && salidas.length === 0 && (
        <p className="mensaje">No hay salidas con esos filtros.</p>
      )}

      <section className="lista">
        {!error && salidas.map((s) => (
          <SalidaCard
            key={s.id}
            salida={s}
            onEditar={abrirFormulario}
            onEliminar={borrarSalida}
          />
        ))}
      </section>
    </main>
  );
}