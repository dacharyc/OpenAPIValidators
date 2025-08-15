/**
 * Jest config for ESM/TypeScript using ts-jest and NodeNext for ESM-only dependencies like axios
 */
module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts', '.mts'],
  transform: {
    '^.+\\.(ts|mts|js|mjs)$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: './tsconfig.jest-esm.json',
      },
    ],
  },
  globals: {
    'ts-jest': {
      useESM: true,
      tsconfig: './tsconfig.jest-esm.json',
    },
  },
};
