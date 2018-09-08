const { Config, storeConfig } = require('./../config-handler');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

const execute = function execute(msg, args) {
    if (args.length === 0) {
        msg.channel.send('Jetlag Mode is currently ' + (Config.jetlagMode ? 'enabled' : 'disabled'));
    } else if (truthies.includes(args[0])) {
        Config.jetlagMode = true;
        storeConfig();
        msg.channel.send('Enabled Jetlag Mode');
    } else if (falsies.includes(args[0])) {
        Config.jetlagMode = false;
        storeConfig();
        msg.channel.send('Disabled Jetlag Mode');
    }
};

module.exports = {
    name: 'jetlag',
    description: 'Configure Jetlag Mode',
    execute,
};
