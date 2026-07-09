import { useEffect, useState } from 'react';
import ProyectoForm from './ProyectoForm';
import {
  createProyecto,
  deleteProyecto,
  fetchProyectos,
  updateProyecto,
} from './proyectoService';

const initialForm = {
  nombre: '',
  descripcion: '',
};

export default function VistaProyectos() {
  const [proyectos, setProyectos] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modo, setModo] = useState('crear');
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const cargarProyectos = async () => {
    setErrorMessage('');
    try {
      const data = await fetchProyectos();
      setProyectos(data);
    } catch (error) {
      console.error('Error al cargar proyectos:', error);
    }
  };

  useEffect(() => {
    cargarProyectos();
  }, []);

  const abrirModalCrear = () => {
    setForm(initialForm);
    setModo('crear');
    setEditId(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (proyecto) => {
    setForm({
      nombre: proyecto.nombre || '',
      descripcion: proyecto.descripcion || '',
    });
    setModo('editar');
    setEditId(proyecto.id);
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!form.nombre.trim()) {
      setErrorMessage('Ingrese el nombre del proyecto.');
      return;
    }

    if (!form.descripcion.trim()) {
      setErrorMessage('Ingrese la descripción del proyecto.');
      return;
    }

    try {
      if (modo === 'crear') {
        await createProyecto(form);
      } else {
        await updateProyecto(editId, form);
      }

      await cargarProyectos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar proyecto:', error);
      setErrorMessage('Error al guardar proyecto.');
    }
  };

  const eliminarProyecto = async (proyecto) => {
    setErrorMessage('');
    setDeleteCandidate({ id: proyecto.id, nombre: proyecto.nombre });
  };

  const confirmarEliminarProyecto = async () => {
    if (!deleteCandidate) return;

    try {
      await deleteProyecto(deleteCandidate.id);
      setDeleteCandidate(null);
      await cargarProyectos();
    } catch (error) {
      console.error('Error al eliminar proyecto:', error);
      setErrorMessage('Error al eliminar proyecto.');
    }
  };

  const cancelarEliminarProyecto = () => {
    setDeleteCandidate(null);
    setErrorMessage('');
  };

  return (
    <>
      <div className="content-header">
        <h1>Proyectos</h1>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          + Agregar
        </button>
      </div>

      {!modalOpen && errorMessage && <div className="alert alert-error">{errorMessage}</div>}
      {deleteCandidate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirmar eliminación</h2>
              <button className="btn btn-icon" onClick={cancelarEliminarProyecto}>
                X
              </button>
            </div>
            <p>
              ¿Eliminar proyecto <strong>{deleteCandidate.nombre}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cancelarEliminarProyecto}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmarEliminarProyecto}>
                Confirmar eliminación
              </button>
            </div>
          </div>
        </div>
      )}

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
                <button
                  className="btn btn-icon"
                  onClick={() => abrirModalEditar(proyecto)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-icon"
                  onClick={() => eliminarProyecto(proyecto)}
                >
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
              <h2>{modo === 'crear' ? 'Nuevo proyecto' : 'Editar proyecto'}</h2>
              <button className="btn btn-icon" onClick={cerrarModal}>
                X
              </button>
            </div>

            <ProyectoForm
              form={form}
              modo={modo}
              message={errorMessage}
              onDismissMessage={() => setErrorMessage('')}
              onChange={handleChange}
              onSubmit={handleSubmit}
              onCancel={cerrarModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
