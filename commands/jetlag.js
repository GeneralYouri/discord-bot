const { Config, storeConfig } = require('./../config-handler');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

const execute = function execute(msg, commandName, type = undefined) {
    if (!type || type === 'list') {
        msg.channel.send('Jetlag Mode is currently ' + (Config.jetlagMode ? 'enabled' : 'disabled'));
    } else if (truthies.includes(type)) {
        Config.jetlagMode = true;
        storeConfig();
        msg.channel.send('Enabled Jetlag Mode');
    } else if (falsies.includes(type)) {
        Config.jetlagMode = false;
        storeConfig();
        msg.channel.send('Disabled Jetlag Mode');
    }
};

module.exports = {
    name: 'jetlag',
    description: 'Configure Jetlag Mode',
    usage: '<list|on|off>',
    cooldown: 5,
    execute,
};
