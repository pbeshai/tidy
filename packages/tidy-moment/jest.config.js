module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  cacheDirectory: './.jestCache',
  modulePathIgnorePatterns: ['/dist/', '<rootDir>/lib', '<rootDir>/esm'],
};
