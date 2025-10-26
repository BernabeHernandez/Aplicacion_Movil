import MockAdapter from 'axios-mock-adapter';
import axios from 'axios';
import {
  fetchRoutines,
  fetchAsignaciones,
  fetchRutina,
  fetchProgresos,
  updateProgreso,
  updateAsignacion,
  resetAsignacion,
} from '@/api/routines';
import { updatePerfil } from '@/api/perfil';

describe('Integración Frontend-Backend para Rutinas, Detalle Rutinas y Perfil', () => {
  let axiosMock;

  beforeEach(() => {
    global.fetch.mockClear();
    axiosMock = new MockAdapter(axios);
  });

  afterEach(() => {
    axiosMock.reset();
  });

  //  Rutinas
  test('Positiva: carga rutinas correctamente', async () => {
    const mockRoutines = [
      { id_rutina: 1, titulo: 'Rutina Cervical', pasos: [{ id_paso: 1, nombre: 'Estiramiento lateral', tiempo_estimado: 5 }] },
    ];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockRoutines),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockRoutines)),
    });

    const id_usuario = 123;
    const categoriaId = 1;
    const response = await fetchRoutines(id_usuario, categoriaId);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backendcentro.onrender.com/api/rutinas/usuario/${id_usuario}/categoria/${categoriaId}`,
      expect.objectContaining({ method: 'GET', headers: { 'Content-Type': 'application/json' } })
    );
    expect(response).toEqual(mockRoutines);
  });

  test('Negativa: maneja error al cargar rutinas', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server error'),
    });

    const id_usuario = 123;
    const categoriaId = 1;
    await expect(fetchRoutines(id_usuario, categoriaId)).rejects.toThrow('Error al cargar rutinas: 500 Server error');
  });

  //Rutina Detalle: Asignaciones
  test('Positiva: carga asignaciones correctamente', async () => {
    const mockAsignaciones = [{ id: 1, id_rutina: 1, id_usuario: 123, estado: 'en_progreso' }];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockAsignaciones),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockAsignaciones)),
    });

    const id_usuario = 123;
    const response = await fetchAsignaciones(id_usuario);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backendcentro.onrender.com/api/asignaciones_rutinas/usuario/${id_usuario}`,
      expect.objectContaining({ method: 'GET', headers: { 'Content-Type': 'application/json' } })
    );
    expect(response).toEqual(mockAsignaciones);
  });

  test('Negativa: maneja error al cargar asignaciones', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server error'),
    });

    const id_usuario = 123;
    await expect(fetchAsignaciones(id_usuario)).rejects.toThrow('Error al buscar asignaciones: 500 Server error');
  });

  //  Rutina Detalle: Detalles de Rutina 
  test('Positiva: carga detalles de rutina correctamente', async () => {
    const mockRutina = { id_rutina: 1, titulo: 'Rutina Cervical', pasos: [{ id_paso: 1, nombre: 'Estiramiento lateral', tiempo_estimado: 5 }] };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockRutina),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockRutina)),
    });

    const id_rutina = 1;
    const response = await fetchRutina(id_rutina);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backendcentro.onrender.com/api/rutinas/${id_rutina}`,
      expect.objectContaining({ method: 'GET', headers: { 'Content-Type': 'application/json' } })
    );
    expect(response).toEqual(mockRutina);
  });

  test('Negativa: maneja error al cargar detalles de rutina', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 404,
      text: jest.fn().mockResolvedValue('Rutina no encontrada'),
    });

    const id_rutina = 999;
    await expect(fetchRutina(id_rutina)).rejects.toThrow('Error al cargar la rutina: 404 Rutina no encontrada');
  });

  // Rutina Detalle: Progresos 
  test('Positiva: carga progresos correctamente', async () => {
    const mockProgresos = [{ id: 1, asignacionId: 1, estado: 'completado', tiempo_usado: 300 }];

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockProgresos),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockProgresos)),
    });

    const asignacionId = 1;
    const response = await fetchProgresos(asignacionId);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backendcentro.onrender.com/api/progresos/asignacion/${asignacionId}`,
      expect.objectContaining({ method: 'GET', headers: { 'Content-Type': 'application/json' } })
    );
    expect(response).toEqual(mockProgresos);
  });

  test('Negativa: maneja error al cargar progresos', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server error'),
    });

    const asignacionId = 1;
    await expect(fetchProgresos(asignacionId)).rejects.toThrow('Error al cargar progresos: 500 Server error');
  });

  //  Rutina Detalle: Actualizar Progreso 
  test('Positiva: actualiza progreso correctamente', async () => {
    const mockProgreso = { id: 1, estado: 'en_progreso' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockProgreso),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockProgreso)),
    });

    const progresoId = 1;
    const updateData = { estado: 'en_progreso' };
    const response = await updateProgreso(progresoId, updateData);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backendcentro.onrender.com/api/progresos/${progresoId}`,
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
    );
    expect(response).toEqual(mockProgreso);
  });

  test('Negativa: maneja error al actualizar progreso', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server error'),
    });

    const progresoId = 1;
    const updateData = { estado: 'en_progreso' };
    await expect(updateProgreso(progresoId, updateData)).rejects.toThrow('Error al actualizar progreso: 500 Server error');
  });

  //  Rutina Detalle: Actualizar Asignación 
  test('Positiva: actualiza asignación correctamente', async () => {
    const mockAsignacion = { id: 1, progreso_actual: 50, estado: 'en_progreso' };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockAsignacion),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockAsignacion)),
    });

    const asignacionId = 1;
    const updateData = { progreso_actual: 50, estado: 'en_progreso' };
    const response = await updateAsignacion(asignacionId, updateData);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backendcentro.onrender.com/api/asignaciones_rutinas/${asignacionId}`,
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
    );
    expect(response).toEqual(mockAsignacion);
  });

  test('Negativa: maneja error al actualizar asignación', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server error'),
    });

    const asignacionId = 1;
    const updateData = { progreso_actual: 50, estado: 'en_progreso' };
    await expect(updateAsignacion(asignacionId, updateData)).rejects.toThrow('Error al actualizar asignación: 500 Server error');
  });

  // Rutina Detalle: Reiniciar Asignación
  test('Positiva: reinicia asignación correctamente', async () => {
    const mockAsignacion = { id: 1, sesion: 2 };

    global.fetch.mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: jest.fn().mockResolvedValue(mockAsignacion),
      text: jest.fn().mockResolvedValue(JSON.stringify(mockAsignacion)),
    });

    const asignacionId = 1;
    const updateData = { sesion: 2 };
    const response = await resetAsignacion(asignacionId, updateData);

    expect(global.fetch).toHaveBeenCalledWith(
      `https://backendcentro.onrender.com/api/asignaciones_rutinas/${asignacionId}/reset`,
      expect.objectContaining({
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
      })
    );
    expect(response).toEqual(mockAsignacion);
  });

  test('Negativa: maneja error al reiniciar asignación', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: jest.fn().mockResolvedValue('Server error'),
    });

    const asignacionId = 1;
    const updateData = { sesion: 2 };
    await expect(resetAsignacion(asignacionId, updateData)).rejects.toThrow('Error al reiniciar asignación: 500 Server error');
  });

  // Perfil
  test('Positiva: actualiza perfil correctamente', async () => {
    const mockPerfil = { id_usuario: 123, nombre: 'Juan', apellidopa: 'Pérez', gmail: 'juan@example.com' };

    axiosMock.onPut('https://backendcentro.onrender.com/api/perfilcliente/123').reply(200, mockPerfil);
    axiosMock.onGet('https://backendcentro.onrender.com/api/perfilcliente/123').reply(200, mockPerfil);

    const id_usuario = 123;
    const formData = { nombre: 'Juan', apellidopa: 'Pérez', gmail: 'juan@example.com' };
    const response = await updatePerfil(id_usuario, formData);

    expect(response).toEqual(mockPerfil);
  });

  test('Negativa: maneja error al actualizar perfil', async () => {
    axiosMock.onPut('https://backendcentro.onrender.com/api/perfilcliente/123').reply(500, { error: 'Server error' });

    const id_usuario = 123;
    const formData = { nombre: 'Juan', apellidopa: 'Pérez', gmail: 'juan@example.com' };
    await expect(updatePerfil(id_usuario, formData)).rejects.toThrow();
  });
});