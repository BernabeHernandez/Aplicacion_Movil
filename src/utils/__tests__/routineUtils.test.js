import {
    validateRoutineData,
    calculateRoutineMetrics,
    getRoutineImage,
    calculateProgress,
    formatTime,
    validateRoutineParams,
    calculateTotalDuration,
    determineAssignmentState,
  } from '../routineUtils';
  
  describe('routineUtils - Pruebas Unitarias', () => {
    
    // PRUEBAS POSITIVAS
    
    describe('Pruebas Positivas - validateRoutineData', () => {
      test('debe validar correctamente una rutina completa', () => {
        const routine = {
          id_rutina: 1,
          titulo: 'Rutina Cervical',
          descripcion: 'Ejercicios para el cuello',
          pasos: [
            { nombre: 'Estiramiento lateral', tiempo_estimado: 5, descripcion: 'Inclina la cabeza' },
            { nombre: 'Rotación', tiempo_estimado: 3, descripcion: 'Gira la cabeza' },
          ],
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
  
      test('debe validar rutina con un solo ejercicio', () => {
        const routine = {
          titulo: 'Rutina Simple',
          pasos: [
            { nombre: 'Ejercicio único', tiempo_estimado: 10 },
          ],
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
    });
  
    describe('Pruebas Positivas - calculateRoutineMetrics', () => {
      test('debe calcular correctamente los tiempos y repeticiones de una rutina completa', () => {
        const routine = {
          titulo: 'Rutina Lumbar',
          pasos: [
            { nombre: 'Ejercicio 1', tiempo_estimado: 5 },
            { nombre: 'Ejercicio 2', tiempo_estimado: 10 },
            { nombre: 'Ejercicio 3', tiempo_estimado: 3 },
          ],
        };
  
        const result = calculateRoutineMetrics(routine);
  
        expect(result.totalExercises).toBe(3);
        expect(result.totalDuration).toBe(1080); 
        expect(result.totalDurationMinutes).toBe(18);
        expect(result.exercises).toEqual(['Ejercicio 1', 'Ejercicio 2', 'Ejercicio 3']);
      });
  
      test('debe manejar correctamente tiempos con decimales', () => {
        const routine = {
          titulo: 'Rutina con decimales',
          pasos: [
            { nombre: 'Ejercicio', tiempo_estimado: 2.5 },
          ],
        };
  
        const result = calculateRoutineMetrics(routine);
  
        expect(result.totalExercises).toBe(1);
        expect(result.totalDuration).toBe(150); 
      });
  
      test('debe calcular correctamente rutinas largas', () => {
        const routine = {
          titulo: 'Rutina Completa',
          pasos: Array(10).fill({ nombre: 'Ejercicio', tiempo_estimado: 5 }),
        };
  
        const result = calculateRoutineMetrics(routine);
  
        expect(result.totalExercises).toBe(10);
        expect(result.totalDuration).toBe(3000); 
        expect(result.totalDurationMinutes).toBe(50);
      });
    });
  
    describe('Pruebas Positivas - calculateProgress', () => {
      test('debe calcular correctamente el progreso cuando todos están completados', () => {
        const progresos = [
          { estado: 'completado' },
          { estado: 'completado' },
          { estado: 'completado' },
        ];
  
        const result = calculateProgress(progresos, 3);
  
        expect(result.completedSteps).toBe(3);
        expect(result.progress).toBe(100);
        expect(result.isCompleted).toBe(true);
      });
  
      test('debe calcular progreso parcial correctamente', () => {
        const progresos = [
          { estado: 'completado' },
          { estado: 'en_progreso' },
          { estado: 'pendiente' },
        ];
  
        const result = calculateProgress(progresos, 3);
  
        expect(result.completedSteps).toBe(1);
        expect(result.progress).toBe(33);
        expect(result.isCompleted).toBe(false);
      });
  
      test('debe manejar progreso en 0%', () => {
        const progresos = [
          { estado: 'pendiente' },
          { estado: 'pendiente' },
        ];
  
        const result = calculateProgress(progresos, 2);
  
        expect(result.completedSteps).toBe(0);
        expect(result.progress).toBe(0);
        expect(result.isCompleted).toBe(false);
      });
    });
  
    describe('Pruebas Positivas - formatTime', () => {
      test('debe formatear correctamente minutos y segundos', () => {
        expect(formatTime(0)).toBe('0:00');
        expect(formatTime(30)).toBe('0:30');
        expect(formatTime(60)).toBe('1:00');
        expect(formatTime(90)).toBe('1:30');
        expect(formatTime(3600)).toBe('60:00');
      });
  
      test('debe agregar cero a la izquierda en segundos menores a 10', () => {
        expect(formatTime(5)).toBe('0:05');
        expect(formatTime(65)).toBe('1:05');
        expect(formatTime(125)).toBe('2:05');
      });
    });
  
    describe('Pruebas Positivas - getRoutineImage', () => {
      test('debe retornar la primera imagen válida de los pasos', () => {
        const routine = {
          pasos: [
            { nombre: 'Paso 1', imagen: '' },
            { nombre: 'Paso 2', imagen: 'https://example.com/image.jpg' },
            { nombre: 'Paso 3', imagen: 'https://example.com/image2.jpg' },
          ],
        };
  
        const result = getRoutineImage(routine);
  
        expect(result).toBe('https://example.com/image.jpg');
      });
    });
  
    // PRUEBAS NEGATIVAS
  
    describe('Pruebas Negativas - validateRoutineData', () => {
      test('debe rechazar rutina con datos incompletos (sin título)', () => {
        const routine = {
          pasos: [
            { nombre: 'Ejercicio', tiempo_estimado: 5 },
          ],
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Routine title cannot be empty');
      });
  
      test('debe rechazar rutina sin ejercicios', () => {
        const routine = {
          titulo: 'Rutina vacía',
          pasos: [],
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Routine must have at least one exercise');
      });
  
      test('debe rechazar rutina con valores negativos en tiempo', () => {
        const routine = {
          titulo: 'Rutina inválida',
          pasos: [
            { nombre: 'Ejercicio', tiempo_estimado: -5 },
          ],
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('cannot be negative'))).toBe(true);
      });
  
      test('debe rechazar ejercicio sin nombre', () => {
        const routine = {
          titulo: 'Rutina',
          pasos: [
            { nombre: '', tiempo_estimado: 5 },
          ],
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('name cannot be empty'))).toBe(true);
      });
  
      test('debe rechazar tiempo estimado no numérico', () => {
        const routine = {
          titulo: 'Rutina',
          pasos: [
            { nombre: 'Ejercicio', tiempo_estimado: 'cinco' },
          ],
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(false);
        expect(result.errors.some(e => e.includes('must be a positive number'))).toBe(true);
      });
  
      test('debe manejar valores nulos o undefined', () => {
        const result1 = validateRoutineData(null);
        const result2 = validateRoutineData(undefined);
  
        expect(result1.isValid).toBe(false);
        expect(result1.errors).toContain('Routine data is required');
        expect(result2.isValid).toBe(false);
        expect(result2.errors).toContain('Routine data is required');
      });
  
      test('debe rechazar pasos que no sean un array', () => {
        const routine = {
          titulo: 'Rutina',
          pasos: 'no es un array',
        };
  
        const result = validateRoutineData(routine);
  
        expect(result.isValid).toBe(false);
        expect(result.errors).toContain('Routine must have a valid pasos array');
      });
    });
  
    describe('Pruebas Negativas - calculateRoutineMetrics', () => {
      test('debe lanzar error con datos incompletos o erróneos', () => {
        expect(() => calculateRoutineMetrics(null)).toThrow('Invalid routine data');
        expect(() => calculateRoutineMetrics(undefined)).toThrow('Invalid routine data');
        expect(() => calculateRoutineMetrics('string')).toThrow('Invalid routine data');
      });
  
      test('debe lanzar error si no hay array de pasos', () => {
        const routine = {
          titulo: 'Rutina sin pasos',
        };
  
        expect(() => calculateRoutineMetrics(routine)).toThrow('Routine must have pasos array');
      });
  
      test('debe usar valor por defecto (180s) para tiempos inválidos', () => {
        const routine = {
          titulo: 'Rutina',
          pasos: [
            { nombre: 'Ejercicio 1', tiempo_estimado: NaN },
            { nombre: 'Ejercicio 2', tiempo_estimado: 'invalid' },
          ],
        };
  
        const result = calculateRoutineMetrics(routine);
  
        expect(result.totalDuration).toBe(360); 
      });
    });
  
    describe('Pruebas Negativas - formatTime', () => {
      test('debe manejar valores inválidos', () => {
        expect(formatTime(-10)).toBe('0:00');
        expect(formatTime(NaN)).toBe('0:00');
        expect(formatTime('string')).toBe('0:00');
        expect(formatTime(null)).toBe('0:00');
        expect(formatTime(undefined)).toBe('0:00');
      });
    });
  
    describe('Pruebas Negativas - getRoutineImage', () => {
      test('debe retornar imagen por defecto si no hay pasos', () => {
        const routine = { pasos: [] };
        const DEFAULT_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HXvApelNZvniviGtpKO4kpAfSw2aqJ.png";
  
        const result = getRoutineImage(routine);
  
        expect(result).toBe(DEFAULT_IMAGE);
      });
  
      test('debe retornar imagen por defecto si no hay imágenes válidas', () => {
        const routine = {
          pasos: [
            { nombre: 'Paso 1', imagen: '' },
            { nombre: 'Paso 2', imagen: null },
            { nombre: 'Paso 3' },
          ],
        };
        const DEFAULT_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HXvApelNZvniviGtpKO4kpAfSw2aqJ.png";
  
        const result = getRoutineImage(routine);
  
        expect(result).toBe(DEFAULT_IMAGE);
      });
  
      test('debe manejar rutina nula o sin pasos', () => {
        const DEFAULT_IMAGE = "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-HXvApelNZvniviGtpKO4kpAfSw2aqJ.png";
  
        expect(getRoutineImage(null)).toBe(DEFAULT_IMAGE);
        expect(getRoutineImage({})).toBe(DEFAULT_IMAGE);
        expect(getRoutineImage({ pasos: null })).toBe(DEFAULT_IMAGE);
      });
    });
  
    describe('Pruebas Negativas - calculateProgress', () => {
      test('debe retornar 0 si progresos no es un array', () => {
        const result = calculateProgress(null, 5);
  
        expect(result.completedSteps).toBe(0);
        expect(result.progress).toBe(0);
        expect(result.isCompleted).toBe(false);
      });
  
      test('debe retornar 0 si totalExercises es inválido', () => {
        const progresos = [{ estado: 'completado' }];
  
        expect(calculateProgress(progresos, 0).progress).toBe(0);
        expect(calculateProgress(progresos, -1).progress).toBe(0);
      });
    });
  
    // CASOS EXTREMOS
  
    describe('Casos Extremos', () => {
      test('debe manejar rutinas con muchos ejercicios', () => {
        const routine = {
          titulo: 'Rutina extensa',
          pasos: Array(100).fill({ nombre: 'Ejercicio', tiempo_estimado: 1 }),
        };
  
        const result = calculateRoutineMetrics(routine);
  
        expect(result.totalExercises).toBe(100);
        expect(result.totalDuration).toBe(6000); 
      });
  
      test('debe manejar tiempos muy pequeños', () => {
        const routine = {
          titulo: 'Rutina rápida',
          pasos: [{ nombre: 'Ejercicio rápido', tiempo_estimado: 0.1 }],
        };
  
        const result = calculateRoutineMetrics(routine);
  
        expect(result.totalDuration).toBe(6); 
      });
  
      test('debe formatear correctamente tiempos muy largos', () => {
        expect(formatTime(7200)).toBe('120:00'); 
        expect(formatTime(86400)).toBe('1440:00'); 
      });
    });
  
    // FUNCIONES ADICIONALES

  
    describe('validateRoutineParams', () => {
      test('debe validar parámetros correctos', () => {
        const result = validateRoutineParams(123, 456);
  
        expect(result.isValid).toBe(true);
        expect(result.errors).toHaveLength(0);
      });
  
      test('debe rechazar IDs inválidos', () => {
        expect(validateRoutineParams(null, 123).isValid).toBe(false);
        expect(validateRoutineParams(123, null).isValid).toBe(false);
        expect(validateRoutineParams('abc', 123).isValid).toBe(false);
        expect(validateRoutineParams(NaN, 123).isValid).toBe(false);
      });
    });
  
    describe('calculateTotalDuration', () => {
      test('debe sumar correctamente los tiempos usados', () => {
        const progresos = [
          { tiempo_usado: 120 },
          { tiempo_usado: 180 },
          { tiempo_usado: 90 },
        ];
  
        const result = calculateTotalDuration(progresos);
  
        expect(result).toBe(390);
      });
  
      test('debe ignorar valores no numéricos', () => {
        const progresos = [
          { tiempo_usado: 100 },
          { tiempo_usado: null },
          { tiempo_usado: 'invalid' },
          {},
        ];
  
        const result = calculateTotalDuration(progresos);
  
        expect(result).toBe(100);
      });
  
      test('debe retornar 0 para array vacío o inválido', () => {
        expect(calculateTotalDuration([])).toBe(0);
        expect(calculateTotalDuration(null)).toBe(0);
        expect(calculateTotalDuration(undefined)).toBe(0);
      });
    });
  
    describe('determineAssignmentState', () => {
      test('debe retornar "pendiente" si no hay pasos completados', () => {
        expect(determineAssignmentState(0, 5)).toBe('pendiente');
      });
  
      test('debe retornar "en_progreso" si hay pasos completados pero no todos', () => {
        expect(determineAssignmentState(2, 5)).toBe('en_progreso');
        expect(determineAssignmentState(4, 5)).toBe('en_progreso');
      });
  
      test('debe retornar "completada" si todos los pasos están completados', () => {
        expect(determineAssignmentState(5, 5)).toBe('completada');
        expect(determineAssignmentState(10, 10)).toBe('completada');
      });
    });
  });