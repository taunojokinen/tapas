module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['./config/jest.setup.ts'], // huomaa <rootDir>
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS imports
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest', // Use ts-jest for TypeScript files
  },
};