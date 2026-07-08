import { useState } from "react";
import api from "../services/api";

const estadoClases = {
  por_asignar: "status-pill status-por-asignar",
  pendiente: "status-pill status-pendiente",
  en_curso: "status-pill status-en-curso",
  terminado: "status-pill status-terminado",
  cancelado: "status-pill status-cancelado",
};

export default function VistaHistorico({ proyectos }) {
  const [proyectoDetalle, setProyectoDetalle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const verProyecto = async (id) => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.get(`/proyectos/${id}/taller`);
      setProyectoDetalle(data);
    } catch (err) {
      console.error("Error al cargar histórico del proyecto:", err);
      setError("No se pudo cargar el proyecto. Intenta de nuevo más tarde.");
    } finally {
      setLoading(false);
    }
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
              className={`btn btn-secondary ${
                proyectoDetalle?.id === proyecto.id ? "active" : ""
              }`}
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
                <strong>Creador:</strong> {proyectoDetalle.creador?.nombre ?? "Sin asignar"}
              </div>
              <div>
                <strong>Ejecutor:</strong> {proyectoDetalle.ejecutor?.nombre ?? "Sin asignar"}
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
                      <td>{tarea.asignado?.nombre ?? "Sin asignar"}</td>
                      <td>
                        <span className={estadoClases[tarea.estado] || "status-pill"}>
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
                      <span className="evento-fecha">
                        {new Date(evento.fecha).toLocaleString()}
                      </span>
                      <span className="evento-texto">
                        {evento.usuarioAccion?.nombre ?? "Usuario"} - {evento.accion}:
                        {evento.valorAnterior ? ` ${evento.valorAnterior}` : ""}
                        {evento.valorNuevo ? ` → ${evento.valorNuevo}` : ""}
                      </span>
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
