const config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  verbose: true,
  testRegex: 'tests/.*\\.test\\.ts$',
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        diagnostics: {
          warnOnly: true
        }
      }
    ]
  },
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  coveragePathIgnorePatterns: [
    'node_modules',
    'test-config',
    'interfaces',
    'jestGlobalMocks.js',
    '.module.js',
    'src/main.js',
    '.mock.js',
    'src/database',
  ],
  coverageReporters: ['text', 'html'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: './coverage',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  testEnvironmentOptions: {
    NODE_OPTIONS: '--experimental-vm-modules'
  }
};

export default config; 