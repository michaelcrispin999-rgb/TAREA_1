import { useState } from "react";

const estados = [
  "por_asignar",
  "pendiente",
  "en_curso",
  "terminado",
  "cancelado",
];

export default function VistaTareas({
  tareas,
  proyectos,
  usuarios,
  agregarTarea,
  editarTarea,
  eliminarTarea,
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modo, setModo] = useState("crear");
  const [form, setForm] = useState({
    descripcion: "",
    idProyecto: "",
    idUsuarioAsigna: "",
    idUsuarioAsignado: "",
    estado: "por_asignar",
  });
  const [editarId, setEditarId] = useState(null);

  const abrirModalCrear = () => {
    setForm({
      descripcion: "",
      idProyecto: proyectos[0]?.id?.toString() ?? "",
      idUsuarioAsigna: "",
      idUsuarioAsignado: "",
      estado: "por_asignar",
    });
    setModo("crear");
    setEditarId(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (tarea) => {
    setForm({
      descripcion: tarea.descripcion,
      idProyecto: tarea.idProyecto?.toString() ?? tarea.proyecto?.id?.toString() ?? "",
      idUsuarioAsigna: tarea.idUsuarioAsigna?.toString() ?? "",
      idUsuarioAsignado: tarea.idUsuarioAsignado?.toString() ?? "",
      estado: tarea.estado,
    });
    setModo("editar");
    setEditarId(tarea.id);
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const obtenerNombreUsuario = (id, relacion) => {
    if (relacion?.nombre) return relacion.nombre;
    if (id === null || id === undefined || id === "") return "Sin asignar";
    return usuarios.find((usuario) => usuario.id === Number(id))?.nombre ?? "Sin asignar";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.descripcion.trim()) {
      alert("Ingrese la descripción de la tarea.");
      return;
    }
    if (!form.idProyecto) {
      alert("Seleccione el proyecto.");
      return;
    }

    if (modo === "crear") {
      await agregarTarea(form);
    } else if (modo === "editar") {
      await editarTarea(editarId, form);
    }

    cerrarModal();
  };

  return (
    <>
      <div className="content-header">
        <h1>Tareas</h1>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          + Crear Tarea
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Descripción</th>
            <th>Proyecto</th>
            <th>Asigna</th>
            <th>Asignado</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {tareas.map((tarea) => (
            <tr key={tarea.id}>
              <td>{tarea.id}</td>
              <td>{tarea.descripcion}</td>
              <td>{tarea.proyecto?.nombre ?? "-"}</td>
              <td>{obtenerNombreUsuario(tarea.idUsuarioAsigna, tarea.asigna)}</td>
              <td>{obtenerNombreUsuario(tarea.idUsuarioAsignado, tarea.asignado)}</td>
              <td>{tarea.estado}</td>
              <td className="actions">
                <button className="btn btn-icon" onClick={() => abrirModalEditar(tarea)}>
                  Editar
                </button>
                <button className="btn btn-icon" onClick={() => eliminarTarea(tarea.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modo === "crear" ? "Crear Nueva Tarea" : "Editar Tarea"}</h2>
              <button className="btn btn-icon" onClick={cerrarModal}>
                X
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <label>
                Proyecto Asociado (idProyecto)
                <select
                  value={form.idProyecto}
                  onChange={(e) => setForm({ ...form, idProyecto: e.target.value })}
                >
                  <option value="">Selecciona un proyecto...</option>
                  {proyectos.map((proyecto) => (
                    <option key={proyecto.id} value={proyecto.id}>
                      {proyecto.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Descripción de la Tarea (descripcion)
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  placeholder="Escribe aquí lo que se debe hacer en la tarea..."
                />
              </label>

              <label>
                Usuario que Asigna la Tarea (idUsuarioAsigna - Opcional)
                <select
                  value={form.idUsuarioAsigna}
                  onChange={(e) => setForm({ ...form, idUsuarioAsigna: e.target.value })}
                >
                  <option value="">Dejar sin asignar (vacío)</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Asignar a Usuario (idUsuarioAsignado - Opcional)
                <select
                  value={form.idUsuarioAsignado}
                  onChange={(e) => setForm({ ...form, idUsuarioAsignado: e.target.value })}
                >
                  <option value="">Dejar sin asignar (vacío)</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Estado Inicial (estado)
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value })}
                >
                  {estados.map((estado) => (
                    <option key={estado} value={estado}>
                      {estado}
                    </option>
                  ))}
                </select>
              </label>

              <div className="modal-actions">
                <button type="button" className="btn" onClick={cerrarModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
