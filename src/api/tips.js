export async function fetchNotificacionesRecientes() {
    const response = await fetch('https://backendcentro.onrender.com/api/notificaciones/recientes');
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al cargar notificaciones: ${response.status} ${text}`);
    }
    return response.json();
  }
  
  export async function fetchCategoriaTips(categoriaKey) {
    const response = await fetch(`https://backendcentro.onrender.com/api/categoria-tips/${categoriaKey}`);
    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Error al cargar tips: ${response.status} ${text}`);
    }
    return response.json();
  }