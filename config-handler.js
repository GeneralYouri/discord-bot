const fs = require('fs');

// Read from config from files and apply custom parsing rules
const loadConfig = function loadConfig() {
    try {
        const defaultConfig = require('./config.default.json');
        const environmentJson = require('./config.json');
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

const Config = loadConfig();

// Strip custom parsing rules and write to config.json
const storeConfig = function storeConfig() {
    const newConfig = Config;
    newConfig.autoPusers = Array.from(new Set(newConfig.autoPusers));

    const environmentJson = JSON.stringify(newConfig, null, 4);
    try {
        fs.writeFileSync(require.resolve('./config.json'), environmentJson, 'utf-8');
    } catch (e) {
        console.error('Could not write to config file', e);
        throw e;
    }
};

module.exports = { Config, loadConfig, storeConfig };
