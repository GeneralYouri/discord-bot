const Config = require('./../config-handler.js');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

module.exports = {
    name: 'autop',
    description: 'Configure the Auto P Dispenser',
    execute(msg, args) {
        const userSet = new Set(Config.get.autoPusers);

        if (args.length === 0 || (args.length === 1 && args[0] === 'list')) {
            msg.channel.send('Auto P Dispenser users: ' + Config.get.autoPusers.join(', '));
        } else if (args.length === 1) {
            if (truthies.includes(args[0])) {
                Config.set({ autoP: true });
                msg.channel.send('Enabled Auto P Dispenser');
            } else if (falsies.includes(args[0])) {
                Config.set({ autoP: false });
                msg.channel.send('Disabled Auto P Dispenser');
            } else if (args[0] === 'join') {
                userSet.add(msg.author.username);
                Config.set({ autoPusers: Array.from(userSet) });
                msg.channel.send('Auto P Dispenser users: ' + Config.get.autoPusers.join(', '));
            } else if (args[0] === 'quit') {
                userSet.delete(msg.author.username);
                Config.set({ autoPusers: Array.from(userSet) });
                msg.channel.send('Auto P Dispenser users: ' + Config.get.autoPusers.join(', '));
            }
        } else if (args[0] === 'add' || args[0] === 'delete') {
            const [type, ...names] = args;
            names.forEach(name => userSet[type](name));
            Config.set({ autoPusers: Array.from(userSet) });
            msg.channel.send('Auto P Dispenser users: ' + Config.get.autoPusers.join(', '));
        }
    },
};
