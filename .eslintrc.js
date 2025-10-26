// .eslintrc.js
module.exports = {
    root: true,
    extends: [
      'expo',
      'eslint:recommended',
    ],
    env: {
      browser: true,
      node: true,
      es2021: true,
      'react-native/react-native': true,
    },
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
      ecmaVersion: 12,
      sourceType: 'module',
    },
    rules: {
      'react-hooks/exhaustive-deps': 'warn',
      'no-unused-vars': 'warn',
      'import/no-duplicates': 'warn',
      'import/no-named-as-default': 'warn',
    },
    overrides: [
      {
        // Configuración específica para archivos de test
        files: [
          '**/__tests__/**/*.[jt]s?(x)',
          '**/?(*.)+(spec|test).[jt]s?(x)',
          '**/jest.setup.js',
        ],
        env: {
          jest: true, // Esto habilita las variables globales de Jest
        },
        rules: {
          'no-undef': 'off', // Desactiva errores de variables no definidas en tests
        },
      },
    ],
  };