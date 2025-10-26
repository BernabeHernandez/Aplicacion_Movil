global.console = {
  ...console,
  warn: jest.fn(),
  error: jest.fn(),
};

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    status: 200,
    json: () => Promise.resolve({}),
    text: () => Promise.resolve(''),
  })
);

afterEach(() => {
  jest.clearAllMocks();
});