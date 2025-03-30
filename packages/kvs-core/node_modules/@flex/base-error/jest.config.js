const config = {
  moduleFileExtensions: ['js', 'json'],
  verbose: true,
  testRegex: 'dist/tests/.*\\.test\\.js$',
  transform: { },
  testEnvironment: 'node',
  roots: ['<rootDir>/dist/tests'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'interfaces',
    'jestGlobalMocks.js',
    '.module.js',
    'src/main.js',
    '.mock.js',
    'src/database'
  ],
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: ['**/*.js'],
  coverageDirectory: '../coverage'
};

export default config;
