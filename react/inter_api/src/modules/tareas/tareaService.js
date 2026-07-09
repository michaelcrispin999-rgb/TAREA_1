import api from '../../services/api';

export const fetchTareas = async () => {
  const { data } = await api.get('/tareas');
  return data;
};

export const createTarea = async (payload) => {
  const { data } = await api.post('/tareas', payload);
  return data;
};

export const updateTarea = async (id, payload) => {
  const { data } = await api.patch(`/tareas/${id}`, payload);
  return data;
};

export const deleteTarea = async (id) => {
  const { data } = await api.delete(`/tareas/${id}`);
  return data;
};

export const asignarTarea = async (id, payload) => {
  const { data } = await api.patch(`/tareas/${id}/asignar`, payload);
  return data;
};

export const reasignarTarea = async (id, payload) => {
  const { data } = await api.patch(`/tareas/${id}/reasignar`, payload);
  return data;
};
