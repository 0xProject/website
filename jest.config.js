module.exports = {
    roots: ['<rootDir>/ts'],
    testMatch: ['**/__tests__/**/*.+(ts|tsx|js)', '**/?(*.)+(spec|test).+(ts|tsx|js)'],
    transform: {
        ".+\\.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$": "jest-transform-stub",
        '^.+\\.(ts|tsx)$': 'ts-jest',
    },
    moduleNameMapper: {
        "^.+.(css|styl|less|sass|scss|png|jpg|ttf|woff|woff2|svg)$": "jest-transform-stub",
        '^ts/(.*)$': '<rootDir>/ts/$1',
    }
};
