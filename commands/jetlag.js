const { Config, storeConfig } = require('../config-handler');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];
const requiresAdmin = ['add', 'remove', 'on', 'off'];

const userSet = new Map(Object.entries(Config.jetlagUsers ?? {}));

const execute = function execute(message, commandName, type = undefined, name = undefined, delay = undefined) {
    if (truthies.includes(type)) {
        type = 'on';
    } else if (falsies.includes(type)) {
        type = 'off';
    }

    if (requiresAdmin.includes(type) && !Config.adminUsers.includes(message.author.id)) {
        message.react('❌');
        message.reply('You\'re not allowed to use this command');
        return;
    }

    if (!type || type === 'status') {
        message.channel.send(`Jetlag Mode is currently ${Config.jetlagMode ? `enabled for ${userSet.size} users` : 'disabled'}`);
    } else if (type === 'on') {
        Config.jetlagMode = true;
        storeConfig();
        message.react('👍');
    } else if (type === 'off') {
        Config.jetlagMode = false;
        storeConfig();
        message.react('👍');
    } else if (type === 'list') {
        const ids = Array.from(userSet.keys());
        const data = ids.map(id => `${message.client.users.get(id).username} with a delay of ${userSet.get(id)} hrs`);
        message.channel.send('Jetlag Mode users:\n' + data.join('\n'));
    } else if (type === 'join') {
        delay = name;
        if (!delay) {
            message.reply('You didn\'t specify a jetlag delay');
            return;
        }
        userSet.set(message.author.id, delay);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        message.react('👍');
    } else if (type === 'quit') {
        userSet.delete(message.author.id);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        message.react('👍');
    } else if (type === 'add') {
        if (!delay) {
            message.reply('You didn\'t specify a jetlag delay');
            return;
        }
        const { id } = message.client.users.find(user => user.username === name);
        userSet.set(id, delay);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        message.react('👍');
    } else if (type === 'remove') {
        const { id } = message.client.users.find(user => user.username === name);
        userSet.delete(id);
        Config.jetlagUsers = Object.fromEntries(userSet.entries());
        storeConfig();
        message.react('👍');
    }
};

module.exports = {
    name: 'jetlag',
    description: 'Configure Jetlag Mode',
    usage: '{status|on|off|list|quit} | join <delay> | add <user> <delay> | remove <user>',
    cooldown: 5,
    execute,
};
