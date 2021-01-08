module.exports = {
    plugins: ['prettier'],
    extends: ['eslint:recommended', 'plugin:prettier/recommended'],
    parser: 'babel-eslint',
    parserOptions: {
        ecmaVersion: 7,
        sourceType: 'module',
        ecmaFeatures: {
            jsx: false,
            experimentalObjectRestSpread: true,
            spread: true,
        },
        rules: {
            quotes: ['error', 'single', { avoidEscape: true }],
            indent: ['error', 4],
        },
    },
    env: {
        browser: true,
        amd: true,
        node: true,
        jasmine: true,
        jquery: true,
        es6: true,
    },
    globals: {
        fabric: true,
        tui: true,
        loadFixtures: true,
    },
    rules: {
        'prettier/prettier': 'error',
        indent: ['warn', 4, { ArrayExpression: 'off', SwitchCase: 1 }],
        semi: [2, 'always'],
        'space-before-function-paren': ['error', 'never'],
        'no-useless-escape': 0,
        'no-unused-expressions': 0,
    },
};
