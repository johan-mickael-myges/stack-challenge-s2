module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^~(.*)$': '<rootDir>/src/$1'
    },
    roots: [
        "<rootDir>/src/tests"
    ],
    testMatch: ['**/tests/**/*.test.js']
};