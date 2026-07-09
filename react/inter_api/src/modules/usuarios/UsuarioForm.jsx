export default function UsuarioForm({ form, onChange, onSubmit, onCancel, modo, message, onDismissMessage }) {
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
        Correo electrónico
        <input
          type="email"
          value={form.email}
          placeholder="ejemplo@gmail.com"
          onChange={(event) => onChange('email', event.target.value)}
        />
      </label>

      <label>
        Estado
        <select
          value={form.activo ? 'activo' : 'inactivo'}
          onChange={(event) => onChange('activo', event.target.value === 'activo')}
        >
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </label>

      <div className="modal-actions">
        <button type="button" className="btn" onClick={onCancel}>
          Cancelar
        </button>
        <button type="submit" className="btn btn-primary">
          {modo === 'crear' ? 'Guardar usuario' : 'Actualizar usuario'}
        </button>
      </div>

      {message && (
        <div className="floating-message-overlay">
          <div className="floating-message-card">
            <div className="floating-message-header">
              <h3>Validaciones</h3>
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
