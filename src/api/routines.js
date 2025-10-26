export async function fetchRoutines(id_usuario, categoriaId) {
    const response = await fetch(
      `https://backendcentro.onrender.com/api/rutinas/usuario/${id_usuario}/categoria/${categoriaId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al cargar rutinas: ${response.status} ${text}`);
    }
    return response.json();
  }
  
  export async function fetchAsignaciones(id_usuario) {
    const response = await fetch(
      `https://backendcentro.onrender.com/api/asignaciones_rutinas/usuario/${id_usuario}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al buscar asignaciones: ${response.status} ${text}`);
    }
    return response.json();
  }
  
  export async function fetchRutina(id_rutina) {
    const response = await fetch(
      `https://backendcentro.onrender.com/api/rutinas/${id_rutina}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al cargar la rutina: ${response.status} ${text}`);
    }
    return response.json();
  }
  
  export async function fetchProgresos(asignacionId) {
    const response = await fetch(
      `https://backendcentro.onrender.com/api/progresos/asignacion/${asignacionId}`,
      { method: 'GET', headers: { 'Content-Type': 'application/json' } }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al cargar progresos: ${response.status} ${text}`);
    }
    return response.json();
  }
  
  export async function updateProgreso(progresoId, updateData) {
    const response = await fetch(
      `https://backendcentro.onrender.com/api/progresos/${progresoId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al actualizar progreso: ${response.status} ${text}`);
    }
    return response.json();
  }
  
  export async function updateAsignacion(asignacionId, updateData) {
    const response = await fetch(
      `https://backendcentro.onrender.com/api/asignaciones_rutinas/${asignacionId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al actualizar asignación: ${response.status} ${text}`);
    }
    return response.json();
  }
  
  export async function resetAsignacion(asignacionId, updateData) {
    const response = await fetch(
      `https://backendcentro.onrender.com/api/asignaciones_rutinas/${asignacionId}/reset`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      }
    );
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al reiniciar asignación: ${response.status} ${text}`);
    }
    return response.json();
  }