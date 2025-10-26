// jest.setup.js
// Configuración global para las pruebas de Jest

// Suprimir warnings específicos de consola durante tests
global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

// Mock de fetch global
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

// Limpiar todos los mocks después de cada test
afterEach(() => {
  jest.clearAllMocks();
});