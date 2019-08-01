module.exports = {
  collectCoverage: false,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/*test.{js,jsx}',
    '!**/test/**',
    '!**/node_modules/**',
    '!**/config/**',
    '!**/coverage/**',
  ],
  coverageDirectory: '<rootDir>/coverage',
  projects: [
    '<rootDir>/packages/data-model/jest.config.js',
    '<rootDir>/packages/api/jest.config.js',
  ],
}
