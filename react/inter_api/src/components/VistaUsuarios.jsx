export default function VistaUsuarios({ usuarios, abrirModalCrearUsuario, abrirModalEditarUsuario, eliminarUsuario }) {
  return (
    <>
      <div className="content-header">
        <h1>Usuarios</h1>

        <button className="btn btn-primary" onClick={abrirModalCrearUsuario}>
          + Agregar
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Activo</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id}>
              <td>{usuario.id}</td>
              <td>{usuario.nombre}</td>
              <td>{usuario.email}</td>
              <td>{usuario.activo ? "Sí" : "No"}</td>
              <td>{new Date(usuario.fechaCreacion).toLocaleDateString()}</td>

              <td className="actions">
                <button className="btn btn-icon" onClick={() => abrirModalEditarUsuario(usuario)}>
                  Editar
                </button>

                <button className="btn btn-icon" onClick={() => eliminarUsuario(usuario.id)}>
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
