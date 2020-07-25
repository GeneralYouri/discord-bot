const { Config, storeConfig } = require('./../config-handler');

const truthies = ['true', 'on', 'enable', 'enabled', 'active', 'activate'];
const falsies = ['false', 'off', 'disable', 'disabled', 'deactive', 'deactivate'];

const userSet = new Set(Config.autoPusers);

const execute = function execute(msg, commandName, type = undefined, name) {
    if (!type || type === 'status') {
        msg.channel.send(`Auto P Dispenser is currently ${Config.autoP ? `enabled for ${userSet.size} users` : 'disabled'}`);
    } else if (type === 'list') {
        const ids = Array.from(userSet.keys());
        const data = ids.map(id => `${msg.client.users.get(id).username}`);
        msg.channel.send('Auto P Dispenser users:\n' + data.join(', '));
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
    } else if (truthies.includes(type)) {
        Config.autoP = true;
        storeConfig();
        msg.channel.send('Enabled Auto P Dispenser');
    } else if (falsies.includes(type)) {
        Config.autoP = false;
        storeConfig();
        msg.channel.send('Disabled Auto P Dispenser');
    }
};

module.exports = {
    name: 'autop',
    description: 'Configure the Auto P Dispenser',
    usage: '<list|join|quit|add user|remove user|on|off>',
    cooldown: 5,
    execute,
};
