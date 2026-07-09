import api from '../../services/api';

export const fetchProyectos = async () => {
  const { data } = await api.get('/proyectos');
  return data;
};

export const createProyecto = async (payload) => {
  const { data } = await api.post('/proyectos', payload);
  return data;
};

export const updateProyecto = async (id, payload) => {
  const { data } = await api.patch(`/proyectos/${id}`, payload);
  return data;
};

export const deleteProyecto = async (id) => {
  const { data } = await api.delete(`/proyectos/${id}`);
  return data;
};
