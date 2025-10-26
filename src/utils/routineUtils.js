// src/utils/routineUtils.js
// Funciones utilitarias extraídas de Rutinas.js y RutinaDetalle.js

/**
 * Valida los datos de una rutina
 * @param {Object} routine - Datos de la rutina
 * @returns {Object} - { isValid: boolean, errors: string[] }
 */
export function validateRoutineData(routine) {
    const errors = [];
  
    if (!routine) {
      return { isValid: false, errors: ['Routine data is required'] };
    }
  
    if (!routine.titulo || routine.titulo.trim() === '') {
      errors.push('Routine title cannot be empty');
    }
  
    if (!routine.pasos || !Array.isArray(routine.pasos)) {
      errors.push('Routine must have a valid pasos array');
    }
  
    if (routine.pasos && routine.pasos.length === 0) {
      errors.push('Routine must have at least one exercise');
    }
  
    if (routine.pasos && Array.isArray(routine.pasos)) {
      routine.pasos.forEach((paso, index) => {
        if (!paso.nombre || paso.nombre.trim() === '') {
          errors.push(`Exercise ${index + 1}: name cannot be empty`);
        }
  
        if (typeof paso.tiempo_estimado !== 'number' || paso.tiempo_estimado <= 0) {
          errors.push(`Exercise ${index + 1}: tiempo_estimado must be a positive number`);
        }
  
        if (paso.tiempo_estimado && paso.tiempo_estimado < 0) {
          errors.push(`Exercise ${index + 1}: tiempo_estimado cannot be negative`);
        }
      });
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Calcula las métricas totales de una rutina
   * @param {Object} routine - Rutina con pasos
   * @returns {Object} - Métricas calculadas
   */
  export function calculateRoutineMetrics(routine) {
    if (!routine || typeof routine !== 'object') {
      throw new Error('Invalid routine data');
    }
  
    if (!routine.pasos || !Array.isArray(routine.pasos)) {
      throw new Error('Routine must have pasos array');
    }
  
    const totalExercises = routine.pasos.length;
    let totalDuration = 0;
  
    routine.pasos.forEach(paso => {
      const tiempo = typeof paso.tiempo_estimado === 'number' && !isNaN(paso.tiempo_estimado)
        ? paso.tiempo_estimado * 60 // convertir minutos a segundos
        : 180; // default 3 minutos
      totalDuration += tiempo;
    });
  
    return {
      totalExercises,
      totalDuration, // en segundos
      totalDurationMinutes: Math.round(totalDuration / 60),
      exercises: routine.pasos.map(p => p.nombre || 'Sin nombre'),
    };
  }
  
  /**
   * Obtiene la imagen de una rutina (primer paso con imagen)
   * @param {Object} routine - Rutina con pasos
   * @returns {string} - URL de la imagen o imagen por defecto
   */
  export function getRoutineImage(routine) {
    const DEFAULT_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HXvApelNZvniviGtpKO4kpAfSw2aqJ.png";
    
    if (!routine || !routine.pasos || !Array.isArray(routine.pasos)) {
      return DEFAULT_IMAGE;
    }
  
    const pasoConImagen = routine.pasos.find(p => p.imagen && p.imagen !== "");
    return pasoConImagen ? pasoConImagen.imagen : DEFAULT_IMAGE;
  }
  
  /**
   * Calcula el progreso de una rutina
   * @param {Array} progresos - Array de progresos
   * @param {number} totalExercises - Total de ejercicios
   * @returns {Object} - { completedSteps, progress, isCompleted }
   */
  export function calculateProgress(progresos, totalExercises) {
    if (!Array.isArray(progresos) || totalExercises <= 0) {
      return { completedSteps: 0, progress: 0, isCompleted: false };
    }
  
    const completedSteps = progresos.filter(p => p.estado === 'completado').length;
    const progress = (completedSteps / totalExercises) * 100;
    const isCompleted = completedSteps === totalExercises;
  
    return {
      completedSteps,
      progress: Math.round(progress),
      isCompleted,
    };
  }
  
  /**
   * Formatea el tiempo en formato MM:SS
   * @param {number} seconds - Segundos a formatear
   * @returns {string} - Tiempo formateado
   */
  export function formatTime(seconds) {
    if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) {
      return '0:00';
    }
  
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }
  
  /**
   * Valida los parámetros de una rutina
   * @param {number} id_rutina - ID de la rutina
   * @param {number} id_usuario - ID del usuario
   * @returns {Object} - { isValid, errors }
   */
  export function validateRoutineParams(id_rutina, id_usuario) {
    const errors = [];
  
    if (!id_rutina || typeof id_rutina !== 'number' || isNaN(id_rutina)) {
      errors.push('Invalid routine ID');
    }
  
    if (!id_usuario || typeof id_usuario !== 'number' || isNaN(id_usuario)) {
      errors.push('Invalid user ID');
    }
  
    return {
      isValid: errors.length === 0,
      errors,
    };
  }
  
  /**
   * Calcula la duración total usada en los progresos
   * @param {Array} progresos - Array de progresos
   * @returns {number} - Duración total en segundos
   */
  export function calculateTotalDuration(progresos) {
    if (!Array.isArray(progresos)) {
      return 0;
    }
  
    return progresos.reduce((sum, p) => {
      const tiempo = typeof p.tiempo_usado === 'number' ? p.tiempo_usado : 0;
      return sum + tiempo;
    }, 0);
  }
  
  /**
   * Determina el estado de la asignación basado en el progreso
   * @param {number} completedSteps - Pasos completados
   * @param {number} totalSteps - Total de pasos
   * @returns {string} - Estado: 'pendiente', 'en_progreso' o 'completada'
   */
  export function determineAssignmentState(completedSteps, totalSteps) {
    if (completedSteps === 0) {
      return 'pendiente';
    } else if (completedSteps === totalSteps) {
      return 'completada';
    } else {
      return 'en_progreso';
    }
  }