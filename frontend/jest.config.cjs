module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/config/jest.setup.ts'], // Path to Jest setup file
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy', // Mock CSS imports
  },
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'ts-jest', // Use ts-jest for TypeScript files
  },
};