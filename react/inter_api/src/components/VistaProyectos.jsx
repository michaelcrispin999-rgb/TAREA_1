export default function VistaProyectos({ proyectos, agregarProyecto, editarProyecto, eliminarProyecto }) {
  return (
    <>
      <div className="content-header">
        <h1>Proyectos</h1>

        <button className="btn btn-primary" onClick={agregarProyecto}>
          + Agregar
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {proyectos.map((proyecto) => (
            <tr key={proyecto.id}>
              <td>{proyecto.id}</td>
              <td>{proyecto.nombre}</td>
              <td>{proyecto.descripcion}</td>
              <td>{new Date(proyecto.fechaCreacion).toLocaleDateString()}</td>

              <td className="actions">
                <button className="btn btn-icon" onClick={() => editarProyecto(proyecto)}>
                  Editar
                </button>

                <button className="btn btn-icon" onClick={() => eliminarProyecto(proyecto.id)}>
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