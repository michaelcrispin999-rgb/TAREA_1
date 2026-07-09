import api from '../../services/api';

export const fetchUsuarios = async () => {
  const { data } = await api.get('/usuarios');
  return data;
};

export const createUsuario = async (payload) => {
  const { data } = await api.post('/usuarios', payload);
  return data;
};

export const updateUsuario = async (id, payload) => {
  const { data } = await api.patch(`/usuarios/${id}`, payload);
  return data;
};

export const deleteUsuario = async (id) => {
  const { data } = await api.delete(`/usuarios/${id}`);
  return data;
};
