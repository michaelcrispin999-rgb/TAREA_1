import { Fragment, useEffect, useState } from 'react';
import TareaForm from './TareaForm';
import {
  createTarea,
  deleteTarea,
  fetchTareas,
  updateTarea,
  asignarTarea,
  reasignarTarea,
} from './tareaService';
import { fetchProyectos } from '../proyectos/proyectoService';
import { fetchUsuarios } from '../usuarios/usuarioService';

const estados = ['por_asignar', 'pendiente', 'en_curso', 'terminado', 'cancelado'];

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

const transicionesEstado = {
  por_asignar: [
    { value: 'pendiente', label: 'Pendiente' },
  ],
  pendiente: [
    { value: 'en_curso', label: 'En curso' },
    { value: 'cancelado', label: 'Cancelado' },
  ],
  en_curso: [
    { value: 'terminado', label: 'Terminado' },
    { value: 'cancelado', label: 'Cancelado' },
  ],
  terminado: [],
  cancelado: [],
};

const initialForm = {
  descripcion: '',
  idProyecto: '',
  idUsuarioAsignado: '',
  estado: 'por_asignar',
};

export default function VistaTareas() {
  const [tareas, setTareas] = useState([]);
  const [proyectos, setProyectos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [stateModalOpen, setStateModalOpen] = useState(false);
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [modo, setModo] = useState('crear');
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [expandedRows, setExpandedRows] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [deleteCandidate, setDeleteCandidate] = useState(null);

  const cargarDatos = async () => {
    try {
      const [tareasData, proyectosData, usuariosData] = await Promise.all([
        fetchTareas(),
        fetchProyectos(),
        fetchUsuarios(),
      ]);
      setTareas(tareasData);
      setProyectos(proyectosData);
      setUsuarios(usuariosData);
    } catch (error) {
      console.error('Error al cargar datos de tareas:', error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const abrirModalCrear = () => {
    setForm({
      ...initialForm,
      idProyecto: proyectos[0]?.id?.toString() ?? '',
    });
    setModo('crear');
    setEditId(null);
    setModalOpen(true);
  };

  const abrirModalEditar = (tarea) => {
    setForm({
      descripcion: tarea.descripcion,
      idProyecto: tarea.idProyecto?.toString() ?? tarea.proyecto?.id?.toString() ?? '',
      idUsuarioAsignado: tarea.idUsuarioAsignado?.toString() ?? '',
      estado: tarea.estado,
    });
    setModo('editar');
    setEditId(tarea.id);
    setModalOpen(true);
  };

  const cerrarModal = () => setModalOpen(false);

  const abrirStateModal = (tarea) => {
    setSelectedTask(tarea);
    setSelectedState('');
    setModalErrorMessage('');
    setStateModalOpen(true);
  };

  const cerrarStateModal = () => {
    setSelectedTask(null);
    setSelectedState('');
    setModalErrorMessage('');
    setStateModalOpen(false);
  };

  const abrirReassignModal = (tarea) => {
    setSelectedTask(tarea);
    setSelectedUser(tarea.idUsuarioAsignado?.toString() ?? '');
    setModalErrorMessage('');
    setReassignModalOpen(true);
  };

  const cerrarReassignModal = () => {
    setSelectedTask(null);
    setSelectedUser('');
    setModalErrorMessage('');
    setReassignModalOpen(false);
  };

  const obtenerNombreUsuario = (id, relacion) => {
    if (relacion?.nombre) return relacion.nombre;
    if (id === null || id === undefined || id === '') return 'Sin asignar';
    return usuarios.find((usuario) => usuario.id === Number(id))?.nombre ?? 'Sin asignar';
  };

  const obtenerNombreUsuarioPorId = (valor) => {
    if (valor === null || valor === undefined || valor === '') return 'Sin asignar';
    if (typeof valor === 'number') return usuarios.find((usuario) => usuario.id === valor)?.nombre ?? 'Sin asignar';
    if (!Number.isNaN(Number(valor))) {
      return usuarios.find((usuario) => usuario.id === Number(valor))?.nombre ?? 'Sin asignar';
    }
    return valor;
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

  const obtenerDescripcionHistorial = (evento) => {
    const actor = evento.usuarioAccion?.nombre ?? 'Usuario';
    const anterior = evento.valorAnterior ?? '';
    const nuevo = evento.valorNuevo ?? '';

    if (evento.accion === 'reasignacion') {
      const anteriorNombre = obtenerNombreUsuarioPorId(anterior) || 'Sin asignar';
      const nuevoNombre = obtenerNombreUsuarioPorId(nuevo) || 'Sin asignar';
      return `${actor} reasignó la tarea de ${anteriorNombre} a ${nuevoNombre}`;
    }

    if (evento.accion === 'asignacion') {
      const nuevoNombre = obtenerNombreUsuarioPorId(nuevo) || 'Sin asignar';
      return `${actor} asignó la tarea a ${nuevoNombre}`;
    }

    if (evento.accion === 'cambio_estado') {
      const anteriorEstado = estadoEtiquetas[anterior] ?? anterior;
      const nuevoEstado = estadoEtiquetas[nuevo] ?? nuevo;
      return `${actor} cambió el estado de ${anteriorEstado} a ${nuevoEstado}`;
    }

    return `${actor} realizó ${evento.accion.replace('_', ' ')} ${anterior ? `de ${anterior}` : ''}${nuevo ? ` a ${nuevo}` : ''}`.trim();
  };

  const obtenerIconoHistorial = (accion) => {
    if (accion === 'reasignacion' || accion === 'asignacion') return '🔄';
    if (accion === 'cambio_estado') return '⚠️';
    return 'ℹ️';
  };

  const getActionLabel = (estado) => {
    if (estado === 'por_asignar') return 'Asignar';
    if (estado === 'pendiente' || estado === 'en_curso') return 'Cambiar estado';
    return 'Ver';
  };

  const toggleRowDetails = (id) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id],
    );
  };

  const showStatus = (message) => {
    setStatusMessage(message);
    setTimeout(() => setStatusMessage(''), 4000);
  };

  const handleTaskAction = (tarea) => {
    if (tarea.estado === 'por_asignar') {
      abrirReassignModal(tarea);
      return;
    }
    if (tarea.estado === 'pendiente' || tarea.estado === 'en_curso') {
      abrirStateModal(tarea);
      return;
    }
    showStatus('No hay acciones disponibles para este estado.');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.descripcion.trim()) {
      setErrorMessage('Ingrese la descripción de la tarea.');
      return;
    }
    if (!form.idProyecto) {
      setErrorMessage('Seleccione el proyecto.');
      return;
    }

    try {
      if (modo === 'crear') {
        const payload = {
          descripcion: form.descripcion,
          idProyecto: Number(form.idProyecto),
          estado: form.idUsuarioAsignado ? 'pendiente' : 'por_asignar',
        };

        if (form.idUsuarioAsignado !== '') {
          payload.idUsuarioAsignado = Number(form.idUsuarioAsignado);
        }

        await createTarea(payload);
        showStatus('Tarea creada correctamente.');
      } else {
        const payload = {
          descripcion: form.descripcion,
          estado: form.estado,
        };

        if (form.idUsuarioAsignado !== '') {
          payload.idUsuarioAsignado = Number(form.idUsuarioAsignado);
          if (form.estado === 'por_asignar') {
            payload.estado = 'pendiente';
          }
        }

        await updateTarea(editId, payload);
        showStatus('Tarea actualizada correctamente.');
      }

      await cargarDatos();
      cerrarModal();
    } catch (error) {
      console.error('Error al guardar tarea:', error);
      setErrorMessage(error.response?.data?.message || 'Error al guardar tarea');
    }
  };

  const eliminarTarea = async (tarea) => {
    setErrorMessage('');
    setDeleteCandidate({ id: tarea.id, descripcion: tarea.descripcion });
  };

  const confirmarEliminarTarea = async () => {
    if (!deleteCandidate) return;

    try {
      await deleteTarea(deleteCandidate.id);
      setDeleteCandidate(null);
      await cargarDatos();
      showStatus('Tarea eliminada correctamente.');
    } catch (error) {
      console.error('Error al eliminar tarea:', error);
      setErrorMessage('Error al eliminar tarea');
    }
  };

  const cancelarEliminarTarea = () => {
    setDeleteCandidate(null);
    setErrorMessage('');
  };

  const handleSubmitStateChange = async (event) => {
    event.preventDefault();
    if (!selectedState) {
      setModalErrorMessage('Selecciona un estado válido.');
      return;
    }
    if (!selectedTask) return;

    try {
      await updateTarea(selectedTask.id, { estado: selectedState });
      await cargarDatos();
      cerrarStateModal();
      showStatus(`Estado actualizado a ${estadoEtiquetas[selectedState]}.`);
    } catch (error) {
      console.error('Error al cambiar estado:', error);
      setModalErrorMessage(error.response?.data?.message || 'No se pudo cambiar el estado.');
    }
  };

  const handleSubmitReassign = async (event) => {
    event.preventDefault();
    setModalErrorMessage('');
    if (!selectedUser) {
      setModalErrorMessage('Selecciona un usuario para la tarea.');
      return;
    }
    if (!selectedTask) return;

    const nuevoUsuarioId = Number(selectedUser);
    if (selectedTask.idUsuarioAsignado === nuevoUsuarioId) {
      setModalErrorMessage('El usuario seleccionado ya está asignado a esta tarea.');
      return;
    }

    try {
      if (selectedTask.idUsuarioAsignado) {
        const actorId = selectedTask.idUsuarioAsignado ?? nuevoUsuarioId;
        await reasignarTarea(selectedTask.id, {
          idUsuarioAccion: actorId,
          idNuevoAsignado: nuevoUsuarioId,
        });
        showStatus('Tarea reasignada correctamente.');
      } else {
        const actorId = nuevoUsuarioId;
        await asignarTarea(selectedTask.id, {
          idUsuarioAsigna: actorId,
          idUsuarioAsignado: nuevoUsuarioId,
        });
        showStatus('Tarea asignada correctamente.');
      }

      await cargarDatos();
      cerrarReassignModal();
    } catch (error) {
      console.error('Error al asignar/ reasignar tarea:', error);
      setModalErrorMessage(error.response?.data?.message || 'No se pudo asignar la tarea.');
    }
  };

  return (
    <>
      <div className="content-header">
        <h1>Tareas</h1>
        <button className="btn btn-primary" onClick={abrirModalCrear}>
          + Crear Tarea
        </button>
      </div>

      {!modalOpen && !stateModalOpen && !reassignModalOpen && statusMessage && (
        <div className="alert alert-success">{statusMessage}</div>
      )}
      {!modalOpen && !stateModalOpen && !reassignModalOpen && errorMessage && (
        <div className="alert alert-error">{errorMessage}</div>
      )}

      {deleteCandidate && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Confirmar eliminación</h2>
              <button className="btn btn-icon" onClick={cancelarEliminarTarea}>
                X
              </button>
            </div>
            <p>
              ¿Eliminar tarea <strong>{deleteCandidate.descripcion}</strong>?
            </p>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={cancelarEliminarTarea}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={confirmarEliminarTarea}>
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
            <Fragment key={tarea.id}>
              <tr>
                <td>{tarea.id}</td>
                <td>{tarea.descripcion}</td>
                <td>{tarea.proyecto?.nombre ?? '-'}</td>
                <td>{obtenerNombreUsuario(tarea.idUsuarioAsigna, tarea.asigna)}</td>
                <td>{obtenerNombreUsuario(tarea.idUsuarioAsignado, tarea.asignado)}</td>
                <td>
                  <span className={estadoClases[tarea.estado] || 'status-pill'}>
                    {estadoEtiquetas[tarea.estado] ?? tarea.estado}
                  </span>
                </td>
                <td className="actions">
                  <button
                    className="btn btn-primary btn-small"
                    onClick={() => handleTaskAction(tarea)}
                  >
                    {getActionLabel(tarea.estado)}
                  </button>

                  {tarea.estado !== 'por_asignar' && tarea.estado !== 'terminado' && (
                    <button
                      className="btn btn-secondary btn-small"
                      onClick={() => abrirReassignModal(tarea)}
                    >
                      Reasignar
                    </button>
                  )}

                  <button
                    className="btn btn-tertiary btn-small"
                    onClick={() => toggleRowDetails(tarea.id)}
                  >
                    {expandedRows.includes(tarea.id) ? 'Ocultar historial' : 'Ver historial'}
                  </button>

                  <button
                    className="btn btn-danger btn-small"
                    onClick={() => eliminarTarea(tarea)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
              {expandedRows.includes(tarea.id) && (
                <tr className="task-details-row" key={`${tarea.id}-details`}>
                  <td colSpan="7">
                    <div className="task-details-card">
                      <div className="task-details-row-item">
                        <strong>Asignado a:</strong> {obtenerNombreUsuario(tarea.idUsuarioAsignado, tarea.asignado)}
                      </div>
                      <div className="task-details-row-item">
                        <strong>Proyecto:</strong> {tarea.proyecto?.nombre ?? 'Sin proyecto'}
                      </div>
                      <div className="task-history">
                        <h4>Historial breve</h4>
                        {tarea.historicos?.length > 0 ? (
                          tarea.historicos.map((evento) => (
                            <div key={evento.id} className="history-event">
                              <span className="history-event-icon">
                                {obtenerIconoHistorial(evento.accion)}
                              </span>
                              <div className="history-event-content">
                                <span className="history-event-text">
                                  {obtenerDescripcionHistorial(evento)}
                                </span>
                                <span className="history-event-time">
                                  {formatRelativeTime(evento.fecha)} · {new Date(evento.fecha).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p>No hay historial para esta tarea aún.</p>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </Fragment>
          ))}
        </tbody>
      </table>

      {stateModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Cambiar estado</h2>
              <button className="btn btn-icon" onClick={cerrarStateModal}>
                X
              </button>
            </div>
            <form onSubmit={handleSubmitStateChange}>
              <p>
                Selecciona el nuevo estado válido para la tarea{' '}
                <strong>{selectedTask.descripcion}</strong>.
              </p>
              <label>
                Nuevo estado
                <select
                  value={selectedState}
                  onChange={(event) => setSelectedState(event.target.value)}
                >
                  <option value="">Selecciona un estado...</option>
                  {transicionesEstado[selectedTask.estado].map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
              {modalErrorMessage && <div className="alert alert-error">{modalErrorMessage}</div>}
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={cerrarStateModal}>
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary">
                  Guardar estado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {reassignModalOpen && selectedTask && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{selectedTask.idUsuarioAsignado ? 'Reasignar tarea' : 'Asignar tarea'}</h2>
              <button className="btn btn-icon" onClick={cerrarReassignModal}>
                X
              </button>
            </div>
            <form onSubmit={handleSubmitReassign}>
              <p>
                {selectedTask.idUsuarioAsignado ? (
                  <>El usuario actual (<strong>{selectedTask.asignado?.nombre ?? 'Sin asignar'}</strong>) será quitado de esta tarea.</>
                ) : (
                  <>Esta tarea no está asignada actualmente. Selecciona quién recibirá esta tarea.</>
                )}
              </p>
              <label>
                Nuevo usuario asignado
                <select
                  value={selectedUser}
                  onChange={(event) => setSelectedUser(event.target.value)}
                >
                  <option value="">Selecciona un usuario...</option>
                  {usuarios.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre}
                    </option>
                  ))}
                </select>
              </label>
              {modalErrorMessage && <div className="alert alert-error">{modalErrorMessage}</div>}
              <div className="modal-actions">
                <button className="btn btn-secondary" type="button" onClick={cerrarReassignModal}>
                  Cancelar
                </button>
                <button className="btn btn-primary" type="submit">
                  {selectedTask.idUsuarioAsignado ? 'Reasignar' : 'Asignar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>{modo === 'crear' ? 'Crear Nueva Tarea' : 'Editar Tarea'}</h2>
              <button className="btn btn-icon" onClick={cerrarModal}>
                X
              </button>
            </div>

            <TareaForm
              form={form}
              proyectos={proyectos}
              usuarios={usuarios}
              modo={modo}
              message={errorMessage}
              onDismissMessage={() => setErrorMessage('')}
              onChange={(field, value) => setForm((prev) => ({ ...prev, [field]: value }))}
              onSubmit={handleSubmit}
              onCancel={cerrarModal}
            />
          </div>
        </div>
      )}
    </>
  );
}
