import { useEffect, useState } from 'react';
import UsuarioForm from './UsuarioForm';
import {
  createUsuario,
  deleteUsuario,
  fetchUsuarios,
  updateUsuario,
} from './usuarioService';
import { fetchTareas } from '../tareas/tareaService';

const initialForm = {
  nombre: '',
  email: '',
  activo: true,
};

export default function VistaUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [modo, setModo] = useState('crear');
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const cargarUsuarios = async () => {
    setErrorMessage('');
    try {
      const [usuariosData, tareasData] = await Promise.all([
        fetchUsuarios(),
        fetchTareas(),
      ]);
      setUsuarios(usuariosData);
      setTareas(tareasData);
    } catch (error) {
      setErrorMessage('No se pudieron cargar los usuarios ni las tareas. Intenta de nuevo.');
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const abrirModalCrear = () => {
    setForm(initialForm);
    setModo('crear');
    setEditId(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (usuario) => {
    setErrorMessage('');
    setForm({
      nombre: usuario.nombre || '',
      email: usuario.email || '',
      activo: usuario.activo ?? true,
    });
    setModo('editar');
    setEditId(usuario.id);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setErrorMessage('');
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const tieneTareasPendientes = (usuarioId) => {
    return tareas.some(
      (tarea) =>
        (tarea.idUsuarioAsignado === usuarioId || tarea.idUsuarioAsigna === usuarioId) &&
        tarea.estado !== 'terminado' &&
        tarea.estado !== 'cancelado',
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage('');

    if (!form.nombre.trim()) {
      setErrorMessage('Ingrese el nombre del usuario.');
      return;
    }

    if (!form.email.trim()) {
      setErrorMessage('Ingrese el correo electrónico del usuario.');
      return;
    }

    if (modo === 'editar' && form.activo === false && tieneTareasPendientes(editId)) {
      setErrorMessage('No puedes desactivar este usuario porque tiene tareas pendientes.');
      return;
    }

    try {
      if (modo === 'crear') {
        await createUsuario(form);
      } else {
        await updateUsuario(editId, form);
      }

      await cargarUsuarios();
      cerrarModal();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'Error al guardar usuario. Revisa los datos e intenta de nuevo.',
      );
    }
  };

  const eliminarUsuario = async (usuario) => {
    setErrorMessage('');

    if (tieneTareasPendientes(usuario.id)) {
      setErrorMessage('No puedes eliminar este usuario porque tiene tareas pendientes.');
      return;
    }

    setDeleteCandidate({ id: usuario.id, nombre: usuario.nombre });
  };

  const confirmarEliminarUsuario = async () => {
    if (!deleteCandidate) return;

    try {
      await deleteUsuario(deleteCandidate.id);
      setDeleteCandidate(null);
      await cargarUsuarios();
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message ||
          'No se puede eliminar el usuario porque tiene relaciones.',
      );
    }
  };

  const cancelarEliminarUsuario = () => {
    setDeleteCandidate(null);
    setErrorMessage('');
  };

  return (
    <>
      <div className="content-header">
        <h1>Usuarios</h1>
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
              <button className="btn btn-icon" onClick={cancelarEliminarUsuario}>
                X
              </button>
            </div>
            <p>
              ¿Eliminar usuario <strong>{deleteCandidate.nombre}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cancelarEliminarUsuario}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmarEliminarUsuario}>
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
              <td>{usuario.activo ? 'Sí' : 'No'}</td>
              <td>{new Date(usuario.fechaCreacion).toLocaleDateString()}</td>

              <td className="actions">
                <button
                  className="btn btn-icon"
                  onClick={() => abrirModalEditar(usuario)}
                >
                  Editar
                </button>

                <button
                  className="btn btn-icon"
                  onClick={() => eliminarUsuario(usuario)}
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
              <h2>{modo === 'crear' ? 'Crear nuevo usuario' : 'Editar usuario'}</h2>
              <button className="btn btn-icon" onClick={cerrarModal}>
                X
              </button>
            </div>

            <UsuarioForm
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
