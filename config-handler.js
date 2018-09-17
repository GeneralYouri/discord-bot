const fs = require('fs');

let Config;

// Read from config from files and apply custom parsing rules
const loadConfig = function loadConfig() {
    try {
        /* eslint-disable-next-line global-require */
        const config = require('./config.json');

        config.debtStart = new Date(config.debtStart);

        Config = config;
        return config;
    } catch (e) {
        console.error('Could not read from config files', e);
        throw e;
    }
};

// Strip custom parsing rules and write to config.json
const storeConfig = function storeConfig() {
    const newConfig = Object.assign({}, Config);

    const configJson = JSON.stringify(newConfig, null, 4);
    try {
        fs.writeFileSync(require.resolve('./config.json'), configJson, 'utf-8');
    } catch (e) {
        console.error('Could not write to config file', e);
        throw e;
    }
};

Config = loadConfig();

module.exports = { Config, loadConfig, storeConfig };
