const { Config, storeConfig } = require('./../config-handler');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];
const requiresAdmin = ['add', 'remove', 'on', 'off'];

const userSet = new Set(Config.autoPusers);

const execute = function execute(msg, commandName, type = undefined, name) {
    if (truthies.includes(type)) {
        type = 'on';
    } else if (falsies.includes(type)) {
        type = 'off';
    }

    if (requiresAdmin.includes(type) && !Config.adminUsers.includes(msg.author.id)) {
        msg.reply('You\'re not allowed to use this command');
        return;
    }

    if (!type || type === 'status') {
        msg.channel.send(`Auto P Dispenser is currently ${Config.autoP ? `enabled for ${userSet.size} users` : 'disabled'}`);
    } else if (type === 'list') {
        const ids = Array.from(userSet.keys());
        const data = ids.map(id => `${msg.client.users.get(id).username}`);
        msg.channel.send(`Auto P Dispenser users:\n${data.join(', ')}`);
    } else if (type === 'join') {
        userSet.add(msg.author.id);
        Config.autoPusers = Array.from(userSet);
        storeConfig();
        msg.channel.send(`Added Auto P Dispenser for ${msg.author.username}`);
    } else if (type === 'quit') {
        userSet.delete(msg.author.id);
        Config.autoPusers = Array.from(userSet);
        storeConfig();
        msg.channel.send(`Removed Auto P Dispenser for ${msg.author.username}`);
    } else if (type === 'add') {
        const { id } = msg.client.users.find(user => user.username === name);
        userSet.add(id);
        Config.autoPusers = Array.from(userSet);
        storeConfig();
        msg.channel.send(`Added Jetlag Mode for ${name}`);
    } else if (type === 'remove') {
        const { id } = msg.client.users.find(user => user.username === name);
        userSet.delete(id);
        Config.autoPusers = Array.from(userSet);
        storeConfig();
        msg.channel.send(`Removed Jetlag Mode for ${name}`);
    } else if (type === 'on') {
        Config.autoP = true;
        storeConfig();
        msg.channel.send('Enabled Auto P Dispenser');
    } else if (type === 'off') {
        Config.autoP = false;
        storeConfig();
        msg.channel.send('Disabled Auto P Dispenser');
    }
};

module.exports = {
    name: 'autop',
    description: 'Configure the Auto P Dispenser',
    usage: '{list|join|quit|on|off} | {add|remove} <user>',
    cooldown: 5,
    execute,
};
