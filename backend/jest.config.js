module.exports = {
    testEnvironment: 'node',
    moduleNameMapper: {
        '^~(.*)$': '<rootDir>/src/$1'
    },
    roots: [
        "<rootDir>/src/tests"
    ],
};