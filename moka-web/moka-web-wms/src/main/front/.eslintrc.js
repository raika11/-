module.exports = {
    extends: ['react-app', 'prettier'],
    plugins: ['prettier'],
    rules: {
        'prettier/prettier': ['warn', { endOfLine: 'auto' }],
        'no-console': ['error', { allow: ['warn', 'error', 'log'] }],
        camelcase: 0,
        indent: 0,
        dangerouslySetInnerHTML: 0
    }
};
