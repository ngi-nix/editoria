module.exports = {
  setupTestFrameworkScriptFile: '<rootDir>/__tests__/config/jestSetup.js',
  testEnvironment: 'jest-environment-db',
  testPathIgnorePatterns: [
    '<rootDir>/__tests__/config',
    '<rootDir>/__tests__/helpers',
    '<rootDir>/node_modules/',
  ],
}
