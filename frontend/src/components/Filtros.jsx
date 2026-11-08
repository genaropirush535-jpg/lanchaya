export default function Filtros({ filtros, destinos, onChange, onLimpiar }) {
  const cambiar = (e) => onChange({ ...filtros, [e.target.name]: e.target.value });
  const hayFiltros = filtros.destino || filtros.fecha || filtros.tipo;

  return (
    <section className="filtros">
      <label>
        Destino
        <select name="destino" value={filtros.destino} onChange={cambiar}>
          <option value="">Todos</option>
          {destinos.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      <label>
        Fecha
        <input type="date" name="fecha" value={filtros.fecha} onChange={cambiar} />
      </label>

      <label>
        Tipo
        <select name="tipo" value={filtros.tipo} onChange={cambiar}>
          <option value="">Todos</option>
          <option value="lancha">Lancha</option>
          <option value="rapido">Rápido</option>
          <option value="deslizador">Deslizador</option>
        </select>
      </label>

      <button type="button" className="btn-limpiar" onClick={onLimpiar} disabled={!hayFiltros}>
        Limpiar filtros
      </button>
    </section>
  );
}