// jest.config.js
module.exports = {
  // No usamos preset de jest-expo para evitar conflictos
  testEnvironment: 'node',
  
  // Archivos de setup
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Patrones de archivos de test
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
  
  // Archivos a incluir en cobertura
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/**/*.test.{js,jsx}',
    '!src/**/__tests__/**',
  ],
  
  // Umbrales de cobertura
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50,
    },
  },
  
  // Directorio de cobertura
  coverageDirectory: 'coverage',
  
  // Formatos de reporte
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov',
    'json-summary',
  ],
  
  // Transformaciones - ignorar node_modules excepto algunos paquetes
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|@expo|@react-navigation)/)',
  ],
  
  // Mapeo de módulos
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Timeout
  testTimeout: 10000,
  
  // Verbose
  verbose: true,
  
  // Limpiar mocks
  clearMocks: true,
  restoreMocks: true,
};