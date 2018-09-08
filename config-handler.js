const fs = require('fs');

// Read from config from files and apply custom parsing rules
const loadConfig = function loadConfig() {
    try {
        /* eslint-disable-next-line global-require */
        const config = require('./config.json');

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

    const configJson = JSON.stringify(newConfig, null, 4);
    try {
        fs.writeFileSync(require.resolve('./config.json'), configJson, 'utf-8');
    } catch (e) {
        console.error('Could not write to config file', e);
        throw e;
    }
};

module.exports = { Config, loadConfig, storeConfig };
