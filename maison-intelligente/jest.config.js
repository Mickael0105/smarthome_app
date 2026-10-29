// jest.config.js — Configuration Jest pour le projet Maison Intelligente
/** @type {import('jest').Config} */
module.exports = {
    testEnvironment: 'node',
    transform: {
        '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest',
    },
    testMatch: [
        '**/__tests__/**/*.(ts|tsx|js)',
        '**/*.test.(ts|tsx|js)',
        '**/*.spec.(ts|tsx|js)',
    ],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
    // Alias de modules React Native → mocks légers pour Node.js
    moduleNameMapper: {
        '^react-native$': '<rootDir>/__mocks__/react-native.js',
        '^expo-.*$': '<rootDir>/__mocks__/expo.js',
        '^@expo-google-fonts/.*$': '<rootDir>/__mocks__/expo.js',
        '^@/(.*)$': '<rootDir>/src/$1',
    },
    // Rapport de couverture de code (ciblé sur la logique métier et utilitaires)
    collectCoverageFrom: [
        'src/services/**/*.{ts,tsx}',
        'src/utils/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/services/HouseService.ts',
    ],
    coverageReporters: ['text', 'lcov', 'html'],
    coverageDirectory: 'coverage',
    // Seuils de couverture minimum (objectif soutenance)
    coverageThreshold: {
        global: {
            branches: 60,
            functions: 65,
            lines: 65,
            statements: 65,
        },
    },
    // forceExit : évite que les setInterval de MockService bloquent Jest
    forceExit: true,
    testTimeout: 10000,
    verbose: true,
};
