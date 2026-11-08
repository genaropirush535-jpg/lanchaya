import { useEffect, useState } from 'react';
import { getSalidas, getDestinos } from './services/api';
import SalidaCard from './components/SalidaCard';
import Filtros from './components/Filtros';
import './App.css';

const FILTROS_VACIOS = { destino: '', fecha: '', tipo: '' };

export default function App() {
  const [salidas, setSalidas] = useState([]);
  const [destinos, setDestinos] = useState([]);
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  // Destinos: se cargan una sola vez
  useEffect(() => {
    getDestinos().then(setDestinos).catch(() => {});
  }, []);

  // Salidas: se recargan cuando cambian los filtros
  useEffect(() => {
    setCargando(true);
    setError('');
    getSalidas(filtros)
      .then(setSalidas)
      .catch(() => setError('No se pudo conectar con el servidor. Revisa que el backend esté encendido.'))
      .finally(() => setCargando(false));
  }, [filtros]);

  return (
    <main className="app">
      <header>
        <h1>🚤 LanchaYa Iquitos</h1>
        <p>Salidas de lanchas y rápidos desde Iquitos</p>
      </header>

      <Filtros
        filtros={filtros}
        destinos={destinos}
        onChange={setFiltros}
        onLimpiar={() => setFiltros(FILTROS_VACIOS)}
      />

      {cargando && <p className="mensaje">Cargando salidas...</p>}
      {error && <p className="mensaje error">{error}</p>}
      {!cargando && !error && salidas.length === 0 && (
        <p className="mensaje">No hay salidas con esos filtros.</p>
      )}

      <section className="lista">
        {!error && salidas.map((s) => (
          <SalidaCard key={s.id} salida={s} />
        ))}
      </section>
    </main>
  );
}