'use strict';

const paths = require('./paths');

// This is the development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
    return {
        module: {
            rules: [
                // First, run the linter.
                // It's important to do this before Babel processes the JS.
                {
                    test: /\.(js|mjs|jsx|ts|tsx)$/,
                    enforce: 'pre',
                    use: [
                        {
                            options: {
                                cache: true,
                                eslintPath: require.resolve('eslint'),
                                formatter: require.resolve('react-dev-utils/eslintFormatter'),
                                resolvePluginsRelativeTo: __dirname
                            },
                            loader: require.resolve('eslint-loader')
                        }
                    ],
                    include: paths.appSrc
                }
            ]
        }
    };
};
