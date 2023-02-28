/** @type {import('@ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  coverageDirectory: 'coverage',
  transformIgnorePatterns: ['node_modules/(?!(@babel/runtime)/)'],
  collectCoverage: true,
  coverageThreshold: {
    './src/': {
      branches: 90,
      functions: 95,
      lines: 90,
      statements: 90,
    },
  },
}
