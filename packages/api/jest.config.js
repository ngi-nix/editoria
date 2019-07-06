module.exports = {
  displayName: 'api',
  testEnvironment: 'jest-environment-db',
  testRegex: '.*test.js$',
  testPathIgnorePatterns: [
    './config',
    './__tests__/helpers',
    './node_modules/',
  ],
}
