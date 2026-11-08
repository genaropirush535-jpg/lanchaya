import { useState } from 'react';

const CAMPOS_VACIOS = {
  empresa: '',
  embarcacion: '',
  tipo: 'lancha',
  destino: '',
  puerto: '',
  fechaHora: '',
  duracionHoras: '',
  precio: '',
  cupos: '',
};

function convertirFormulario(salida) {
  if (!salida) return CAMPOS_VACIOS;

  return {
    ...CAMPOS_VACIOS,
    ...salida,
    fechaHora: salida.fechaHora?.slice(0, 16) ?? '',
  };
}

export default function SalidaForm({ salida, onGuardar, onCancelar }) {
  const [datos, setDatos] = useState(() => convertirFormulario(salida));
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [erroresCampos, setErroresCampos] = useState({});

  const cambiar = (evento) => {
    setDatos((actuales) => ({ ...actuales, [evento.target.name]: evento.target.value }));
    setErroresCampos((actuales) => ({ ...actuales, [evento.target.name]: '' }));
    setError('');
  };

  const enviar = async (evento) => {
    evento.preventDefault();
    const errores = {};
    for (const campo of ['empresa', 'destino', 'puerto', 'fechaHora']) {
      if (!datos[campo].trim()) errores[campo] = 'Este campo es obligatorio.';
    }
    if (!datos.precio || Number(datos.precio) <= 0) {
      errores.precio = 'El precio debe ser mayor que 0.';
    }
    if (datos.fechaHora) {
      const fecha = new Date(datos.fechaHora);
      if (Number.isNaN(fecha.getTime())) {
        errores.fechaHora = 'Ingresa una fecha y hora válidas.';
      } else if (!salida && fecha < new Date()) {
        errores.fechaHora = 'No puede estar en el pasado.';
      }
    }
    setErroresCampos(errores);
    if (Object.keys(errores).length) return;

    setGuardando(true);
    setError('');

    try {
      await onGuardar({
        ...datos,
        duracionHoras: Number(datos.duracionHoras) || 0,
        precio: Number(datos.precio),
        cupos: Number(datos.cupos) || 0,
      });
    } catch (err) {
      setError(err.response?.data?.mensaje || err.message || 'No se pudo guardar la salida.');
    } finally {
      setGuardando(false);
    }
  };

  return (
    <form className="salida-form" onSubmit={enviar} noValidate>
      <h2>{salida ? 'Editar salida' : 'Nueva salida'}</h2>

      <div className="campos-form">
        <label>
          Empresa
          <input name="empresa" value={datos.empresa} onChange={cambiar} aria-invalid={Boolean(erroresCampos.empresa)} aria-describedby={erroresCampos.empresa ? 'error-empresa' : undefined} />
          {erroresCampos.empresa && <span className="error-campo" id="error-empresa">{erroresCampos.empresa}</span>}
        </label>
        <label>
          Embarcación
          <input name="embarcacion" value={datos.embarcacion} onChange={cambiar} />
        </label>
        <label>
          Tipo
          <select name="tipo" value={datos.tipo} onChange={cambiar} required>
            <option value="lancha">Lancha</option>
            <option value="rapido">Rápido</option>
            <option value="deslizador">Deslizador</option>
          </select>
        </label>
        <label>
          Destino
          <input name="destino" value={datos.destino} onChange={cambiar} aria-invalid={Boolean(erroresCampos.destino)} aria-describedby={erroresCampos.destino ? 'error-destino' : undefined} />
          {erroresCampos.destino && <span className="error-campo" id="error-destino">{erroresCampos.destino}</span>}
        </label>
        <label>
          Puerto
          <input name="puerto" value={datos.puerto} onChange={cambiar} aria-invalid={Boolean(erroresCampos.puerto)} aria-describedby={erroresCampos.puerto ? 'error-puerto' : undefined} />
          {erroresCampos.puerto && <span className="error-campo" id="error-puerto">{erroresCampos.puerto}</span>}
        </label>
        <label>
          Fecha y hora
          <input
            type="datetime-local"
            name="fechaHora"
            value={datos.fechaHora}
            onChange={cambiar}
            aria-invalid={Boolean(erroresCampos.fechaHora)}
            aria-describedby={erroresCampos.fechaHora ? 'error-fechaHora' : undefined}
          />
          {erroresCampos.fechaHora && <span className="error-campo" id="error-fechaHora">{erroresCampos.fechaHora}</span>}
        </label>
        <label>
          Duración (horas)
          <input
            type="number"
            name="duracionHoras"
            min="0"
            step="0.5"
            value={datos.duracionHoras}
            onChange={cambiar}
          />
        </label>
        <label>
          Precio (S/)
          <input
            type="number"
            name="precio"
            min="0.01"
            step="0.01"
            value={datos.precio}
            onChange={cambiar}
            aria-invalid={Boolean(erroresCampos.precio)}
            aria-describedby={erroresCampos.precio ? 'error-precio' : undefined}
          />
          {erroresCampos.precio && <span className="error-campo" id="error-precio">{erroresCampos.precio}</span>}
        </label>
        <label>
          Cupos
          <input
            type="number"
            name="cupos"
            min="0"
            step="1"
            value={datos.cupos}
            onChange={cambiar}
          />
        </label>
      </div>

      {error && <p className="mensaje error" role="alert">{error}</p>}

      <div className="acciones-form">
        <button className="btn-primario" type="submit" disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar'}
        </button>
        <button className="btn-secundario" type="button" onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
