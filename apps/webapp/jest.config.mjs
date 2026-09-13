/** @type {import('jest').Config} */
export default {
  preset: 'ts-jest/presets/default-esm',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'node',
  testMatch: ['<rootDir>/src/**/*.test.ts'],
  setupFiles: ['<rootDir>/jest.setup.ts'],
}
