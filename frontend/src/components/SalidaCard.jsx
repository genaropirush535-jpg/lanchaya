const TIPOS = { lancha: 'Lancha', rapido: 'Rápido', deslizador: 'Deslizador' };

function formatear(fechaHora) {
  const f = new Date(fechaHora);
  return {
    fecha: f.toLocaleDateString('es-PE', { weekday: 'short', day: 'numeric', month: 'short' }),
    hora: f.toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function SalidaCard({ salida }) {
  const { fecha, hora } = formatear(salida.fechaHora);

  return (
    <article className="card">
      <div className="card-top">
        <h3>{salida.destino}</h3>
        <span className={`tipo tipo-${salida.tipo}`}>{TIPOS[salida.tipo]}</span>
      </div>
      <p className="empresa">
        {salida.empresa}
        {salida.embarcacion && ` · ${salida.embarcacion}`}
      </p>
      <p>📍 {salida.puerto}</p>
      <p>🕐 {fecha}, {hora} · {salida.duracionHoras} h de viaje</p>
      <p className="precio">S/ {salida.precio}</p>
    </article>
  );
}