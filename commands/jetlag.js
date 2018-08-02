const Config = require('./../config-handler.js');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

module.exports = {
    name: 'jetlag',
    description: 'Configure Jetlag Mode',
    execute(msg, args) {
        if (args.length === 0) {
            msg.channel.send('Jetlag Mode is currently ' + (Config.get.jetlagMode ? 'enabled' : 'disabled'));
        } else if (truthies.includes(args[0])) {
            Config.set({ jetlagMode: true });
            msg.channel.send('Enabled Jetlag Mode');
        } else if (falsies.includes(args[0])) {
            Config.set({ jetlagMode: false });
            msg.channel.send('Disabled Jetlag Mode');
        }
    },
};
