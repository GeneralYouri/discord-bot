const fs = require('fs');
const defaultConfig = require('./config.default.js');

// Apply custom parsing rules
const loadConfig = function loadConfig() {
    try {
        const environmentJson = fs.readFileSync(require.resolve('./config.json'), 'utf-8');
        const environmentConfig = JSON.parse(environmentJson);
        const config = Object.assign({}, defaultConfig, environmentConfig);

        config.autoPusers = Array.from(new Set(config.autoPusers));
        config.debtStart = new Date(config.debtStart);

        return config;
    } catch (e) {
        console.error('Could not read from config files', e);
        throw e;
    }
};

// Strip custom parsing rules
const storeConfig = function storeConfig(config) {
    config.autoPusers = Array.from(new Set(config.autoPusers));

    const environmentJson = JSON.stringify(config, null, 4);
    try {
        fs.writeFileSync(require.resolve('./config.json'), environmentJson, 'utf-8');
    } catch (e) {
        console.error('Could not read from config files', e);
        throw e;
    }
};

const Config = (function Config() {
    const config = loadConfig();

    const set = function set(changes = {}) {
        Object.assign(config, changes);
        storeConfig(config);
    };

    return {
        get: config,
        set,
    };
}());

module.exports = Config;
