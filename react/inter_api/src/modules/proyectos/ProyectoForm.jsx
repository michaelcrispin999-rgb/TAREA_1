export default function ProyectoForm({ form, onChange, onSubmit, onCancel, modo, message, onDismissMessage }) {
  return (
    <form onSubmit={onSubmit} className="form-card">
      <label>
        Nombre
        <input
          type="text"
          value={form.nombre}
          placeholder="Nombre"
          onChange={(event) => onChange('nombre', event.target.value)}
        />
      </label>

      <label>
        Descripción
        <input
          type="text"
          value={form.descripcion}
          placeholder="Descripción"
          onChange={(event) => onChange('descripcion', event.target.value)}
        />
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {modo === 'crear' ? 'Guardar proyecto' : 'Actualizar proyecto'}
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
