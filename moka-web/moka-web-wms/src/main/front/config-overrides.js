/* config-overrides.js */
const path = require('path');
const MonacoWebpackPlugin = require('@ssc/monaco-editor-webpack-plugin');
const { override, useBabelRc, disableEsLint, addWebpackAlias } = require('customize-cra');

const addPlugin = (config, env) => {
    // plugins
    config.plugins.push(
        new MonacoWebpackPlugin({
            languages: ['html', 'css', 'javascript', 'json', 'xml'],
            features: [
                'accessibilityHelp',
                'bracketMatching',
                'caretOperations',
                'clipboard',
                'codeAction',
                'codelens',
                'colorDetector',
                'comment',
                'contextmenu',
                'coreCommands',
                'cursorUndo',
                'dnd',
                'find',
                'folding',
                // 'fontZoom',
                'format',
                'gotoError',
                'gotoLine',
                'gotoSymbol',
                'hover',
                // 'iPadShowKeyboard',
                'inPlaceReplace',
                'inspectTokens',
                'linesOperations',
                'links',
                // 'multicursor',
                'parameterHints',
                // 'quickCommand',
                // 'quickOutline',
                // 'referenceSearch',
                'rename',
                // 'smartSelect',
                'snippets',
                'suggest',
                // 'toggleHighContrast',
                // 'toggleTabFocusMode',
                'transpose',
                'wordHighlighter',
                'wordOperations',
                'wordPartOperations'
            ]
        })
    );
    return config;
};

module.exports = override(
    useBabelRc(),
    disableEsLint(),
    addPlugin,
    addWebpackAlias({
        '~': path.resolve(__dirname, './src'),
        'moment/locale': path.resolve(__dirname, './node_modules/moment/locale'),
        moment: 'moment/moment.js'
    })
);
