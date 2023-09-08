export default async () => ({
  rootDir: '../',
  bail: true,
  preset: "ts-jest",
  testEnvironment: "node",
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  verbose: true,
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.tsx'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/.jest/__mocks__/styleMock.ts",
    '^.+\\.(svg)$': '<rootDir>/.jest/__mocks__/svgrMock.tsx',
    '@components/(.*)$': '<rootDir>/src/components/$1',
    '@images/(.*)$': '<rootDir>/src/@images/$1',
    '@utils/(.*)$': '<rootDir>/src/@utils/$1',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{stories,test}.{ts,tsx}',
    '!src/@types/**/*.{ts,tsx}'
  ],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage'
  ],
  // Add ignores so ESM packages are not transformed by Jest
  transformIgnorePatterns: [
    '.*/node_modules/(?!(remark)/)',
    '^.+\\.module\\.(css|sass|scss)$',
  ]
});
