// Add any custom config to be passed to Jest
const customJestConfig = {
  rootDir: '../',
  // Add more setup options before each test is run
  setupFilesAfterEnv: ['<rootDir>/.jest/jest.setup.tsx'],
  // if using TypeScript with a baseUrl set to the root directory then you need the below for alias' to work
  moduleDirectories: ['node_modules', '<rootDir>/src'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    "\\.(css|less|sass|scss)$": "<rootDir>/__mocks__/styleMock.js",
    '^.+\\.(svg)$': '<rootDir>/.jest/__mocks__/svgrMock.tsx',
    '@components/(.*)$': '<rootDir>/src/components/$1',
    '@images/(.*)$': '<rootDir>/src/@images/$1',
    '@utils/(.*)$': '<rootDir>/src/@utils/$1'
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.{stories,test}.{ts,tsx}',
    '!src/@types/**/*.{ts,tsx}'
  ],
  // Add ignores so ESM packages are not transformed by Jest
  // note: this does not work with Next.js, hence workaround further down
  // see: https://github.com/vercel/next.js/issues/35634#issuecomment-1115250297
  // transformIgnorePatterns: ['node_modules/(?!(uuid|remark)/)'],
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/coverage'
  ]
}

async function jestConfig() {
  return customJestConfig
}

module.exports = jestConfig
