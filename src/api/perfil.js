import axios from 'axios';

export async function fetchPerfil(id_usuario) {
  const response = await axios.get(`https://backendcentro.onrender.com/api/perfilcliente/${id_usuario}`);
  if (!response.data || !response.data.id) {
    throw new Error('No se encontraron datos del perfil');
  }
  return response.data;
}

export async function updatePerfil(id_usuario, formData) {
  const response = await axios.put(`https://backendcentro.onrender.com/api/perfilcliente/${id_usuario}`, formData);
  return response.data;
}