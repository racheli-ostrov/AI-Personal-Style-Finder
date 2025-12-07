module.exports = {
  testEnvironment: 'node',
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/**/*.js',
    '!src/server.js',
    '!src/services/geminiService.js' // Skip Gemini service (requires API key)
  ],
  testMatch: [
    '**/tests/**/*.test.js'
  ],
  coverageThreshold: {
    global: {
      branches: 20,
      functions: 45,
      lines: 35,
      statements: 35
    }
  },
  setupFiles: ['<rootDir>/tests/setup.js']
};
