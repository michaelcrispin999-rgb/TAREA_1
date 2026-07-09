export default function TareaForm({
  form,
  proyectos,
  usuarios,
  modo,
  onChange,
  onSubmit,
  onCancel,
  message,
  onDismissMessage,
}) {
  return (
    <form onSubmit={onSubmit} className="form-card">
      <label>
        Proyecto Asociado
        <select
          value={form.idProyecto}
          onChange={(event) => onChange('idProyecto', event.target.value)}
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
        Descripción de la Tarea
        <textarea
          value={form.descripcion}
          onChange={(event) => onChange('descripcion', event.target.value)}
          placeholder="Escribe aquí lo que se debe hacer en la tarea..."
        />
      </label>

      <label>
        Asignar a Usuario
        <select
          value={form.idUsuarioAsignado}
          onChange={(event) => onChange('idUsuarioAsignado', event.target.value)}
        >
          <option value="">Dejar sin asignar</option>
          {usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nombre}
            </option>
          ))}
        </select>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {modo === 'crear' ? 'Guardar Tarea' : 'Actualizar Tarea'}
        </button>
      </div>

      {message && (
        <div className="floating-message-overlay">
          <div className="floating-message-card">
            <div className="floating-message-header">
              <h3>Validación</h3>
              <button type="button" className="btn btn-icon" onClick={onDismissMessage}>
                X
              </button>
            </div>
            <div className="floating-message-content">
              <p>{message}</p>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-primary" onClick={onDismissMessage}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
