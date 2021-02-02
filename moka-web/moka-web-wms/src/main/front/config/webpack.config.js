'use strict';

// This is the production and development configuration.
// It is focused on developer experience, fast rebuilds, and a minimal bundle.
module.exports = function (webpackEnv) {
    return require('./webpack.' + webpackEnv + '.config.js')(webpackEnv);
};
