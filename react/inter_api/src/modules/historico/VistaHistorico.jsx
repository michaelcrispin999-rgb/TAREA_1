import { useEffect, useState } from 'react';
import api from '../../services/api';

const estadoEtiquetas = {
  por_asignar: 'Por asignar',
  pendiente: 'Pendiente',
  en_curso: 'En curso',
  terminado: 'Terminado',
  cancelado: 'Cancelado',
};

const estadoClases = {
  por_asignar: 'status-pill status-por-asignar',
  pendiente: 'status-pill status-pendiente',
  en_curso: 'status-pill status-en-curso',
  terminado: 'status-pill status-terminado',
  cancelado: 'status-pill status-cancelado',
};

export default function VistaHistorico() {
  const [proyectos, setProyectos] = useState([]);
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarProyectosYUsuarios = async () => {
      try {
        const [proyectosResponse, usuariosResponse] = await Promise.all([
          api.get('/proyectos'),
          api.get('/usuarios'),
        ]);
        setProyectos(proyectosResponse.data);
        setUsuarios(usuariosResponse.data);
      } catch (err) {
        console.error('Error al cargar proyectos o usuarios:', err);
      }
    };

    cargarProyectosYUsuarios();
  }, []);

  const verProyecto = async (id) => {
    setError('');
    setLoading(true);
    try {
      const { data } = await api.get(`/proyectos/${id}/taller`);
      setProyectoDetalle(data);
    } catch (err) {
      console.error('Error al cargar histórico del proyecto:', err);
      setError('No se pudo cargar el proyecto. Intenta de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  const obtenerNombreUsuarioPorId = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 'Sin asignar';
    if (typeof valor === 'number') {
      return usuarios.find((usuario) => usuario.id === valor)?.nombre ?? 'Sin asignar';
    }
    if (!Number.isNaN(Number(valor))) {
      return usuarios.find((usuario) => usuario.id === Number(valor))?.nombre ?? 'Sin asignar';
    }
    return valor;
  };

  const obtenerDescripcionHistorial = (evento) => {
    const actor = evento.usuarioAccion?.nombre ?? 'Usuario';
    const anterior = evento.valorAnterior ?? '';
    const nuevo = evento.valorNuevo ?? '';

    if (evento.accion === 'reasignacion') {
      const anteriorNombre = obtenerNombreUsuarioPorId(anterior);
      const nuevoNombre = obtenerNombreUsuarioPorId(nuevo);
      return `${actor} reasignó la tarea de ${anteriorNombre} a ${nuevoNombre}`;
    }

    if (evento.accion === 'asignacion') {
      const nuevoNombre = obtenerNombreUsuarioPorId(nuevo);
      return `${actor} asignó la tarea a ${nuevoNombre}`;
    }

    if (evento.accion === 'cambio_estado') {
      const anteriorEstado = estadoEtiquetas[anterior] ?? anterior;
      const nuevoEstado = estadoEtiquetas[nuevo] ?? nuevo;
      return `${actor} cambió el estado de ${anteriorEstado} a ${nuevoEstado}`;
    }

    return `${actor} realizó ${evento.accion.replace('_', ' ')}${anterior ? ` de ${anterior}` : ''}${nuevo ? ` a ${nuevo}` : ''}`.trim();
  };

  const formatRelativeTime = (fecha) => {
    const tiempo = new Date(fecha);
    const diff = Date.now() - tiempo.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `hace ${days} día${days === 1 ? '' : 's'}`;
    if (hours > 0) return `hace ${hours} hora${hours === 1 ? '' : 's'}`;
    if (minutes > 0) return `hace ${minutes} minuto${minutes === 1 ? '' : 's'}`;
    return `hace ${seconds} segundo${seconds === 1 ? '' : 's'}`;
  };

  const obtenerIconoHistorial = (accion) => {
    if (accion === 'reasignacion' || accion === 'asignacion') return '🔄';
    if (accion === 'cambio_estado') return '⚠️';
    return 'ℹ️';
  };

  return (
    <>
      <div className="content-header">
        <h1>Histórico</h1>
      </div>

      <div className="historico-proyectos">
        <span>Proyectos:</span>
        {proyectos.length === 0 ? (
          <span className="notice">No hay proyectos disponibles.</span>
        ) : (
          proyectos.map((proyecto) => (
            <button
              key={proyecto.id}
              className={`btn btn-secondary ${proyectoDetalle?.id === proyecto.id ? 'active' : ''}`}
              onClick={() => verProyecto(proyecto.id)}
            >
              {proyecto.nombre}
            </button>
          ))
        )}
      </div>

      {loading && <div className="historico-loading">Cargando historial...</div>}
      {error && <div className="historico-error">{error}</div>}

      {!loading && !proyectoDetalle && proyectos.length > 0 && (
        <div className="historico-empty">
          Selecciona un proyecto para ver su historial y las tareas.
        </div>
      )}

      {proyectoDetalle && (
        <div className="historico-card">
          <div className="historico-card-header">
            <div>
              <h2>{proyectoDetalle.nombre}</h2>
              <p>{proyectoDetalle.descripcion}</p>
            </div>
            <div className="historico-meta">
              <div>
                <strong>Creador:</strong> {proyectoDetalle.creador?.nombre ?? 'Sin asignar'}
              </div>
              <div>
                <strong>Ejecutor:</strong> {proyectoDetalle.ejecutor?.nombre ?? 'Sin asignar'}
              </div>
            </div>
          </div>

          <div className="historico-section">
            <h3>Tareas</h3>
            {proyectoDetalle.tareas?.length > 0 ? (
              <table>
                <thead>
                  <tr>
                    <th>Tarea</th>
                    <th>Asignado a</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {proyectoDetalle.tareas.map((tarea) => (
                    <tr key={tarea.id}>
                      <td>{tarea.descripcion}</td>
                      <td>{tarea.asignado?.nombre ?? 'Sin asignar'}</td>
                      <td>
                        <span className={estadoClases[tarea.estado] || 'status-pill'}>
                          {tarea.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No hay tareas registradas para este proyecto.</p>
            )}
          </div>

          <div className="historico-section">
            <h3>Historial de cambios</h3>
            {proyectoDetalle.tareas?.some((t) => t.historicos?.length > 0) ? (
              proyectoDetalle.tareas.map((tarea) => (
                <div key={tarea.id} className="historico-tarea-block">
                  <h4>{tarea.descripcion}</h4>
                  {tarea.historicos.map((evento) => (
                    <div key={evento.id} className="historico-evento">
                      <span className="historico-evento-icon">
                        {obtenerIconoHistorial(evento.accion)}
                      </span>
                      <div className="historico-evento-contenido">
                        <span className="evento-texto">
                          {obtenerDescripcionHistorial(evento)}
                        </span>
                        <span className="evento-fecha">
                          {formatRelativeTime(evento.fecha)} · {new Date(evento.fecha).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ))
            ) : (
              <p>No hay entradas de histórico para este proyecto.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
