module.exports = {
    globals: {
        "ts-jest": {
            tsConfig: "tsconfig.json"
        }
    },
    moduleFileExtensions: [
        "ts",
        "js"
    ],
    transform: {
        "^.+\\.(ts|tsx)$": "ts-jest"
    },
    testMatch: [
        "<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)",
        "<rootDir>/**/?(*.)+(spec|test).[jt]s?(x)"
    ],
    testEnvironment: "node"
};
